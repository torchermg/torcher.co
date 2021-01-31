import React from "react";
import styled from "styled-components";

import { H1 } from "/components/common";

const Center = styled.div`
	text-align: center;
`;
const BottomText = styled.div`
	font-size: 0.8rem;
	letter-spacing: 0.45em;
	text-transform: uppercase;
`;

export default ({}) => {
	return (
		<Center>
			<H1>404</H1>
			<BottomText>Not found</BottomText>
		</Center>
	);
};
