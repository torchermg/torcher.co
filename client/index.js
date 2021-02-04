import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import React from "react";
import ReactDOM from "react-dom";
import Notifications from "react-notify-toast";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { tint, darken, lighten } from "polished";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ScrollContext } from "react-router-scroll-4";

import roobert from "/fonts/Roobert-Bold.woff2";
import publicSansRegular from "/fonts/PublicSans-Regular.woff2";
import publicSansMedium from "/fonts/PublicSans-Medium.woff2";
import publicSansBold from "/fonts/PublicSans-Bold.woff2";
import Torcher from "/pages/Torcher";
import { StateProvider } from "/store";
import typeDefs from "/shared/typeDefs";

// const whyDidYouRender = require("@welldone-software/why-did-you-render");
// whyDidYouRender(React, {});

const cache = new InMemoryCache();
const link = new HttpLink({
	uri: `${process.env.GRAPHQL_ADDRESS}`,
});

console.log("gqla is ", process.env.GRAPHQL_ADDRESS);

const client = new ApolloClient({ cache, link, typeDefs });

const foreground = "red";
const background = "white";
const theme = {
	font: "Public Sans",
	accentFont: "Roobert",
	foreground,
	background,
	backgroundDark: darken(0.06, background),
	backgroundDarker: darken(0.12, background),
	foregroundTint: tint(0.94, foreground),
	foregroundTinter: tint(0.7, foreground),
	foregroundLight: lighten(0.2, foreground),
	foregroundLighter: lighten(0.3, foreground),
	foregroundDark: darken(0.06, foreground),
	foregroundDarker: darken(0.12, foreground),
};

const GlobalStyle = createGlobalStyle`
	:root {
		@media screen and (max-width: 640px) {
			font-size: 0.75em;
		}
	}
	html, body, #root {
		height: 100%;
		margin: 0;
		background: ${theme.background};
		font-family: "Public Sans", sans-serif;
	}
	@font-face {
		font-family: "Public Sans";
		font-weight: normal;
		src: url(${publicSansRegular}) format("woff2");
	}
	@font-face {
		font-family: "Public Sans";
		font-weight: 500;
		src: url(${publicSansMedium}) format("woff2");
	}
	@font-face {
		font-family: "Public Sans";
		font-weight: bold;
		src: url(${publicSansBold}) format("woff2");
	}
	@font-face {
		font-family: "Roobert";
		font-weight: bold;
		src: url(${roobert}) format("woff2");
	}
`;

// const notificationColors = {
// 	color: theme.background,
// 	backgroundColor: theme.foreground
// };
const notificationColors = {
	color: theme.background,
	backgroundColor: theme.foreground,
};
const notificationOptions = {
	colors: {
		error: notificationColors,
		success: notificationColors,
		warning: notificationColors,
		info: notificationColors,
	},
};

const App = (props) => {
	return (
		<React.Fragment>
			<ApolloProvider client={client}>
				<GlobalStyle />
				<StateProvider>
					<ThemeProvider theme={theme}>
						<Router>
							<Notifications options={notificationOptions} />
							<ScrollContext>
								<Torcher />
							</ScrollContext>
						</Router>
					</ThemeProvider>
				</StateProvider>
			</ApolloProvider>
		</React.Fragment>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
