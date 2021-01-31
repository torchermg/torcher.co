import { notify } from "react-notify-toast";

import constants from "/shared/constants";
import { productionsById } from "/shared/productions";

export const showNotification = (message, type = "success") => {
	notify.hide();
	notify.show(message, type);
};

export const showErrorNotification = (error) => {
	showNotification(error, "error");
	console.error(error);
};

export const getGraphQLErrorMessage = (graphQLError) => {
	const { graphQLErrors } = graphQLError;
	if (graphQLErrors && graphQLErrors.length) {
		return graphQLErrors.map(graphQLError => graphQLError.message).join("\n");
	}
	return graphQLError.message;
};

export const showGraphQLErrorNotification = (graphQLError) => {
	showErrorNotification(getGraphQLErrorMessage(graphQLError));
};

export const shareProduction = async (productionId) => {
	const production = productionsById.get(productionId);
	const url = `${constants.ADDRESS}/production/${productionId}`;
	try {
		await navigator.share({
			title: `Torcher — ${production.title}`,
			url
		});
	} catch {
		try {
			await navigator.clipboard.writeText(url);
			showNotification("Link copied.", "success");
		} catch {
			window.prompt("", url);
		}
	}
};

export const formatTime = (time) => {
	const minutes = Math.floor(time / 60);
	const seconds = Math.round(time % 60).toString().padStart(2, "0");
	return `${minutes}:${seconds}`;
};

export const formatCurrency = (cents, longForm = false, allowTruncation = false) => {
	const dollars = cents / 100;
	let amountString;
	if (cents % 100 === 0 && allowTruncation) {
		amountString = `${dollars}`;
	} else {
		amountString = `${dollars.toFixed(2)}`;
	}
	if (longForm) {
		return `${amountString} USD`;
	} else {
		return `$${amountString}`;
	}
};

export const zeroPad = (number, maximum) => {
	const digits = maximum.toString().length;
	return String(number).padStart(digits, "0");
}
