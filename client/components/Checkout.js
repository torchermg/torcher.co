import _ from "lodash";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import React, {
	useRef,
	useReducer,
	useState,
	useContext,
	useEffect,
} from "react";
import { Redirect } from "react-router-dom";
import gql from "graphql-tag";
import styled, { withTheme } from "styled-components";
import importedComponent from "react-imported-component";

import {
	Corset,
	SectionHeader,
	TextInput,
	CheckboxInput,
	BaseButton,
	SolidButton,
	FancyRadioButton,
	HollowButton,
	Select,
	ForegroundLink,
	producerLinks,
	Loading,
} from "/components/common";
import { checkName, checkEmail, checkCharityId } from "/shared/validation";
import { licensesById } from "/shared/licenses";
import { productionsById } from "/shared/productions";
import {
	showNotification,
	showErrorNotification,
	getGraphQLErrorMessage,
	showGraphQLErrorNotification,
	formatCurrency,
} from "/utils";
import { store } from "/store";

const MAKE_ORDER = gql`
	mutation makeOrder($request: MakeOrderRequest!) {
		makeOrder(request: $request)
	}
`;

const PROMO_DISCOUNT_RATE = gql`
	query promoDiscountRate($promoCode: String!) {
		promoDiscountRate(promoCode: $promoCode)
	}
`;

const HorizontalSplit = styled.div`
	display: flex;
	${(props) =>
		props.justifyContent && `justify-content: ${props.justifyContent};`}
	${(props) => props.alignItems && `align-items: ${props.alignItems};`}
	> * {
		:not(:last-child) {
			margin-right: 0.5rem;
		}
	}
`;

const EmailDisclaimer = styled.p`
	font-size: 0.7rem;
`;

const CharityMessage = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	> *:not(:last-child) {
		margin-right: 1rem;
	}
`;

const Percent = styled.div`
	font-weight: bold;
	font-size: 4rem;
`;

const AfterPercent = styled.div`
	font-size: 1.5rem;
`;

const Charities = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: row;
	> * {
		flex-basis: 100%;
		:not(:last-child) {
			margin-right: 1rem;
		}
	}
`;
const PromoCodeInput = styled(TextInput)`
	text-transform: uppercase;
	::placeholder {
		text-transform: none;
	}
`;

const SubmitButtonContainer = styled.div`
	text-align: right;
`;

const P = styled.div`
	margin: 1rem 0;
`;

const SubmitButton = styled(SolidButton)``;

const checkAgreedToLicenses = (agreed) => {
	if (agreed) return;
	return "Please read and agree to the License Agreement(s).";
};

const DropIn = importedComponent(() => import("braintree-web-drop-in-react"));

