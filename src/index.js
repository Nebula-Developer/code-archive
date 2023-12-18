const express = require("express");
const session = require("express-session");
require("dotenv").config();

const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");

const app = express();

const sess = {
	cookie: {},
};

if (app.get("env") === "production") {
	app.set("trust proxy", 1);
	sess.cookie.secure = true;

	app.use(helmet());
	app.use(compression());
	app.use(morgan("common"));

	if (process.env.SESSION_SECRET == undefined)
		console.error("No session secret");

	sess.secret = process.env.SESSION_SECRET || "session_static_password";
} else {
	app.use(morgan("dev"));

	sess.secret = "test";
}

const singleResponseApi = (url, call) => {
	app.get("/api/" + url, (req, res) => {
		res.json(call(req));
	});
};

singleResponseApi("prod", () => process.env.NODE_ENV == "production");

////////////////////////////////////////
// Middleware
////////////////////////////////////////

app.set("view engine", "ejs");

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
