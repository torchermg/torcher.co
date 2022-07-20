import formData from "form-data";
import Mailgun from "mailgun.js";
import ejs from "ejs";
import path from "path";

import constants from "./shared/constants.js";
import { productionsById } from "./shared/productions.js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: "api",
	key: process.env.MAILGUN_API_KEY,
});

export const sendReceipt = async (order) => {
	console.log(`sending receipt for order ${order.id} to ${order.email}`);

	const subject = "Your Torcher order receipt";
	const html = await ejs.renderFile(
		path.join(path.resolve(), "templates/receipt.ejs"),
		{ order, constants }
	);

	const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
		from: "Torcher <mail@torcher.co>",
		to: order.email,
		subject,
		html,
	});

	console.log(
		`successfully sent order receipt for ${order.id} to ${order.email}`
	);
};

export const validateEmail = async (email) => {
	return true; // TODO

	console.log(`validating ${email}`);
	const response = mg.validate(email, true, { provider_lookup: false });

	return response.result !== "undeliverable";
};
