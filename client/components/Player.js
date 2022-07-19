import React from "react";
import styled, { css, withTheme } from "styled-components";
// import { notify } from "react-notify-toast";
import _ from "lodash";

import { store, emitter } from "/store";
import { showErrorNotification } from "/utils";
import {
	ForegroundA,
	ForegroundButton,
	ForegroundLink,
	BaseSlider,
	updateSlider,
	producerLinks,
	Loading,
} from "/components/common";
import PlaySvg from "/svg/play.svg";
import PauseSvg from "/svg/pause.svg";
import PreviousSvg from "/svg/previous.svg";
import NextSvg from "/svg/next.svg";
import VolumeNotchSvg from "/svg/volume-notch.svg";
import ShareSvg from "/svg/share.svg";
import DownloadSvg from "/svg/download.svg";

import tracks, { tracksById } from "/shared/tracks";
import productions, { productionsById } from "/shared/productions";

import { shareProduction, formatTime } from "/utils";

const DEFAULT_VOLUME = 0.8;

// const breakPoint = "720px";

const Container = styled.div`
	box-shadow: 0 0 1.2rem 0em rgba(0, 0, 0, 0.1);
`;

const GridContainer = styled.div`
	display: grid;
	grid-template-rows: auto;
	grid-template-columns: 20fr 20fr 20fr 20fr 20fr;
	align-items: center;
`;

const Cover = styled.img`
	display: block;
	height: 5rem;
	margin-right: 1rem;
	@media screen and (max-width: 640px) {
		width: 0;
	}
	background: red;
`;

const Left = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	grid-column: 1 / 3;
`;

const Right = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	grid-column: 4 / 6;
	padding-right: 2rem;
	> * {
		margin-left: 2.5rem;
		flex-shrink: 0;
	}
`;

const Title = styled(ForegroundLink)`
	font-size: 1.2rem;
`;
const ProducedBy = styled.span`
	@media screen and (max-width: 500px) {
		display: none;
	}
`;

const ExtraDetails = styled.div`
	@media screen and (max-width: 500px) {
		display: none;
	}
`;

const TrackingSlider = styled(BaseSlider)`
	width: 100%;
`;

const MediaControls = styled.div`
	grid-column: 3 / 4;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const MediaControl = styled(ForegroundButton)`
	margin: 0 0.6rem;
	width: 2rem;
	height: 2rem;
	display: flex;
	align-items: center;
`;

const ShareButtonContainer = styled.div`
	@media screen and (max-width: 640px) {
		display: none;
		margin: 0;
	}
`;

const ShareButton = styled(ForegroundButton)`
	height: 1.25rem;
	svg {
		height: 100%;
	}
`;

const VolumeSliderContainer = styled.div`
	@media screen and (max-width: 1080px) {
		display: none;
		margin: 0;
	}
`;

const VolumeSlider = styled(BaseSlider)``;

const TimeDisplayContainer = styled.div`
	grid-column: 2 / 2;
`;
const TimeDisplay = styled.div`
	${(props) =>
		props.hidden &&
		css`
			display: none;
		`}
	font-size: 1rem;
