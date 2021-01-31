require("dotenv").config();

module.exports = {
  apps : [{
    script: "server/index.js",
  }],
  deploy : {
    production : {
      user : process.env.DEPLOY_USER,
      host : process.env.DEPLOY_HOST,
      ref  : process.env.DEPLOY_REF,
      repo : process.env.DEPLOY_REPO,
      path : process.env.DEPLOY_PATH,
      "pre-deploy-local": "",
      "post-deploy" : "yarn && pm2 reload ecosystem.config.js --env production",
      "pre-setup": ""
    }
  }
};
