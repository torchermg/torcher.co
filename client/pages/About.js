import React from "react";
import styled from "styled-components";

import { Helmet } from "react-helmet";
import constants from "/shared/constants";
import { H1, Corset, ForegroundA, ForegroundLink } from "/components/common";
import licenses from "/shared/licenses";

const activeLicenses = licenses.filter((license) => license.active);
const headerFontSize = "4rem";
const sectionFontSize = "1em";

const breakpoint = "640px";

const H = styled(H1).attrs({ as: "h2" })`
	font-size: ${headerFontSize};
`;

const Section = styled.div``;

const Container = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Grid = styled.div`
	@media screen and (min-width: ${breakpoint}) {
		display: grid;
		grid-template-columns: repeat(1fr);
		gap: 0 3rem;
		grid-template-areas:
			"l1 r1"
			"l2 r2"
			"l3 r3"
			"l4 r4";
		${H} {
			text-align: right;
		}
		${Section} {
			padding-top: calc(0.2 * ${headerFontSize});
		}
	}
`;

export default ({}) => {
	const contactLink = (
		<ForegroundA href={`mailto:${constants.CONTACT_EMAIL}`}>
			{constants.CONTACT_EMAIL}
		</ForegroundA>
	);
	const clearanceLink = (
		<ForegroundA href={`mailto:${constants.CLEARANCE_EMAIL}`}>
			{constants.CLEARANCE_EMAIL}
		</ForegroundA>
	);
	return (
		<Container>
			<Helmet>
				<title>About · Torcher</title>
			</Helmet>
			<Corset width="1024px">
				<Grid>
					<H style={{ gridArea: "l1" }}>About</H>
					<Section style={{ gridArea: "r1" }}>
						<p>
							Launched in 2021 by three friends, Torcher is a platform that
							allows producers to share quality sounds with other producers and
							inspire new, sonically adventurous productions. Our goal is to
							promote fair, transparent, and efficient collaboration among
							talented producers and artists. We are based in Atlanta and Los
							Angeles.
						</p>
						<p>
							We are currently looking to develop our catalog. If you think your
							productions belong in the Torcher library, feel free to reach out
							to us at {contactLink}.
						</p>
					</Section>
					<H style={{ gridArea: "l2" }}>Licenses</H>
					<Section style={{ gridArea: "r2" }}>
						<p>
							We believe that collaboration inspires music creation, and that
							everyone involved in the music making process should get fair
							recognition and compensation for their contributions. Our licenses
							are guided by these ideas.
						</p>
						<p>
							Upon reaching 2.5 million streams independently, or when releasing
							your track via a Major Label, contact us at {clearanceLink} in
							order to negotiate a fair royalty rate for the producers involved
							in your release. Licenses for our productions are provided here:
						</p>
						{activeLicenses.map((license) => {
							return (
								<p key={license.id}>
									<ForegroundLink to={`/license/${license.id}`}>
										{license.nameWithVersion}
									</ForegroundLink>
								</p>
							);
						})}
					</Section>
					<H style={{ gridArea: "l3" }}>Contact</H>
					<Section style={{ gridArea: "r3" }}>
						<p>
							For clearance:
							<br />
							{clearanceLink}
						</p>
						<p>
							For all other inquiries:
							<br />
							{contactLink}
						</p>
						<p>
							Instagram:
							<br />
							<ForegroundA href={constants.INSTAGRAM_URL}>
								{constants.INSTAGRAM_HANDLE}
							</ForegroundA>
						</p>
					</Section>
					<H style={{ gridArea: "l4" }}>Legal</H>
					<Section style={{ gridArea: "r4" }}>
						<p>
							<ForegroundLink to="/legal/terms-of-service">
								Terms of Service
							</ForegroundLink>
						</p>
						<p>
							<ForegroundLink to="/legal/privacy-policy">
								Privacy Policy
							</ForegroundLink>
						</p>
					</Section>
				</Grid>
			</Corset>
		</Container>
	);
};
