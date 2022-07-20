import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { gql } from "@apollo/client";
import Helmet from "react-helmet";

import {
	H1,
	Corset,
	Strong,
	THead,
	HollowA,
	ForegroundLink,
} from "/components/common";
import NotFound from "/pages/NotFound";
import DownloadSvg from "/svg/download.svg";
import { showGraphQLErrorNotification } from "/utils";
import { productionsById } from "/shared/productions";
import { licensesById } from "/shared/licenses";
import { formatCurrency } from "/utils";

const ORDER = gql`
	query order($id: ID!) {
		order(orderId: $id) {
			id
			user {
				name
				email
			}
			orderItems {
				productionId
				licenseId
				price
				downloadUrl
			}
			date
			discount
			subtotal
			total
		}
	}
`;

const P = styled.p`
	margin: 0;
`;

const OrderTable = styled.table`
	min-width: 480px;
	margin: 2rem 0;
	width: 100%;
	border-collapse: collapse;
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

const Amounts = styled.div`
	float: right;
`;

const HorizontalSplit = styled.div`
	width: 100%;
	min-width: 10rem;
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

export default ({}) => {
	const { id } = useParams();
	const { loading, error, data } = useQuery(ORDER, {
		onError: showGraphQLErrorNotification,
		variables: { id },
	});

	if (loading) return "Loading...";
	if (error) {
		if (
			error.graphQLErrors &&
			error.graphQLErrors.find(
				({ extensions }) => extensions.code === "NOT_FOUND"
			)
		) {
			return <NotFound />;
		}
		return error.message;
	}

	const orderTableRows = data.order.orderItems.map((orderItem, index) => {
		const production = productionsById.get(orderItem.productionId);
		const license = licensesById.get(orderItem.licenseId);
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
					<ForegroundLink to={`/license/${license.id}`}>
						{license.name}
					</ForegroundLink>
				</td>
				<td>
					<HollowA href={orderItem.downloadUrl} colorStroke nonScalingStroke>
						<DownloadSvg /> Download
					</HollowA>
				</td>
				<td style={{ whiteSpace: "nowrap" }}>
					{formatCurrency(orderItem.price, true, true)}
				</td>
			</tr>
		);
	});

	const dateString = new Date(
		data.order.date.replace(/-/g, "/")
	).toLocaleDateString();
	return (
		<Corset>
			<Helmet>
				<title>Your Order · Torcher</title>
			</Helmet>
			<H1>Your Order</H1>
			<P>
				<Strong>Name:</Strong> {data.order.user.name}
			</P>
			<P>
				<Strong>Email Address:</Strong> {data.order.user.email}
			</P>
			<P>
				<Strong>Date:</Strong> {dateString}
			</P>
			<P>
				<Strong>Order ID:</Strong> {data.order.id}
			</P>
			<OrderTable>
				<THead>
					<tr>
						<th colSpan="2" scope="col">
							Production
						</th>
						<th scope="col">License</th>
						<th scope="col">Download</th>
						<th style={{ width: 0 }} scope="col">
							Price
						</th>
					</tr>
				</THead>
				<tbody>{orderTableRows}</tbody>
			</OrderTable>
			<Amounts>
				<HorizontalSplit justifyContent="space-between">
					<div>Subtotal:</div>
					<div>{formatCurrency(data.order.subtotal)}</div>
				</HorizontalSplit>
				<HorizontalSplit justifyContent="space-between">
					<div>Discount:</div>
					<div>{formatCurrency(data.order.discount)}</div>
				</HorizontalSplit>
				<HorizontalSplit justifyContent="space-between">
					<div>Total:</div>
					<div>{formatCurrency(data.order.total)}</div>
				</HorizontalSplit>
			</Amounts>
		</Corset>
	);
};
