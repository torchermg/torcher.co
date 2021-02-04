import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ScrollContainer } from "react-router-scroll-4";
import _ from "lodash";
import { Helmet } from "react-helmet";

import constants from "/shared/constants";
import Header from "/components/Header";
import Home from "/pages/Home";
import About from "/pages/About";
import Production from "/pages/Production";
import Bag from "/pages/Bag";
import Receipt from "/pages/Receipt";
import NotFound from "/pages/NotFound";
import License from "/pages/License";
import Legal from "/pages/Legal";
import Player from "/components/Player";
// import Footer from "/components/Footer";

// import Cart from "/pages/Cart";
// import Bag from "/pages/Bag";

const Container = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	color: ${(props) => props.theme.foregroundLight};
	overflow-x: hidden;
`;

const Scroll = styled.div`
	flex: 1;
	overflow-y: auto;
	height: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	// > * {
	// 	flex: 1 0 auto;
	// }
`;
const Content = styled.div`
	flex: 1 0 auto;
`;
const SvgDefs = styled.svg`
	width: 0;
	height: 0;
	position: absolute;
`;

export default (props) => {
	return (
		<Container>
			<Helmet>
				<title>Torcher</title>
				<link rel="canonical" href={constants.ADDRESS} />
				<meta name="description" content="Sample packs and beats." />
			</Helmet>
			<SvgDefs>
				<defs>
					<filter id="colorize">
						<feColorMatrix
							type="matrix"
							values="1 0 0 0 1
							1 0 0 0 0
							1 0 0 0 0
							0 0 0 1 0"
						/>
					</filter>
				</defs>
			</SvgDefs>
			<ScrollContainer scrollKey={"torcher"}>
				<Scroll>
					<div>
						<Header />
					</div>
					<Content>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route path="/about" component={About} />
							<Route path="/library/:id" component={Production} />
							<Route path="/bag" component={Bag} />
							<Route path="/receipt/:id" component={Receipt} />
							<Route path="/license/:id" component={License} />
							<Route path="/legal/:id" component={Legal} />
							<Route path="*" component={NotFound} />
						</Switch>
					</Content>
					{/* <Footer /> */}
				</Scroll>
			</ScrollContainer>
			<Player />
		</Container>
	);
};
