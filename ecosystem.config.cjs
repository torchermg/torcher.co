const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), '.env')));

module.exports = {
	apps : [{
		env,
		name: "torcher",
		script: "server/index.js",
	}],
	deploy : {
		torcher : {
			user : process.env.DEPLOY_USER,
			host : process.env.DEPLOY_HOST,
			ref  : process.env.DEPLOY_REF,
			repo : process.env.DEPLOY_REPO,
			path : process.env.DEPLOY_PATH,
			"pre-deploy-local": `scp .env ${process.env.DEPLOY_USER}@${process.env.DEPLOY_HOST}:${process.env.DEPLOY_PATH}/current`,
			"post-deploy" : "make && pm2 reload ecosystem.config.cjs && pm2 save",
			"pre-setup": "",
		}
	}
};
