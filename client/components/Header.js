import React, { useEffect, useState, useContext } from "react";
import styled, { withTheme } from "styled-components";
import { withRouter } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { transparentize } from "polished";

import Icon from "@mdi/react";
import { mdiMenu, mdiClose } from "@mdi/js";
import {
	flameBreakpoint,
	ForegroundLink,
	ForegroundA,
	ForegroundButton,
	Corset,
} from "/components/common";
import FlameSvg from "/svg/flame.svg";
import TorcherSvg from "/svg/torcher.svg";
import BeatsSvg from "/svg/beats.svg";
import StemsSvg from "/svg/stems.svg";
import { store } from "/store";

const smallBreakpoint = "400px";

const Container = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const LogoContainer = styled(ForegroundLink)`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	> * {
		flex: 0;
	}
`;

const Flame = styled(FlameSvg)`
	height: 2.75rem;
	width: 2rem;
	z-index: 50;
	box-sizing: border-box;
	padding: 0.5rem;
	padding-left: 0;
`;
const Torcher = styled(TorcherSvg)`
	height: 100%;
	transform: translateY(0.1rem);
	width: 7em;
`;

const MenuButton = styled(ForegroundButton)`
	padding: 1rem;
	z-index: 200;
`;

const Nav = styled.nav`
	display: flex;
	flex-direction: row;
	align-items: center;
	> *:not(:first-child) {
		margin-left: 2rem;
	}

	> ${MenuButton} {
		display: none;
	}
	@media screen and (max-width: ${smallBreakpoint}) {
		padding-right: 0;
		${MenuButton} {
			display: block;
		}
		> *:not(${MenuButton}) {
			display: none;
		}
	}
`;

const Overlay = styled.div`
	position: fixed;
	box-sizing: border-box;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 100;
	background: ${(props) => transparentize(0.2, props.theme.background)};
	font-size: 1.2rem;
	display: flex;
	align-items: center;
	padding: 2rem;
	overflow: scroll;
	justify-content: center;
	flex-direction: column;
	text-align: center;
	> *:not(:last-child) {
		margin-bottom: 0.5rem;
	}
`;

const ForegroundHashLink = styled(ForegroundLink).attrs({ as: HashLink })``;

export default withTheme(
	withRouter(({ location, theme }) => {
		const [isMenuOpen, setIsMenuOpen] = useState(false);
		useEffect(() => {
			const onKeydown = (event) => {
				if (event.key !== "Escape" || !isMenuOpen) return;
				setIsMenuOpen(false);
				event.preventDefault();
				event.stopPropagation();
			};
			window.addEventListener("keydown", onKeydown);
			return () => window.removeEventListener("keydown", onKeydown);
		});

		const { state } = useContext(store);

		const bagText = `Bag (${state.persisted.cartItems.length})`;
		// if (state.persisted.cartItems.length) {
		// 	bagText += ` (${state.persisted.cartItems.length})`;
		// }

		const onHome = location.pathname === "/";

		const toggleMenu = () => {
			setIsMenuOpen(!isMenuOpen);
		};

		const closeMenu = () => {
			setIsMenuOpen(false);
		};

		const iconPath = isMenuOpen ? mdiClose : mdiMenu;

		return (
			<React.Fragment>
				{isMenuOpen && (
					<Overlay onClick={closeMenu}>
						<ForegroundLink to="/bag">{bagText}</ForegroundLink>
						<ForegroundHashLink to="/#library" replace={onHome}>
							Library
						</ForegroundHashLink>
						<ForegroundLink to="/about">About</ForegroundLink>
						<ForegroundLink to="/legal/privacy-policy">
							Privacy Policy
						</ForegroundLink>
						<ForegroundLink to="/legal/terms-of-service">
							Terms of Service
						</ForegroundLink>
					</Overlay>
				)}
				<Corset noPadding>
					<Container>
						<LogoContainer to="/">
							<Flame />
							<Torcher />
						</LogoContainer>
						<Nav>
							{/* <ForegroundA href="/#productions">Productions</ForegroundA> */}
							{/* <ForegroundLink to="/">Home</ForegroundLink> */}
							<ForegroundHashLink to="/#library" replace={onHome}>
								Library
							</ForegroundHashLink>
							<ForegroundLink to="/about">About</ForegroundLink>
							{/* <ForegroundA href="/#footer">Contact</ForegroundA> */}
							<ForegroundLink to="/bag">{bagText}</ForegroundLink>
							<MenuButton onClick={toggleMenu}>
								<Icon path={iconPath} size={1} color={theme.foreground} />
							</MenuButton>
						</Nav>
					</Container>
				</Corset>
			</React.Fragment>
		);
	})
);
