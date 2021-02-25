import React, { useContext } from "react";
import styled from "styled-components";

import constants from "/shared/constants";
import ProductionGrid from "/components/ProductionGrid";
import { flameSize, H1, H2, Corset, LazyImage } from "/components/common";
import { store, emitter } from "/store";
import Footer from "/components/Footer";

import SetAblazeSvg from "/images/hero-set-ablaze-text.svg";

const Container = styled.div``;

const HERO_BREAKPOINT = "640px";

const Hero = styled.div`
	position: relative;
	overflow: hidden;
`;
const HeroImage = styled.img`
	display: block;
	width: 100%;
`;
const HeroImageWide = styled(HeroImage)`
`;
const HeroImageTall = styled(HeroImage)`
`;

const HeroText = styled.div`
	// position: absolute;
	// display: flex;
	// flex-direction: column;
	// padding-top: ${flameSize};
	// bottom: 0;
	// right: 0;
`;
const HeroH1 = styled(H1)`
	width: 100%;
	box-sizing: border-box;
	font-size: 2rem;
	padding: 1rem;
	padding-right: 2rem;
	background: ${(props) => props.theme.foreground};
	color: ${(props) => props.theme.background};
	margin: 0;
`;

const HorizontalSplit = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	@media screen and (max-width: 800px) {
		font-size: 
		flex-direction: column;
	}
`;

const Description = styled.div`
	font-size: 1.8rem;
	line-height: 1;
	letter-spacing: -0.04em;
	color: ${(props) => props.theme.foreground};
	width: 50%;
	margin: 4rem 0;
	margin-bottom: 16rem;
`;

const SetAblazeSvgContainer = styled.div`
	display: flex;
	justify-content: center;
`;

const SetAblaze = styled.div`
	margin: 8rem 0;
	svg {
		width: 50%;
	}
`;
const Productions = styled.div`
	margin-top: 2rem;
`;

export default (props) => {
	const { state, dispatch } = useContext(store);
	return (
		<Container>
			<Corset>
				<Hero>
					<picture>
						<source srcSet={constants.ASSETS.IMAGES.HERO_MIHAILO_WIDE} media={`(min-width: ${HERO_BREAKPOINT})`} />
						<HeroImage src={constants.ASSETS.IMAGES.HERO_MIHAILO_TALL} />
					</picture>
				</Hero>
				<Productions id="library">
					<H1>Library</H1>
					<H2>Sample Packs</H2>
					<ProductionGrid productionIds={["S2", "S1"]} />
					<H2>Beats</H2>
					<ProductionGrid
						productionIds={["B1", "B2", "B3", "B4", "B5"]}
					/>
				</Productions>
			</Corset>
		</Container>
	);
};
