import React, { useContext } from "react";
import styled from "styled-components";
import { transparentize } from "polished";

import { Link } from "react-router-dom";

import { store, emitter } from "/store";
import {
	ForegroundLink,
	BackgroundButton,
	producerLinks,
	tagLinks
} from "/components/common";
import PlaySvg from "/svg/play.svg";
import { productionsById } from "/shared/productions";

const ANIMATION_DURATION = "0.2s";
const PERSPECTIVE = "1024px";

const mediumBreakpoint = "600px";
const tinyBreakpoint = "400px";

const ProductionContainer = styled.div`
	width: 100%;
	box-sizing: border-box;
`;

const Container = styled.div`
	display: grid;
	width: 100%;
	grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
	grid-template-columns: repeat(auto-fill, minmax(min(16rem, 100%), 1fr));
	${ProductionContainer} {
		padding: 2rem;
	}
	@media screen and (max-width: ${tinyBreakpoint}) {
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		grid-template-columns: repeat(auto-fill, minmax(min(10rem, 100%), 1fr));
		${ProductionContainer} {
			padding: 1rem;
		}
	}
	grid-auto-rows: auto;
	margin-bottom: 2rem;
`;

const trapezoid = 0.02;
const Shadow = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: -1;
	filter: drop-shadow(0 0 0.3em ${transparentize(0.9, "black")});
	:after {
		content: "";
		position: absolute;
		width: 100%;
		height: 100%;
		clip-path: polygon(
			0 0,
			100% 0%,
			${100 * (1 - trapezoid)}% ${100 * (1 - trapezoid)}%,
			${100 * trapezoid}% ${100 * (1 - trapezoid)}%
		);
		background: black;
		transition: clip-path ${ANIMATION_DURATION};
	}
`;

const PlayButton = styled(BackgroundButton)`
	width: 2rem;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	opacity: 0;
	transition: opacity ${ANIMATION_DURATION};
`;

const Cover = styled.div`
	position: relative;
	margin-bottom: 1rem;
	box-shadow: 0 -0.2em 0.5em 0.25em ${transparentize(0.92, "black")};
	transform: perspective(${PERSPECTIVE}) rotateX(-15deg);
	transform-style: preserve-3d;
	transition: transform ${ANIMATION_DURATION},
		box-shadow ${ANIMATION_DURATION};
	:hover {
		transform: perspective(${PERSPECTIVE}) translateZ(4em) translateY(-10px);
		box-shadow: 0em 0.2em 0.5em 0.5em ${transparentize(0.96, "black")};
		> ${Shadow} {
			:after {
				clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
			}
		}
		> ${PlayButton} {
			opacity: 1;
		}
	}
`;

const CoverImage = styled.img`
	background: ${props => props.theme.foreground};
	display: block;
	width: 100%;
`;

const PlayContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Details = styled.div`
	line-height: 1.2;
`;

const TitleContainer = styled.div`
	// margin-bottom: 0.2rem;
`;
const Title = styled(ForegroundLink)`
	font-weight: 500;
	font-size: 1.2rem;
`;

const Production = ({productionId}) => {
	const { state, dispatch } = useContext(store);
	const production = productionsById.get(productionId);
	const play = () => {
		dispatch({ type: "play-track", trackId: production.tracks[0] });
		emitter.requestPlay();
	};
	return (
		<ProductionContainer key={production.id}>
			<Cover>
				<Link to={`/library/${production.id}`}>
					<CoverImage src={production.coverUrl512} />
				</Link>
				<Shadow />
				<PlayButton
					onClick={play}
					colorStroke
				>
					<PlaySvg />
				</PlayButton>
			</Cover>
			<Details>
				<TitleContainer>
					<Title to={`/library/${production.id}`}>
						{production.title}
					</Title>
				</TitleContainer>
				<div>{tagLinks(production.tags)}</div>
			</Details>
		</ProductionContainer>
	);
};

export default ({ productionIds }) => {
	return <Container>{productionIds.map(id => <Production key={id} productionId={id} />)}</Container>;
};
