import React, { useRef, useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { darken } from "polished";
import { Link } from "react-router-dom";
import _ from "lodash";

export const ANIMATION_DURATION = "0.1s";

const noFocus = css`
	-webkit-tap-highlight-color: transparent;
	:focus {
		outline: none;
	}
	:-moz-focusring {
		outline: 1px dashed ${props => props.theme.foreground} !important;
	}
`;

export const flameBreakpoint = "720px";
export const Corset = styled.div`
	width: 100%;
	box-sizing: border-box;
	margin: 0 auto;
	${props => props.loose || css`max-width: 1920px;`}
	padding: 0 2rem;
	
	@media screen and (max-width: ${flameBreakpoint}) {
		padding: 0 1rem;
	}
`;

export const Strong = styled.strong`
	color: ${props => props.theme.foreground};
`;

export const H1 = styled.h1`
	color: ${props => props.theme.foreground};
	font-family: ${props => props.theme.accentFont};
	letter-spacing: -0.04em;
	font-size: 4rem;
	margin: 0;
	margin-bottom: 1rem;
`;

export const H2 = styled.h2`
	color: ${props => props.theme.foreground};
	font-family: ${props => props.theme.accentFont};
	margin: 0;
	line-height: 2;
	border-bottom 1px solid ${props => props.theme.foreground};
`;

export const H6 = styled.h6`
	color: ${props => props.theme.foreground};
	font-family: ${props => props.theme.accentFont};
	font-size: 1.2rem;
	margin: 0;
`;

export const THead = styled.thead`
	th {
		border-bottom: 1px solid ${props => props.theme.foreground};
		font-weight: normal;
	}
	color: ${props => props.theme.foreground};
	font-weight: bold;
`;

export const BaseA = styled.a`
	${noFocus}
	text-decoration: none;
	:not(:disabled) {
		cursor: pointer;
		@media (hover: hover) and (pointer: fine) {
			:hover {
				text-decoration: underline;
			}
		}
	}
`;

export const BaseButton = styled.button`
	${noFocus}
	user-select: none;
	display: ${props => props.display || "block"};
	border: unset;
	padding: unset;
	margin: unset;
	background: unset;
	font-size: unset;
	font-family: ${props => props.theme.font};
	appearance: none;
	:not(:disabled):hover {
		cursor: pointer;
	}
`;

const svgCss = ({normal, hover, active, disabled}) => css`
	svg {
		display: block;
		overflow: visible;
		${props => props.nonScalingStroke && css`* {
			vector-effect: non-scaling-stroke;
			stroke-width: 1;
		}`}
		${props => props.constrainSvg && css`
			max-width: 100%;
			height: 100%;
		`}
	}
	:not(:disabled) {
		svg * {
			fill: ${normal.fill};
			${props => props.colorStroke && css`stroke: ${normal.stroke}`};
		}
		@media (hover: hover) and (pointer: fine) {
			:hover svg * {

				${props => props.colorHover && css`fill: ${hover.fill}`};
				${props => props.colorStroke && css`stroke: ${hover.stroke}`};
			}
		}
		:active svg * {
			fill: ${active.fill};
			${props => props.colorStroke && css`stroke: ${active.stroke}`};
		}
	}
	:disabled svg * {
		fill: ${disabled.fill};
		${props => props.colorStroke && css`stroke: ${disabled.stroke}`};
	}
`;

export const foregroundCss = css`
	${props => svgCss({
		normal: {fill: props.theme.foreground, stroke: props.theme.foreground},
		hover: {fill: props.theme.foregroundDark, stroke: props.theme.foregroundDark},
		active: {fill: props.theme.foregroundDarker, stroke: props.theme.foregroundDarker},
		disabled: {fill: props.theme.foregroundLighter, stroke: props.theme.foregroundLighter},
	})}
	:not(:disabled) {
		color: ${props => props.theme.foreground};
		${props => props.colorHover && css`
			@media (hover: hover) and (pointer: fine) {
				:hover {
					color: ${props => props.theme.foregroundDark};
				}
			}
		`}
		:active {
			color: ${props => props.theme.foregroundDarker};
		}
	}
	:disabled {
		color: ${props => props.theme.foregroundLighter};
	}
`;

const blackenedCss = css`
	${props => svgCss({
		normal: {fill: props.theme.foreground, stroke: props.theme.foreground},
		hover: {fill: "black", stroke: "black"},
		active: {fill: "black", stroke: "black"},
		disabled: {fill: props.theme.foregroundLighter, stroke: props.theme.foregroundLighter},
	})}
	:not(:disabled) {
		color: ${props => props.theme.foreground};
		${props => props.colorHover && css`
			@media (hover: hover) and (pointer: fine) {
				:hover {
					color: ${props => props.theme.foregroundDark};
				}
			}
		`}
		:active {
			color: ${props => props.theme.foregroundDarker};
		}
	}
	:disabled {
		color: ${props => props.theme.foregroundLighter};
	}
`;


export const ForegroundA = styled(BaseA)`
	${foregroundCss}
`;

export const BlackenedA = styled(BaseA)`
	${blackenedCss}
`;
export const ForegroundLink = styled(ForegroundA).attrs({as: Link})``;
export const BlackenedLink = styled(BlackenedA).attrs({as:Link})``;

export const ForegroundButton = styled(BaseButton)`
	${foregroundCss}
`;

const thickCss = css`
	font-size: 1.2rem;
	border-radius: 4px;
	padding: 1rem;
	> svg {
		display: inline-block;
		height: 0.75em;
		margin-right: 0.3rem;
	}
`;

const thinCss = css`
	font-size: 1.2rem;
	border-radius: 4px;
	padding: 0.4rem 1.0rem;
	> svg {
		display: inline-block;
		height: 0.75em;
		margin-right: 0.3rem;
	}
`;

const solidCss = css`
	${props => svgCss({
		normal: {fill: props.theme.background, stroke: props.theme.background},
		hover: {fill: props.theme.background, stroke: props.theme.background},
		active: {fill: props.theme.background, stroke: props.theme.background},
		disabled: {fill: "transparent", stroke: props.theme.background},
	})}
	:not(:disabled) {
		color: ${props => props.theme.background};
		background: ${props => props.theme.foreground};
		${props => props.colorHover && css`
			@media (hover: hover) and (pointer: fine) {
				:hover {
					background: ${props => props.theme.foregroundDark};
				}
			}
		`}
		:active {
			background: ${props => props.theme.foregroundDarker};
		}
	}
	:disabled {
		color: ${props => props.theme.foreground};
		background: ${props => props.theme.background};
		border: 1px solid ${props => props.theme.foreground};
	}
`;

export const SolidA = styled(BaseButton)`
	${solidCss}
	${thickCss}
	white-space: nowrap;
	:not(:disabled) {
		@media (hover: hover) and (pointer: fine) {
			:hover {
				text-decoration: none;
			}
		}
	}
`;

export const SolidButton = styled(BaseButton)`
	${solidCss}
	${thickCss}
`;


const backgroundCss = css`
	${props => svgCss({
		normal: {fill: props.theme.background, stroke: props.theme.background},
		hover: {fill: props.theme.backgroundDark, stroke: props.theme.backgroundDark},
		active: {fill: props.theme.backgroundDarker, stroke: props.theme.backgroundDarker},
		disabled: {fill: "transparent", stroke: props.theme.background},
	})}
	:not(:disabled) {
		color: ${props => props.theme.background};
		${props => props.colorHover && css`
			@media (hover: hover) and (pointer: fine) {
				:hover {
					color: ${props => props.theme.backgroundDark};
				}
			}
		`}
		:active {
			color: ${props => props.theme.backgroundDarker};
		}
	}
	:disabled {
		color: ${props => props.theme.foregroundLighter};
	}
`;

export const BackgroundA = styled(BaseA)`
	${backgroundCss}
`;

export const BackgroundLink = styled(BackgroundA).attrs({as: Link})``;

export const BackgroundButton = styled(BaseButton)`
	${backgroundCss}
`;

const tintedCss = css`
	${props => svgCss({
		normal: {fill: props.theme.background, stroke: props.theme.background},
		hover: {fill: props.theme.foregroundTint, stroke: props.theme.foregroundTint},
		active: {fill: props.theme.foregroundTinter, stroke: props.theme.foregroundTinter},
		disabled: {fill: "transparent", stroke: props.theme.background},
	})}
	:not(:disabled) {
		color: ${props => props.theme.background};
		${props => props.colorHover && css`
			@media (hover: hover) and (pointer: fine) {
				:hover {
					color: ${props => props.theme.foregroundTint};
				}
			}
		`}
		:active {
			color: ${props => props.theme.foregroundTinter};
		}
	}
	:disabled {
		color: ${props => props.theme.foregroundLighter};
	}
`;

export const TintedA = styled(BaseA)`
	${tintedCss}
`;
export const TintedButton = styled(BaseButton)`
	${tintedCss}
`;

const hollowCss = css`
	${props => svgCss({
		normal: {fill: props.theme.foreground, stroke: props.theme.foreground},
		hover: {fill: props.theme.foregroundDark, stroke: props.theme.foregroundDark},
		active: {fill: props.theme.background, stroke: props.theme.background},
		disabled: {fill: "transparent", stroke: props.theme.foreground},
	})}
	:not(:disabled) {
		border: 1px solid ${props => props.theme.foreground};
		color: ${props => props.theme.foreground};
		@media (hover: hover) and (pointer: fine) {
			:hover {
				background: ${props => props.theme.foregroundTint};
			}
		}
		:active {
			border: 1px solid ${props => props.theme.foregroundDarker};
			background: ${props => props.theme.foregroundDarker};
			color: ${props => props.theme.background};
		}
	}
	:disabled {
		color: ${props => props.theme.foregroundLight}
		border: 1px solid ${props => props.theme.foregroundLight};
	}
`;

export const HollowA = styled(BaseA)`
	${hollowCss}
	${thinCss}
	white-space: nowrap;
	:not(:disabled) {
		@media (hover: hover) and (pointer: fine) {
			:hover {
				text-decoration: none;
			}
		}
	}
`;

export const HollowButton = styled(BaseButton)`
	${hollowCss}
	${thinCss}
`;

const Input = props => {
	const inputRef = useRef(null);
	const { customValidity, ...inputProps } = props;
	useEffect(() => {
		if (inputRef) {
			inputRef.current.setCustomValidity(customValidity || "");
		}
	}, [customValidity]);
	return <input ref={inputRef} {...inputProps} />;
};

const FancyRadioLabel = styled(HollowButton).attrs({ as: "label" })`
	display: block;
`;

const HiddenInputRadio = styled(Input).attrs({ type: "radio" })`
	position: absolute;
	opacity: 0;
	z-index: -1;
	&:checked {
		+ label,
		+ label:hover {
			color: ${props => props.theme.background};
			background: ${props => props.theme.foreground};
		}
		+ label:active {
			background: ${props => props.theme.foregroundDarker};
		}
	}
`;

export const FancyRadioButton = props => {
	const [formId, setFormId] = useState(_.uniqueId());
	const { children, ...inputProps } = props;
	return (
		<div>
			<HiddenInputRadio id={formId} {...inputProps} />
			<FancyRadioLabel htmlFor={formId}>{props.children}</FancyRadioLabel>
		</div>
	);
};

export const SectionHeader = styled(H1)`
	font-size: 3em;
	font-weight: normal;
`;

export const TextInput = styled(Input)`
	width: 100%;
	border: none;
	outline: none;
	height: 1.25em;
	color: ${props => props.theme.foreground};
	border-bottom: 1px solid ${props => props.theme.foreground};
	padding: 0.2em 0;
	border-radius: 0;
	:invalid {
		box-shadow: none;
	}
`;
export const CheckboxInput = styled(Input).attrs({ type: "checkbox" })`
	border-radius: 0;
	margin: 0;
	width: 1em;
	height: 1em;
	filter: url(#colorize);
`;

export const Select = styled.select`
	${solidCss}
	border: 0;
	display: block;
	:not(:disabled) {
		cursor: pointer;
	}
	appearance: none;
	border-radius: 4px;
	font-weight: bold;
	text-transform: uppercase;
	padding: 0.2em;
`;

const trackHeight = "4px";
const interactablePadding = "1rem";
const styleThumb = style => css`
	::-moz-range-thumb {
		${style}
	}
	::-webkit-slider-thumb {
		margin-top: calc(${trackHeight} / 2);
		transform: translateY(-50%);
		${style}
	}
`;
const styleTrack = style => css`
	::-moz-range-track {
		${style}
	}
	::-webkit-slider-runnable-track {
		${style}
	}
	::-ms-track {
		${style}
	}
`;
export const BaseSlider = styled.input.attrs({ type: "range", step: "any" })`
	${noFocus}
	--track-background: ${props => props.theme.foregroundTinter};
	background: unset;
	position: relative;
	z-index: 1;
	height: calc(${interactablePadding} * 2);
	margin: calc(-1 * ${interactablePadding}) 0;
	display: block;
	appearance: none;
	cursor: pointer;
	transition: height ${ANIMATION_DURATION}s;
	${styleThumb(css`
		appearance: none;
		border-radius: 0;
		border: none;
		width: ${trackHeight};
		height: ${trackHeight};
		background: ${props => props.theme.foreground};
		will-change: height;
		transition: height ${ANIMATION_DURATION};
	`)}
	${styleTrack(css`
		height: ${trackHeight};
		background: var(--track-background);
		will-change: background;
	`)}
	::-moz-focus-outer {
		border: 0;
	}
	:hover {
		${styleThumb(css`
			height: calc(${trackHeight} * 6);
		`)}
	}
`;

export const updateSlider = (element, theme, value) => {
	const elapsedColor = theme.foreground;
	const remainingColor = theme.foregroundTinter;
	const stop = `${value * 100}%`;
	const trackBackground = `linear-gradient(
		to right,
		${elapsedColor},
		${elapsedColor} ${stop},
		${remainingColor} ${stop},
		${remainingColor}
	)`;
	element.style.setProperty("--track-background", trackBackground);
};

// export const producerLinks = producers => {
// 	return producers
// 		.map((producer, index) => <BaseLink key={index}>{producer}</BaseLink>)
// 		.reduce((previous, current) => [previous, ", ", current]);
// };
// export const tagLinks = tags => {
// 	return tags
// 		.map((tag, index) => <BaseLink key={index}>{tag}</BaseLink>)
// 		.reduce((previous, current) => [previous, " / ", current]);
// };
export const producerLinks = producers => {
	return producers
		.map((producer, index) => <span key={index}>{producer}</span>)
		.reduce((previous, current) => [previous, ", ", current]);
};
export const tagLinks = tags => {
	if (!tags.length) {
		return null;
	}
	return tags
		.map((tag, index) => <span key={index}>{tag}</span>)
		.reduce((previous, current) => [previous, " / ", current]);
};

const spin = keyframes`
	from {
		transform: rotate(0);
	} to {
		transform: rotate(1turn);
	}
`;
const loadingDefaultSize = "1rem";
const loadingBorderWidth = "3px";
export const Loading = styled.div`
	width: ${props => props.size || loadingDefaultSize};
	height: ${props => props.size || loadingDefaultSize};
	border-radius: 50%;
	border: ${loadingBorderWidth} solid ${props => props.color || props.theme.foreground};
	border-top: ${loadingBorderWidth} solid transparent;
	animation: ${spin} 1s linear infinite;
`;
