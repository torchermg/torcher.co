import React from "react";
import styled from "styled-components";

import {
	Corset,
	H2,
	H6,
	ForegroundA,
	ForegroundLink,
} from "/components/common";
import LogoSvg from "/svg/logo.svg";
import InstagramSvg from "/svg/instagram.svg";
import constants from "/shared/constants";

const LogoContainer = styled(ForegroundA)``;
const Logo = styled(LogoSvg)`
	width: 16rem;
`;

const ContactContainer = styled.div`
	align-self: end;
`;

const InstagramContainer = styled.div`
	align-self: end;
`;

const Links = styled.div`
	> *:not(:last-child) {
		margin-right: 2rem;
	}
`;

const FooterH6 = styled(H6)``;

const breakpoint = "900px";

const Copyright = styled.div`
	white-space: nowrap;
	// font-size: 0.8rem;
	// align-self: end;
	// margin-top: 1rem;
	// justify-self: end;
	// text-align: center;
`;

const Container = styled.div.attrs({ id: "footer" })`
	line-height: 1.5rem;
	flex-direction: row;
	@media screen and (max-width: ${breakpoint}) {
		flex-direction: column;
	}
	display: flex;
	justify-content: space-between;
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
		<Corset>
			<Container>
				<Links>
					<ForegroundLink to="/legal/terms-of-service">
						Terms of Service
					</ForegroundLink>
					<ForegroundLink to="/legal/privacy-policy">
						Privacy Policy
					</ForegroundLink>
					<ForegroundA href={`mailto:${constants.CONTACT_EMAIL}`}>
						{constants.CONTACT_EMAIL}
					</ForegroundA>
				</Links>
				<Copyright>
					© {1900 + new Date().getYear()} Torcher Music Group LLC
				</Copyright>
			</Container>
		</Corset>
	);
};
