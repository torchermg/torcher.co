import Mailgun from "mailgun-js";
import ejs from "ejs";
import path from "path";

import constants from "./shared/constants.js";
import { productionsById } from "./shared/productions.js";

const mg = Mailgun({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.MAILGUN_DOMAIN,
});

export const sendReceipt = async (order) => {
	const subject = "Your Torcher order receipt";
	const html = await ejs.renderFile(path.join(path.resolve(), "templates/receipt.ejs"), {order, constants});

	console.log(html);
	const result = await mg.messages().send({
		from: "Torcher <mail@torcher.co>",
		to: order.email,
		subject,
		html,
	});
	console.log({result});
	console.log(`sent to ${order.email}`);
};
