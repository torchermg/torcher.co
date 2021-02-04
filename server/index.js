import ApolloServerExpress from "apollo-server-express";
import express from "express";
import path from "path";
import request from "request";

import graphQlTools from "graphql-tools";

import { setup } from "./db.js";
import typeDefs from "./shared/typeDefs.js";
import resolvers from "./resolvers.js";

const { ApolloServer, UserInputError, ApolloError } = ApolloServerExpress;
const { makeExecutableSchema } = graphQlTools;

const PORT = process.env.GRAPHQL_PORT || 3030;

const app = express();

const schema = makeExecutableSchema({ typeDefs, resolvers });
const formatError = (e) => {
	console.error(e);
	if (
		!(
			e.originalError instanceof ApolloError ||
			e.originalError instanceof UserInputError
		)
	) {
		return new ApolloError("Internal server error");
	}
	return e;
};

const apollo = new ApolloServer({ cors: true, schema, formatError });
app.use(apollo.getMiddleware());

(async () => {
	try {
		await setup(process.env.SQLITE_PATH);
		app.listen(PORT);
	} catch {}
})();
