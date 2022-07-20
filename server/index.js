import ApolloServerExpress from "apollo-server-express";
import express from "express";
import path from "path";

import { setup } from "./db.js";
import typeDefs from "./shared/typeDefs.js";
import resolvers from "./resolvers.js";

const { ApolloServer } = ApolloServerExpress;
const { UserInputError, ApolloError } = ApolloServer;

const PORT = process.env.GRAPHQL_PORT || 3030;

const app = express();

const formatError = (e) => {
  console.error(e);
  if (!e.extensions || e.extensions.code == "INTERNAL_SERVER_ERROR") {
    return new ApolloError("Internal server error");
  }
  return e;
};

const apollo = new ApolloServer({ typeDefs, resolvers, formatError, cors: true, cache: "bounded" });

(async () => {
  try {
	await apollo.start();
	app.use(apollo.getMiddleware());

    await setup(process.env.SQLITE_PATH);
    app.listen(PORT);
    console.info(`Now listening on ${PORT}`);
  } catch {}
})();
