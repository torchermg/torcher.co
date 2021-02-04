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

const Grid = styled.div`
	@media screen and (min-width: ${breakpoint}) {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0 3rem;
		grid-template-areas:
			"l1 r1"
			"l2 r2"
			"l3 r3";
		${H} {
			text-align: right;
		}
		${Section} {
			padding-top: calc(0.2 * ${headerFontSize});
		}
	}
`;

export default ({}) => {
	const clearanceLink = (
		<ForegroundA href={`mailto:${constants.CLEARANCE_EMAIL}`}>
			{constants.CLEARANCE_EMAIL}
		</ForegroundA>
	);
	return (
		<Corset>
			<Helmet>
				<title>About · Torcher</title>
			</Helmet>
			<Grid>
				<H style={{ gridArea: "l1" }}>About</H>
				<Section style={{ gridArea: "r1" }}>
					<p>
						Torcher sells sample packs and beats. We are three friends based in
						Atlanta and Los Angeles.
					</p>
				</Section>
				<H style={{ gridArea: "l2" }}>Licenses</H>
				<Section style={{ gridArea: "r2" }}>
					<p>
						We believe that collaboration inspires music creation. We also
						believe that everyone involved in the music making process should
						get fair recognition and compensation for their efforts. Our
						licenses are guided by these ideas.
					</p>
					<p>
						Upon reaching 2.5 million plays across all streaming services,
						contact us at {clearanceLink} in order to negotiate a fair royalty
						rate for the producer(s) whose production you sampled in your
						release. For major label releases, also reach out to us at{" "}
						{clearanceLink} before release. Licenses for our productions are
						provided here:
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
				<H style={{ gridArea: "l3" }}>Legal</H>
				<Section style={{ gridArea: "r3" }}>
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
	);
};
