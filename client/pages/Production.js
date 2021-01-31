import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import styled, { withTheme } from "styled-components";

import {
	ForegroundA,
	ForegroundButton,
	H1,
	H2,
	ForegroundLink,
	HollowA,
	HollowButton,
	Corset,
	producerLinks,
	tagLinks,
	THead,
} from "/components/common";
import ProductionGrid from "/components/ProductionGrid";
import { store, emitter } from "/store";
import {
	showNotification,
	shareProduction,
	formatTime,
	formatCurrency,
	zeroPad,
} from "/utils";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";

import StemsSvg from "/images/stems.svg";
import DownloadSvg from "/images/download.svg";
import PlaySvg from "/images/play.svg";
import ShareSvg from "/images/share.svg";
import PlusSvg from "/images/plus.svg";
import productions, { productionsById } from "/shared/productions";
import { tracksById } from "/shared/tracks";
import { licensesById } from "/shared/licenses";

const breakpoint = "960px";

const Container = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;
const Main = styled.div`
	box-sizing: border-box;
	max-width: 530px;
`;

// const InnerMain = styled.div`
// `;

const Description = styled.div`
	text-align: justify;
`;

const Description0 = styled(Description)`
	display: block;
`;

const Description1 = styled(Description)`
	display: none;
`;

const Render = styled.img`
	width: 100%;
	display: block;
	object-fit: contain;
	margin-bottom: 1rem;
`;

const Layout = styled.div`
	margin: 6rem 0;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	> *:not(:last-child) {
		margin-right: 4rem;
	}
	@media screen and (max-width: ${breakpoint}) {
		margin: 1rem 0;
		flex-direction: column;
		align-items: center;
		> * {
			width: 100%;
		}
		> *:not(:last-child) {
			margin-bottom: 2rem;
			margin-right: 0;
		}
		${Main} {
			max-width: none;
		}
		${Render} {
			margin: 0 auto;
			max-height: 200px;
		}
		${Description0} {
			display: none;
		}
		${Description1} {
			display: block;
		}
	}
`;

const Aside = styled.div`
	max-width: 400px;
`;

const Title = styled(H1)`
	font-size: 5rem;
	line-height: 0.8;
	margin-bottom: 2rem;
	@media screen and (max-width: ${breakpoint}) {
		font-size: 4rem;
	}
`;

const Details = styled.div`
	margin: 1rem 0;
	font-size: 1.1rem;
`;

const TrackTable = styled.table`
	width: 100%;
	border-collapse: collapse;
	text-align: left;
	font-size: 1.2rem;
`;

const RelativeContainer = styled.div`
	position: relative;
`;

const TrackNumeral = styled.span``;
const TrackPlay = styled(ForegroundButton).attrs({ as: "div" })`
	> svg {
		display: inline-block;
		height: 0.75em;
	}
	top: 0;
	left: 0;
	position: absolute;
`;

const TrackTableTr = styled.tr`
	${TrackNumeral} {
		${(props) => props.playing && "visibility: hidden;"}
	}
	:hover ${TrackNumeral} {
		visibility: hidden;
	}
	:not(:hover) ${TrackPlay} {
		${(props) => !props.playing && "display: none;"}
	}
`;

const TrackTableTd = styled.td`
	padding-bottom: 1rem;
`;

const Buttons = styled.div`
	margin: 1rem 0;
	${HollowButton}, ${HollowA} {
		display: inline-block;
		margin-right: 1rem;
		margin-bottom: 1rem;
	}
`;

const TallCorset = styled(Corset)`
	height: 100%;
`;

const Price = styled.div`
	color: ${(props) => props.theme.foreground};
	font-size: 2rem;
	margin-bottom: 1rem;
`;

const Stems = styled.div`
	max-width: 200px;
`;

const DownloadA = styled(HollowA)``;

