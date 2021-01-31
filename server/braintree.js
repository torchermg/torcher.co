import graphQlRequest from "graphql-request";

const { GraphQLClient } = graphQlRequest;

const BRAINTREE_API_KEY = Buffer.from(
	`${process.env.BRAINTREE_PUBLIC_KEY}:${process.env.BRAINTREE_PRIVATE_KEY}`
).toString("base64");
const braintreeClient = new GraphQLClient(process.env.BRAINTREE_ENDPOINT, {
	headers: {
		authorization: `Bearer ${BRAINTREE_API_KEY}`,
		"braintree-version": "2020-06-10"
	}
});

export const charge = (nonce, amount) => {
	const dollars = amount / 100;
	return braintreeClient.request(
		`
			mutation ChargePaymentMethod($input: ChargePaymentMethodInput!) {
			  chargePaymentMethod(input: $input) {
				transaction {
				  id
				  status
				  orderId
				}
			  }
			}
		`,
		{
			input: {
				paymentMethodId: nonce,
				transaction: { amount: dollars }
			}
		}
	);
};
