import React from "react";
import styled from "styled-components";

import { H2, H6, TintedA } from "/components/common";
import LogoSvg from "/images/logo.svg";
import InstagramSvg from "/images/instagram.svg";
import constants from "/shared/constants";

const breakpoint = "840px";

const LogoContainer = styled(TintedA)``;
const Logo = styled(LogoSvg)`
	width: 16rem;
`;

const ContactContainer = styled.div`
	align-self: end;
`;

const InstagramContainer = styled.div`
	align-self: end;
`;

const FooterH6 = styled(H6)`
	color: ${(props) => props.theme.background};
`;

const Copyright = styled.div`
	white-space: nowrap;
	font-size: 0.8rem;
	align-self: end;
	margin-top: 1rem;
	justify-self: end;
	text-align: center;
`;

const Container = styled.div.attrs({ id: "footer" })`
	background: ${(props) => props.theme.foreground};
	color: ${(props) => props.theme.background};
	padding: 2rem;
`;
const GridContainer = styled.div`
	// display: grid;
	// grid-template-columns: auto;
	// justify-content: space-between;
	// align-items: center;
	// ${LogoContainer} {
	// 	grid-row: 1 / 4;
	// 	grid-column: 1 / 2;
	// }
	// ${ContactContainer} {
	// 	grid-row: 2 / 3;
	// 	grid-column: 1 / 2;
	// }
	// ${InstagramContainer} {
	// 	grid-row: 2 / 3;
	// 	grid-column: 2 / 3;
	// }
	// ${Copyright} {
	// 	grid-row: 2 / 3;
	// 	grid-column: 1 / 3;
	// }
`;

export default ({}) => {
	return (
		<Container>
			<GridContainer>
				<ContactContainer>
					<div>
						email:{" "}
						<TintedA href={`mailto:${constants.CONTACT_EMAIL}`}>
							{constants.CONTACT_EMAIL}
						</TintedA>
					</div>
					<div>
						instagram:{" "}
						<TintedA href={constants.INSTAGRAM_URL}>
							{constants.INSTAGRAM_HANDLE}
						</TintedA>
					</div>
				</ContactContainer>
				<Copyright>Copyright {1900 + (new Date()).getYear()} Torcher Music Group LLC</Copyright>
			</GridContainer>
		</Container>
	);
};