const Production = ({ theme }) => {
	const { id } = useParams();

	const { state, dispatch } = useContext(store);

	const production = productionsById.get(id);
	const addToCart = () => {
		if (
			state.persisted.cartItems.find(
				(cartItem) => cartItem.productionId === id
			)
		) {
			showNotification(`${production.title} is already in your bag.`);
		} else {
			dispatch({
				type: "cart-add",
				productionId: production.id,
				licenseId: production.defaultLicense,
			});
			showNotification(
				`Added ${production.title} (${production.type}) to your bag.`
			);
		}
	};

	const play = () => {
		dispatch({ type: "play-track", trackId: production.tracks[0] });
		emitter.requestPlay();
	};

	const playTrack = (event) => {
		dispatch({
			type: "play-track",
			trackId: event.currentTarget.dataset.track,
		});
		emitter.requestPlay();
	};

	const share = () => {
		shareProduction(production.id);
	};

	const license = licensesById.get(production.defaultLicense);

	const trackTableRows = production.tracks.map((trackId, index) => {
		const track = tracksById.get(trackId);
		// const numeral = zeroPad(index + 1, production.tracks.length);
		const numeral = (index + 1).toString();
		return (
			<TrackTableTr
				key={index}
				playing={trackId === state.persisted.playingTrackId}
			>
				<TrackTableTd>
					<ForegroundButton
						display="inline"
						data-track={trackId}
						onClick={playTrack}
					>
						<RelativeContainer>
							<TrackNumeral>{numeral}</TrackNumeral>
							<TrackPlay colorStroke>
								<PlaySvg />
							</TrackPlay>
						</RelativeContainer>
					</ForegroundButton>
				</TrackTableTd>
				<TrackTableTd>
					<ForegroundButton
						display="inline"
						data-track={trackId}
						onClick={playTrack}
					>
						{track.title}
					</ForegroundButton>
				</TrackTableTd>
				<TrackTableTd style={{ textAlign: "right" }}>
					{track.bpm}bpm
				</TrackTableTd>
				<TrackTableTd style={{ textAlign: "right" }}>
					{formatTime(track.duration)}
				</TrackTableTd>
			</TrackTableTr>
		);
	});

	const downloadOrAddToCartButton = (() => {
		if (production.downloadUrl) {
			return (
				<HollowA
					href={production.downloadUrl}
					colorStroke
					nonScalingStroke
				>
					<DownloadSvg /> Download
				</HollowA>
			);
		}
		return (
			<HollowButton onClick={addToCart} colorStroke nonScalingStroke>
				<PlusSvg /> {formatCurrency(license.price, true, true)}
			</HollowButton>
		);
	})();

	const countAndDate = (() => {
		let count = `${production.tracks.length} composition`;
		if (production.tracks.length !== 1) {
			count += "s";
		}
		return (
			<span>
				{count} — released {production.date.toLocaleDateString()}
			</span>
		);
	})();

	return (
		<Container>
			<Corset>
				<Layout>
					<Aside>
						<Render src={production.coverUrl1024} />
						<Description0
							dangerouslySetInnerHTML={{
								__html: production.description,
							}}
						></Description0>
					</Aside>
					<Main>
						<Title>{production.title}</Title>
						<Buttons>
							<HollowButton
								onClick={play}
								colorStroke
								nonScalingStroke
							>
								<PlaySvg /> Play
							</HollowButton>
							{downloadOrAddToCartButton}
							<HollowButton
								onClick={share}
								colorStroke
								nonScalingStroke
							>
								<ShareSvg /> Share
							</HollowButton>
						</Buttons>
						<TrackTable>
							<tbody>{trackTableRows}</tbody>
						</TrackTable>
						<Description1
							dangerouslySetInnerHTML={{
								__html: production.description,
							}}
						></Description1>
						<Details>
							<p>
								{countAndDate}<br />
								Produced by {producerLinks(production.producers)}<br />
								{tagLinks(production.tags)}
							</p>
							<p>
								Available under <ForegroundLink to={`/license/${license.id}`}>{license.name}</ForegroundLink>
							</p>
							<p>
								{production.stemsIncluded && "Stems included — "}{production.formatInfo}
							</p>
						</Details>
						{production.stemsIncluded && <Stems><StemsSvg /></Stems>}
					</Main>
				</Layout>
				<H2>More</H2>
				<ProductionGrid productionIds={productions.map(production => production.id).reverse().slice(0, 5)} />
			</Corset>
		</Container>
	);
};

export default withTheme(Production);
