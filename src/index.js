const express = require("express");
const session = require("express-session");
require("dotenv").config();

const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");

const logger = require("./logger");
const env = require("./env");

const app = express();
app.set("view engine", "ejs");

const sess = {
	cookie: {},
};

if (env.production) {
	app.set("trust proxy", 1);
	sess.cookie.secure = true;

	app.use(helmet());
	app.use(compression());
	app.use(morgan("common"));

	if (process.env.SESSION_SECRET == undefined)
		logger.warn("SESSION_SECRET is undefined");

	sess.secret = process.env.SESSION_SECRET || "session_static_password";
} else {
	logger.debug("Using development environment");
	app.use(morgan("dev"));
	
	logger.warn("Using development SESSION_SECRET");
	sess.secret = "test";
}

const singleResponseApi = (url, call) => {
	app.get("/api/" + url, (req, res) => {
		res.json(call(req));
	});
};

singleResponseApi("prod", () => process.env.NODE_ENV == "production");

const port = process.env.PORT || 3000;

app.listen(port, () => {
	logger.info(`Listening on port ${port}`);
});
