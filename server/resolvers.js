import apolloServerExpress from "apollo-server-express";
import ApolloServer from "apollo-server";
import "isomorphic-fetch";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

import { getSignedUrl } from "./s3.js";
import { db } from "./db.js";
import typeDefs from "./shared/typeDefs.js";
import { charge } from "./braintree.js";
import { checkName, checkEmail } from "./shared/validation.js";
import { productionsById } from "./shared/productions.js";
import { licensesById } from "./shared/licenses.js";
import { sendReceipt, validateEmail } from "./mail.js";

import { byCode as promosByCode, isPromoActive } from "./promos.js";

const { UserInputError, ApolloError } = ApolloServer;

export default {
	Query: {
		ping: () => "pong",
		promoDiscountRate: (parent, { promoCode: rawPromoCode }) => {
			const promoCode = rawPromoCode.toUpperCase();
			const promo = promosByCode.get(promoCode);
			if (!promo) {
				throw new UserInputError("Invalid promo code!");
			}
			if (!isPromoActive(promo)) {
				throw new ApolloError("That promo is no longer active!");
			}
			return promo.discountRate;
		},
		order: async (parent, { orderId }) => {
			const order = await db.get(
				"SELECT created_at, email, discount, subtotal, total FROM torcher_order WHERE id = ?",
				orderId
			);
			if (!order) throw new UserInputError("Order not found!");
			const orderItems = await db.all(
				"SELECT production_id, license_id, price FROM torcher_order_item WHERE order_id = ?",
				orderId
			);
			return {
				id: orderId,
				email: order.email,
				date: order.created_at,
				discount: order.discount,
				subtotal: order.subtotal,
				total: order.total,
			};
		},
	},
	Order: {
		user: async (parent) => {
			const user = await db.get(
				"SELECT name FROM torcher_user WHERE email = ?",
				parent.email
			);
			return {
				name: user.name,
				email: parent.email,
			};
		},
		orderItems: async (parent) => {
			const orderItems = await db.all(
				"SELECT production_id, license_id, price FROM torcher_order_item WHERE order_id = ?",
				parent.id
			);
			return orderItems.map((orderItem) => {
				const production = productionsById.get(orderItem.production_id);
				const downloadUrl = getSignedUrl(
					`${production.basename}.zip`,
					`${production.title}.zip`
				);

				return {
					productionId: orderItem.production_id,
					licenseId: orderItem.license_id,
					price: orderItem.price,
					downloadUrl,
				};
			});
		},
	},
	Mutation: {
		makeOrder: async (_, { request }) => {
			const {
				nonce,
				cartItems,
				name,
				email,
				wantsMarketing,
				promoCode: rawPromoCode,
			} = request;

			const promoCode = rawPromoCode.toUpperCase();

			const emailInvalid = checkEmail(email);
			if (emailInvalid) throw new UserInputError(emailInvalid);
			const nameInvalid = checkName(name);
			if (nameInvalid) throw new UserInputError(nameInvalid);

			if (!cartItems)
				throw new UserInputError(
					"Couldn't check out because your bag is empty."
				);

			for (const cartItem of cartItems) {
				const production = productionsById.get(cartItem.productionId);
				if (!production) {
					throw new UserInputError(
						`Invalid production "${cartItem.productionId}"!`
					);
				}
				const license = licensesById.get(cartItem.licenseId);
				if (!license || license.price === 0) {
					throw new UserInputError(`Invalid license "${cartItem.licenseId}"!`);
				}
			}

			const subtotal = cartItems.reduce((subtotal, cartItem) => {
				return subtotal + licensesById.get(cartItem.licenseId).price;
			}, 0);

			const promo = promosByCode.get(promoCode);
			const discount = promo ? Math.floor(subtotal * promo.discountRate) : 0;
			const total = subtotal - discount;

			if (total <= 0) {
				throw new UserInputError("Your total is less than or equal to 0.");
			}

			if (!validateEmail(email)) {
				throw new UserInputError("That email address is invalid.");
			}

			// time to charge!

			const btResponse = await charge(nonce, total);

			const status = btResponse.chargePaymentMethod.transaction.status;
			if (
				!(
					status === "SETTLED" ||
					status === "SETTLING" ||
					status === "SUBMITTED_FOR_SETTLEMENT" ||
					status === "SETTLEMENT_PENDING"
				)
			) {
				console.error({ btResponse });
				throw new ApolloError(
					`Transaction failed. Please check your payment details and try again.`
				);
			}

			const braintreeTransactionId =
				btResponse.chargePaymentMethod.transaction.id;
			const order = {
				email,
				braintreeTransactionId,
				discount,
				subtotal,
				total,
				id: uuidv4(),
				orderItems: cartItems.map(({ licenseId, productionId }) => {
					const production = productionsById.get(productionId);
					const license = licensesById.get(licenseId);
					return {
						license,
						production,
						price: license.price,
						id: uuidv4(),
					};
				}),
			};

			await db.run(
				`
				INSERT INTO torcher_user AS u (email, name, wants_marketing)
				VALUES (:email, :name, :wantsMarketing)
				ON CONFLICT (email)
				DO UPDATE SET name=:name, wants_marketing=(u.wants_marketing OR :wantsMarketing)
			`,
				{
					":email": order.email,
					":name": name,
					":wantsMarketing": wantsMarketing,
				}
			);

			await db.run(
				`
				INSERT INTO torcher_order(id, email, braintree_transaction_id, discount, subtotal, total)
				VALUES (:id, :email, :braintreeTransactionId, :discount, :subtotal, :total)
			`,
				{
					":id": order.id,
					":email": order.email,
					":braintreeTransactionId": order.braintreeTransactionId,
					":discount": order.discount,
					":subtotal": order.subtotal,
					":total": order.total,
				}
			);

			// TODO bulk insert
			await Promise.all(
				order.orderItems.map((orderItem) => {
					return db.run(
						`
					INSERT INTO torcher_order_item(id, order_id, production_id, license_id, price)
					VALUES (:id, :orderId, :productionId, :licenseId, :price)
				`,
						{
							":id": orderItem.id,
							":orderId": order.id,
							":productionId": orderItem.production.id,
							":licenseId": orderItem.license.id,
							":price": orderItem.price,
						}
					);
				})
			);

			try {
				await sendReceipt(order);
			} catch (e) {
				console.error(`failed to send receipt to ${email}!`, e);
			}

			console.log(
				`processed order ${order.id} worth ${order.total} from ${name} <${email}>`
			);

			if (process.env.NOTIFICATION_URL) {
				try {
					const formData = new FormData();
					formData.append("title", "New Torcher Order");
					formData.append(
						"message",
						`You just made $${(order.total / 100).toFixed(2)}`
					);
					formData.append("priority", process.env.NOTIFICATION_PRIORITY);
					fetch(process.env.NOTIFICATION_URL, {
						method: "POST",
						body: formData,
					});
				} catch (e) {
					console.error(`failed to send notification`, e);
				}
			}

			return order.id;
		},
	},
};
