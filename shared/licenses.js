import constants from "./constants.js";
const cdn = constants.CDN;

const rawLicenses = [
	{
		id: "free-sample-1.0",
		name: "Free Sample License",
		version: "1.0",
		price: 0,
		active: true,
	},
	{
		id: "beat-1.0",
		name: "Beat License",
		version: "1.0",
		price: 5000,
		active: true,
	},
	{
		id: "sample-1.0",
		name: "Sample License",
		version: "1.0",
		price: 3000,
		active: true,
	},
];

const licenses = rawLicenses.map((rawLicense) => {
	return {
		...rawLicense,
		htmlUrl: `${cdn}/${rawLicense.id}.html`,
		nameWithVersion: `${rawLicense.name} v${rawLicense.version}`,
	};
});

export const licensesById = new Map(
	licenses.map((license) => [license.id, license])
);
export default licenses;