`;

class Player extends React.PureComponent {
	static contextType = store;
	// static whyDidYouRender = true;
	constructor(props) {
		super(props);
		this.state = {
			playing: false,
			duration: NaN,
			volume: DEFAULT_VOLUME,
		};
		this.animationFrame = null;
		this.lastTrackedProgress = null;
		this.elapsedRef = React.createRef();
		// this.durationRef = React.createRef();
		this.trackerRef = React.createRef();
		this.audioRef = React.createRef();
		this.volumeRef = React.createRef();
	}
	formatProgress = (progress) => {
		const { duration } = this.state;
		if (isNaN(duration) || !isFinite(duration)) return "xx:xx";
		const elapsed = Math.round(progress * duration);
		return formatTime(elapsed);
	};
	update = () => {
		const { duration, playing } = this.state;
		const progress = this.audioRef.current.currentTime / (duration || 1);
		const ended = progress === 1;
		this.trackerRef.current.value = progress;
		updateSlider(this.trackerRef.current, this.props.theme, progress);

		updateSlider(this.volumeRef.current, this.props.theme, this.state.volume);

		const elapsed = this.formatProgress(progress);
		this.elapsedRef.current.textContent = elapsed;

		if (playing) {
			this.animationFrame = requestAnimationFrame(this.update);
		} else {
			this.animationFrame = null;
		}

		if (playing && ended) {
			this.setState({ playing: false });
		}
	};
	onLoaded = (event) => {
		const duration = event.target.duration;
		this.setState({ duration });
	};
	previous = () => {
		this.context.dispatch({
			type: "play-track",
			trackId: tracksById.get(this.context.state.persisted.playingTrackId)
				.previous,
		});
		emitter.requestPlay();
	};
	next = () => {
		this.context.dispatch({
			type: "play-track",
			trackId: tracksById.get(this.context.state.persisted.playingTrackId).next,
		});
		emitter.requestPlay();
	};
	onEnded = () => {
		if (this.lastTrackedProgress !== "1") {
			// organic ending, user didn't just track here
			this.next();
		}
		// reset lastTrackedProgress so if it loops, we catch the organic
		// ending
		this.lastTrackedProgress = null;
	};
	onError = () => {
		const error = this.audioRef.current.error;
		if (!error) return;
		const track = tracksById.get(this.context.state.persisted.playingTrackId);
		showErrorNotification(`Error playing ${production.title}.`);
	};
	play = () => {
		const { playing } = this.state;
		playing || this.setState({ playing: true });
	};
	pause = () => {
		const { playing } = this.state;
		!playing || this.setState({ playing: false });
	};
	restart = () => {
		this.play();
		const { duration } = this.state;
		if (isNaN(duration)) return;
		this.audioRef.current.currentTime = 0;
	};
	togglePlayback = () => {
		const { playing } = this.state;
		this.setState({ playing: !playing });
	};
	track = (event) => {
		const { duration } = this.state;
		if (isNaN(duration)) return;
		const progress = event.target.value;
		this.lastTrackedProgress = progress;
		this.audioRef.current.currentTime = progress * duration;
		if (this.animationFrame === null) this.update();
	};
	share = () => {
		const { playingTrackId } = this.context.state.persisted;

		const track = tracksById.get(playingTrackId);
		if (!track) return;

		const production = productionsById.get(track.production);
		if (!production) return;

		shareProduction(production.id);
	};
	setVolume = (event) => {
		this.setState({
			volume: event.target.value,
		});
	};
	shouldRespectSpace = (event) => {
		return (
			(document.activeElement.tagName === "INPUT" &&
				_.includes(
					["text", "checkbox"],
					document.activeElement.getAttribute("type")
				)) ||
			document.activeElement.tagName === "SELECT"
		);
	};
	onKeyUp = (event) => {
		if (event.code !== "Space" || this.shouldRespectSpace(event)) return;
		event.stopPropagation();
		event.preventDefault();
	};
	onKeyDown = (event) => {
		if (event.code !== "Space" || this.shouldRespectSpace(event)) return;
		event.stopPropagation();
		event.preventDefault();
		if (!event.repeat && !isNaN(this.state.duration)) {
			this.togglePlayback();
		}
	};
	componentDidMount = () => {
		window.addEventListener("keydown", this.onKeyDown);
		window.addEventListener("keyup", this.onKeyUp);
		emitter.addEventListener("play-request", this.restart);
	};
	componentWillUnmount = () => {
		cancelAnimationFrame(this.animationFrame);
		window.removeEventListener("keydown", this.onKeyDown);
		window.removeEventListener("keyup", this.onKeyUp);
		emitter.removeEventListener("play-request", this.restart);
	};
	componentDidUpdate = () => {
		const { volume, duration, playing } = this.state;

		if (this.audioRef.current === null) return;

		this.audioRef.current.volume = volume;

		if (duration !== this.audioRef.current.duration) {
			this.setState({ duration: this.audioRef.current.duration });
		}
		if (!isNaN(this.audioRef.current.duration) && playing) {
			this.audioRef.current.play();
		} else {
			this.audioRef.current.pause();
		}

		if (this.animationFrame === null) this.update();
	};
	render = () => {
		const { duration, playing } = this.state;
		const { playingTrackId } = this.context.state.persisted;

		const track = tracksById.get(playingTrackId);
		if (!track) return null;

		const production = productionsById.get(track.production);

		const previousExists = true;
		const nextExists = true;
		// const previousExists = !!grooves[playingGrooveIndex - 1];
		// const nextExists = !!grooves[playingGrooveIndex + 1];

		const playOrPauseSvg = playing ? <PauseSvg /> : <PlaySvg />;
		const disabled = isNaN(duration);
		const date = production.date.toLocaleDateString();
		return (
			<Container disabled={disabled}>
				<TrackingSlider
					ref={this.trackerRef}
					onChange={this.track}
					min="0"
					max="1"
					disabled={disabled}
				/>
				<GridContainer>
					<audio
						preload="metadata"
						ref={this.audioRef}
						key={playingTrackId}
						onLoadedMetadata={this.onLoaded}
						onEnded={this.onEnded}
						onError={this.onError}
						onPlay={this.play}
						onPause={this.pause}
					>
						{track.lossy.map(({ url, mime }) => (
							<source key={url} src={url} type={mime} />
						))}
					</audio>
					<Left>
						<Cover src={production.coverUrl128} />
						<div>
							<Title to={`/library/${production.id}`}>{track.title}</Title>
							<ExtraDetails>
								{(track.title !== production.title && (
									<div>
										<ForegroundLink to={`/library/${production.id}`}>
											{production.title}
										</ForegroundLink>
									</div>
								)) ||
									null}
								<div>{production.type}</div>
							</ExtraDetails>
						</div>
					</Left>
					<MediaControls>
						<MediaControl
							onClick={this.previous}
							disabled={!previousExists}
							colorStroke
							nonScalingStroke
							constrainSvg
						>
							<PreviousSvg />
						</MediaControl>
						<MediaControl
							onClick={this.togglePlayback}
							disabled={disabled}
							colorStroke
							nonScalingStroke
							constrainSvg
						>
							{playOrPauseSvg}
						</MediaControl>
						<MediaControl
							onClick={this.next}
							disabled={!nextExists}
							colorStroke
							nonScalingStroke
							constrainSvg
						>
							<NextSvg />
						</MediaControl>
					</MediaControls>
					<Right>
						<TimeDisplayContainer>
							{disabled && <Loading />}
							<TimeDisplay hidden={disabled}>
								<span ref={this.elapsedRef}>xx:xx</span>
								<span> / </span>
								<span>{this.formatProgress(1, false)}</span>
							</TimeDisplay>
						</TimeDisplayContainer>
						<ShareButtonContainer>
							<ShareButton onClick={this.share} colorStroke nonScalingStroke>
								<ShareSvg />
							</ShareButton>
						</ShareButtonContainer>
						<VolumeSliderContainer>
							<VolumeSlider
								ref={this.volumeRef}
								onChange={this.setVolume}
								value={this.state.volume}
								min="0"
								max="1"
							/>
						</VolumeSliderContainer>
					</Right>
				</GridContainer>
			</Container>
		);
	};
}

export default withTheme(Player);
