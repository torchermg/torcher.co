export default `
	scalar Date

	input CartItem {
		productionId: ID!
		licenseId: ID!
	}

	type User {
		email: String!
		name: String!
		wantsMarketing: Boolean!
	}

	type OrderItem {
		productionId: ID!
		licenseId: ID!
		price: Int!
		downloadUrl: String!
	}

	type Order {
		id: ID!
		orderItems: [OrderItem!]!
		user: User!
		date: Date!
		subtotal: Int!
		discount: Int!
		total: Int!
	}

	input MakeOrderRequest {
		nonce: String!
		cartItems: [CartItem!]!
		name: String!
		email: String!
		wantsMarketing: Boolean!
		promoCode: String
	}

	type Query {
		ping: String!
		order(orderId: ID!): Order!
		promoDiscountRate(promoCode: String!): Float!
	}

	type Mutation {
		makeOrder(request: MakeOrderRequest!): ID!
	}
`
