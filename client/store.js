import React, { createContext, useReducer, useEffect } from "react";
import { EventTarget } from "event-target-shim";

import { showNotification } from "/utils";
import productions, { productionsById } from "/shared/productions";
import tracks, { tracksById } from "/shared/tracks";

const SCHEMA_VERSION = 9;
const STORAGE_KEY = "persisted";
const SYNC_ACTION = "_sync";
const INITIAL_STATE = {};
const INITIAL_PERSISTED = {
	cartItems: [],
	playingTrackId: null,
	_schema_version: SCHEMA_VERSION,
};

const store = createContext();
const { Provider } = store;

const loadStorage = (stored, fallback) => {
	if (stored) {
		try {
			const parsed = JSON.parse(stored);
			if (parsed._schema_version === SCHEMA_VERSION) return parsed;
		} catch {}
	}
	return fallback;
};

const initialState = {
	...INITIAL_STATE,
	persisted: loadStorage(localStorage.getItem(STORAGE_KEY), INITIAL_PERSISTED),
};

const reducers = {
	"play-track": (state, { trackId }) => {
		if (!tracksById.get(trackId)) return state;
		return {
			...state,
			persisted: {
				...state.persisted,
				playingTrackId: trackId,
			},
		};
	},
	"cart-add": (state, { productionId, licenseId }) => {
		return {
			...state,
			persisted: {
				...state.persisted,
				cartItems: [...state.persisted.cartItems, { productionId, licenseId }],
			},
		};
	},
	"cart-set-item-license": (state, { cartIndex, licenseId: newLicenseId }) => {
		const cartItems = state.persisted.cartItems.map(
			({ productionId, licenseId }, index) => {
				return {
					productionId,
					licenseId: index === cartIndex ? newLicenseId : licenseId,
				};
			}
		);
		return {
			...state,
			persisted: {
				...state.persisted,
				cartItems,
			},
		};
	},
	"cart-remove-item": (state, { cartIndex }) => {
		const cartItems = state.persisted.cartItems.filter(
			(item, index) => index !== cartIndex
		);
		return {
			...state,
			persisted: {
				...state.persisted,
				cartItems,
			},
		};
	},
	"cart-empty": (state) => {
		return {
			...state,
			persisted: {
				...state.persisted,
				cartItems: [],
			},
		};
	},
};

const StateProvider = ({ children }) => {
	const [state, dispatch] = useReducer((state, action) => {
		if (action.type === SYNC_ACTION) {
			const persisted = action.persisted;
			return {
				...state,
				persisted,
			};
		}
		if (!reducers[action.type]) return state;
		const newState = reducers[action.type](state, action);

		if (state.persisted !== newState.persisted) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newState.persisted));
		}

		return newState;
	}, initialState);

	const handleStorage = (event) => {
		if (event.key !== STORAGE_KEY) return;
		dispatch({
			type: SYNC_ACTION,
			persisted: loadStorage(event.newValue, state.persisted),
		});
	};

	useEffect(() => {
		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

// Use an EventTarget for dispatching one-off events that have side effects.
// The reducer pattern isn't great for triggering a "play" event, for example.
class Emitter extends EventTarget {
	requestPlay() {
		this.dispatchEvent(new Event("play-request"));
	}
}
const emitter = new Emitter();

export { store, StateProvider, emitter };
