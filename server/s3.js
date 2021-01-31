import AWS from "aws-sdk";

const s3 = new AWS.S3({
	accessKeyId: process.env.DIGITALOCEAN_ACCESS_KEY_ID,
	secretAccessKey: process.env.DIGITALOCEAN_SECRET_ACCESS_KEY,
	endpoint: process.env.DIGITALOCEAN_ENDPOINT,
	region: process.env.DIGITALOCEAN_REGION,
});

const bucket = process.env.DIGITALOCEAN_PRIVATE_BUCKET;

export const getSignedUrl = (key, filename) => {
	const sanitize = (filename) => {
		return filename.replace(`"`, `'`);
	};
	return s3.getSignedUrl("getObject", {
		Bucket: bucket,
		Key: key,
		Expires: 60 * 60 * 24, // 1 day in seconds
		ResponseContentDisposition: `attachment; filename="${sanitize(filename)}"`,
	});
};