const Checkout = ({ theme }) => {
	const { state, dispatch } = useContext(store);
	const [instance, setInstance] = useState(null);
	const [checkedPromo, setCheckedPromo] = useState(null);
	const [checkoutStage, setCheckoutStage] = useState(0);

	const cartItems = state.persisted.cartItems;

	const [form, setForm] = useReducer(
		(state, update) => ({ ...state, ...update }),
		{
			name: "",
			email: "",
			wantsMarketing: false,
			promoCode: "",
			charityId: null,
			agreedToLicenses: false,
		}
	);

	const [formIds, setFormIds] = useState(
		() =>
			new Map(
				["wantsMarketing", "agreedToLicenses"].map((key) => [key, _.uniqueId()])
			)
	);

	const onChange = (event) => {
		const field = event.target.getAttribute("name");
		const isCheckbox = event.target.getAttribute("type") === "checkbox";
		const value = isCheckbox ? event.target.checked : event.target.value;
		setForm({ [field]: value });
	};

	const [
		queryPromoDiscount,
		{
			loading: promoDiscountLoading,
			error: promoDiscountError,
			data: promoDiscountData,
		},
	] = useLazyQuery(PROMO_DISCOUNT_RATE, {
		onError: showGraphQLErrorNotification,
		onCompleted: () => showNotification("Promo successfully applied!"),
	});
	const applyPromo = (event) => {
		event.preventDefault();
		setCheckedPromo(form.promoCode);
		queryPromoDiscount({ variables: { promoCode: form.promoCode } });
	};

	const promoValidity = (() => {
		if (!form.promoCode) return;
		if (form.promoCode !== checkedPromo) return "Apply the promo first.";
		if (promoDiscountData) return;
		if (promoDiscountError) return getGraphQLErrorMessage(promoDiscountError);
		if (promoDiscountLoading) return "Checking promo code...";
	})();

	const onOrderCompleted = () => {
		dispatch({ type: "cart-empty" });
	};

	const [
		makeOrder,
		{ loading: makeOrderLoading, data: makeOrderData },
	] = useMutation(MAKE_ORDER, {
		onError: showGraphQLErrorNotification,
		onCompleted: onOrderCompleted,
	});

	const buy = async (event) => {
		event.preventDefault();
		const { name, email, promoCode, wantsMarketing } = form;
		let nonce;
		try {
			nonce = (await instance.requestPaymentMethod()).nonce;
		} catch (error) {
			if (error.message === "No payment method is available.") {
				showErrorNotification("Please check your payment information.");
			}
			return;
		}
		const request = {
			nonce,
			cartItems,
			name,
			email,
			wantsMarketing,
			promoCode,
		};
		await makeOrder({ variables: { request } });
	};

	const subtotal = cartItems.reduce((subtotal, cartItem) => {
		return subtotal + licensesById.get(cartItem.licenseId).price;
	}, 0);
	const subtotalString = formatCurrency(subtotal, false, false);

	const discountFraction =
		(promoDiscountData && promoDiscountData.promoDiscountRate) || 0;

	const discount = Math.floor(subtotal * discountFraction);
	const discountString = `-${formatCurrency(discount, false, false)}`;

	const total = subtotal - discount;
	const totalString = formatCurrency(total, false, false);

	if (makeOrderData) {
		return <Redirect to={`/receipt/${makeOrderData.makeOrder}`} />;
	}

	return (
		<div>
			<SectionHeader>Checkout</SectionHeader>
			<form onChange={onChange} onSubmit={buy}>
				<P>
					<TextInput
						name="name"
						type="text"
						value={form.name}
						onChange={onChange}
						placeholder="Name"
						customValidity={checkName(form.name)}
					/>
				</P>
				<P>
					<TextInput
						name="email"
						type="email"
						value={form.email}
						onChange={onChange}
						placeholder="Email address"
						customValidity={checkEmail(form.email)}
					/>
				</P>
				<P>
					<HorizontalSplit>
						<CheckboxInput
							id={formIds.get("wantsMarketing")}
							name="wantsMarketing"
							checked={form.wantsMarketing}
							onChange={onChange}
						/>
						<label htmlFor={formIds.get("wantsMarketing")}>
							I want marketing emails (at most once a month)
						</label>
					</HorizontalSplit>
				</P>
				<P>
					<HorizontalSplit>
						<PromoCodeInput
							name="promoCode"
							type="text"
							value={form.promoCode}
							onChange={onChange}
							placeholder="Promo code"
							customValidity={promoValidity}
						/>
						{form.promoCode && (
							<HollowButton onClick={applyPromo}>Apply</HollowButton>
						)}
					</HorizontalSplit>
				</P>
				<P>
					<HorizontalSplit justifyContent="space-between">
						<div>Subtotal</div>
						<div>{subtotalString}</div>
					</HorizontalSplit>
					<HorizontalSplit justifyContent="space-between">
						<div>Discount</div>
						<div>{discountString}</div>
					</HorizontalSplit>
					<HorizontalSplit justifyContent="space-between">
						<div>Total</div>
						<div>{totalString}</div>
					</HorizontalSplit>
				</P>
				<P>
					<HorizontalSplit>
						<CheckboxInput
							id={formIds.get("agreedToLicenses")}
							name="agreedToLicenses"
							checked={form.agreedToLicenses}
							onChange={onChange}
							customValidity={checkAgreedToLicenses(form.agreedToLicenses)}
						/>
						<label htmlFor={formIds.get("agreedToLicenses")}>
							I have read and agreed to the applicable License Agreement(s).
						</label>
					</HorizontalSplit>
				</P>
				<P style={{ color: "initial" }}>
					<DropIn
						options={{
							authorization: process.env.BRAINTREE_TOKENIZATION_KEY,
							// paypal: {
							// 	amount: total / 100,
							// 	currency: "USD",
							// 	flow: "checkout",
							// },
							// venmo: true,
						}}
						onInstance={(instance) => setInstance(instance)}
					/>
				</P>
				<P>
					<SubmitButton colorHover type="submit">
						{makeOrderLoading ? (
							<Loading color={theme.background} />
						) : (
							"Purchase"
						)}
					</SubmitButton>
				</P>
			</form>
		</div>
	);
};

export default withTheme(Checkout);
