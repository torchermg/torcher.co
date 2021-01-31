import constants from "./constants.js";
const cdn = constants.CDN;

const rawProductions = [
	{
		id: "B1",
		type: "Beat",
		title: "Damn it All to Hell",
		description: "",
		formatInfo: "44.1 kHz WAV",
		stemsIncluded: true,
		basename: "B1-damn-it-all-to-hell",
		date: new Date(),
		tracks: ["B1-1"],
		tags: ["Rap", "Toronto", "2020"],
		producers: ["Tom Sinclair"],
		licenses: ["instrumental-1.0"],
		defaultLicense: "instrumental-1.0",
		isPublic: false,
	},
	{
		id: "B2",
		type: "Beat",
		title: "Tiger Claws",
		description: "",
		formatInfo: "44.1 kHz WAV",
		stemsIncluded: true,
		basename: "B2-tiger-claws",
		date: new Date(),
		tracks: ["B2-1"],
		tags: ["Rap", "Houston", "2020"],
		producers: ["Tom Sinclair"],
		licenses: ["instrumental-1.0"],
		defaultLicense: "instrumental-1.0",
		isPublic: false,
	},
	{
		id: "B3",
		type: "Beat",
		title: "Rushing",
		description: "",
		formatInfo: "44.1 kHz WAV",
		stemsIncluded: true,
		basename: "B3-rushing",
		date: new Date(),
		tracks: ["B3-1"],
		tags: ["Pop", "Toronto", "2020"],
		producers: ["Tom Sinclair"],
		licenses: ["instrumental-1.0"],
		defaultLicense: "instrumental-1.0",
		isPublic: false,
	},
	{
		id: "B4",
		type: "Beat",
		title: "Pagan Dance",
		description: "",
		formatInfo: "44.1 kHz WAV",
		stemsIncluded: true,
		basename: "B4-pagan-dance",
		date: new Date(),
		tracks: ["B4-1"],
		tags: ["Rap", "Houston", "2020"],
		producers: ["Tom Sinclair"],
		licenses: ["instrumental-1.0"],
		defaultLicense: "instrumental-1.0",
		isPublic: false,
	},
	{
		id: "B5",
		type: "Beat",
		title: "6nose",
		description: "",
		formatInfo: "44.1 kHz WAV",
		stemsIncluded: true,
		basename: "B5-6nose",
		date: new Date(),
		tracks: ["B5-1"],
		tags: ["Pop", "London", "2020"],
		producers: ["Tom Sinclair"],
		licenses: ["instrumental-1.0"],
		defaultLicense: "instrumental-1.0",
		isPublic: false,
	},
	{
		id: "S1",
		type: "Sample Pack",
		title: "Free Pack 01",
		description:
			"<em>Comp One</em> is the first sample pack from Torcher. It is a complimentary compilation of 3 compositions for electric guitar, acoustic guitar, bass guitar, electric piano, voice, strings, and multiple synthesizers. It was crafted by 3 friends in a home studio located in Atlanta, GA. Ranging in styles from 70s soul and disco to modern rap and electronic music, we hope you can find inspiration for your own productions through these musical and sonic ideas. Stems are included in the free download.",
		formatInfo: "44.1 kHz WAV",
		stemsIncluded: true,
		basename: "S1-free-pack-01",
		date: new Date(),
		tracks: ["S1-1", "S1-2", "S1-3"],
		tags: [],
		producers: ["Mitchell Paxton", "Tom Sinclair", "Jack Bricker"],
		licenses: ["free-sample-1.0"],
		defaultLicense: "free-sample-1.0",
		isPublic: true,
	},
	{
		id: "S2",
		type: "Sample Pack",
		title: "Platinum, Guitar and Synthesizer",
		description: "<em>Platinum, Guitar and Synthesizer</em> is the first major release from Torcher. The project was conceived to meet the demand of current rap, rnb, and pop producers as they deliver increasingly guitar driven productions. Created in Atlanta, this pack takes influence from several rap artists and producers in the area. More experimental influences for the work come from artists such as Frank Ocean and Bon Iver. The goal with these 15 compositions was to explore a vast sonic variety through the utilization of just guitar and synth tones, while keeping musical ideas concise and minimal. At times, these two instruments will meld, and become indistinguishable from one another. This is intentional.",
		formatInfo: "44.1 kHz WAV",
		stemsIncluded: true,
		basename: "S2-platinum-guitar-and-synthesizer",
		date: new Date(),
		tracks: [
			"S2-01",
			"S2-02",
			"S2-03",
			"S2-04",
			"S2-05",
			"S2-06",
			"S2-07",
			"S2-08",
			"S2-09",
			"S2-10",
			"S2-11",
			"S2-12",
			"S2-13",
			"S2-14",
			"S2-15",
		],
		tags: [],
		producers: ["Tom Sinclair", "Jack Bricker"],
		licenses: ["sample-1.0"],
		defaultLicense: "sample-1.0",
		isPublic: false,
	},
];

const productions = rawProductions.map((rawProduction, index) => {
	const production = {
		...rawProduction,
		coverUrl128: `${cdn}/${rawProduction.basename}-cover-128.jpeg`,
		coverUrl256: `${cdn}/${rawProduction.basename}-cover-256.jpeg`,
		coverUrl512: `${cdn}/${rawProduction.basename}-cover-512.jpeg`,
		coverUrl1024: `${cdn}/${rawProduction.basename}-cover-1024.jpeg`,
	};
	if (production.isPublic) {
		production.downloadUrl = `${cdn}/${rawProduction.basename}.zip`;
	} else {
		production.downloadUrl = null;
	}
	return production;
});

export const productionsById = new Map(
	productions.map((production) => [production.id, production])
);
export default productions;
