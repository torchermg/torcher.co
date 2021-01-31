import _ from "lodash";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import React, { useContext } from "react";
import styled, { withTheme } from "styled-components";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

import { store } from "/store";
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
	THead,
} from "/components/common";
import Checkout from "/components/Checkout";
import { licensesById } from "/shared/licenses";
import { productionsById } from "/shared/productions";

import {
	getGraphQLErrorMessage,
	showGraphQLErrorNotification,
	formatCurrency,
} from "/utils";

const Container = styled(Corset)`
	display: flex;
	flex-direction: row;
	> * {
		:not(:last-child) {
			margin-right: 0.5rem;
		}
	}
	@media screen and (max-width: 960px) {
		flex-direction: column;
	}
`;

const BagSection = styled.div`
	flex: 1 1 50%;
	padding: 1.5rem 0;
`;
const BagTable = styled.table`
	width: 100%;
	border-spacing: 0 0.25rem;
	text-align: left;
`;

const Cover = styled.img`
	display: block;
	height: 3rem;
	margin-right: 1rem;
	// @media screen and (max-width: 800px) {
	// 	width: 0;
	// }
	background: red;
`;
const Title = styled(ForegroundLink)`
	font-size: 1.2rem;
`;

const CheckoutSection = styled.div`
	flex: 1 1 50%;
	box-sizing: border-box;
	border-radius: 6px;
	border: 1px solid ${(props) => props.theme.foreground};
	padding: 1.5rem 2rem;
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

const Bag = ({ theme }) => {
	const { state, dispatch } = useContext(store);

	const cartItems = state.persisted.cartItems;

	const onChangeLicense = (event) => {
		dispatch({
			type: "cart-set-item-license",
			cartIndex: +event.currentTarget.dataset.index,
			licenseId: event.currentTarget.value,
		});
	};

	const onRemoveItem = (event) => {
		dispatch({
			type: "cart-remove-item",
			cartIndex: +event.currentTarget.dataset.index,
		});
	};

	const bagTableRows = cartItems.map((cartItem, index) => {
		const production = productionsById.get(cartItem.productionId);
		const license = licensesById.get(cartItem.licenseId);
		return (
			<tr key={index}>
				<td style={{ width: 0 }}>
					<Cover src={production.coverUrl128} />
				</td>
				<td>
					<div>
						<ForegroundLink to={`/library/${production.id}`}>
							{production.title}
						</ForegroundLink>
					</div>
				</td>
				<td>
					{/* <Select */}
					{/* 	colorHover */}
					{/* 	value={cartItem.licenseId} */}
					{/* 	onChange={onChangeLicense} */}
					{/* 	disabled={production.licenses.length <= 1} */}
					{/* 	data-index={index} */}
					{/* > */}
					{/* 	{production.licenses.map(licenseId => ( */}
					{/* 		<option value={licenseId} key={licenseId}> */}
					{/* 			{licensesById.get(licenseId).name} */}
					{/* 		</option> */}
					{/* 	))} */}
					{/* </Select> */}
					<ForegroundLink to={`/license/${license.id}`}>
						{license.name}
					</ForegroundLink>
				</td>
				<td>{formatCurrency(license.price, true, true)}</td>
				<td>
					<BaseButton onClick={onRemoveItem} data-index={index}>
						<Icon
							path={mdiClose}
							size={1}
							color={theme.foreground}
						/>
					</BaseButton>
				</td>
			</tr>
		);
	});

	const bagTableOrEmpty = (() => {
		if (!cartItems.length) {
			return "Your bag is empty.";
		}
		return (
			<BagTable>
				<THead>
					<tr>
						<th colSpan="2" scope="col">
							Production
						</th>
						<th scope="col">License</th>
						<th scope="col">Price</th>
						<th></th>
					</tr>
				</THead>
				<tbody>{bagTableRows}</tbody>
			</BagTable>
		);
	})();

	const checkoutSection = (() => {
		if (!cartItems.length) return null;
		return (
			<CheckoutSection>
				<Checkout />
			</CheckoutSection>
		);
	})();

	return (
		<Container>
			<BagSection>
				<SectionHeader>Bag</SectionHeader>
				{bagTableOrEmpty}
			</BagSection>
			{checkoutSection}
		</Container>
	);
};

export default withTheme(Bag);
