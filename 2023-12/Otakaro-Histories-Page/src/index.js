require("dotenv").config();
const express = require("express");
const fs = require("fs");

const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const { SessionOptions } = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const logger = require("./logger");
const env = require("./env");
const database = require("./database");
const controller = require("./controller");
const User = require("./models/User");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// [IMPORTANT] Normalizes url slashes
app.use((req, res, next) => {
	req.url = req.url.replace(/\/+/g, "/");
	next();
});

const sessionStore = new SequelizeStore({
	db: database,
	tableName: "sessions",
});

const sess = {
	cookie: {
		// 20 seconds
		maxAge: 20 * 1000,
	},
	resave: false,
	store: sessionStore,
	saveUninitialized: true,
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

app.use(session(sess));

app.use("/admin", require("./routes/admin"));
app.use("/account", require("./routes/account"));
app.use("/", require("./routes/pages"));

const port = process.env.PORT || 3000;

database.sync({ force: true }).then(() => {
	User.findOne({ where: { username: "admin" } }).then((user) => {
		if (user == null) {
			User.create({
				username: "admin",
				password: "admin",
				email: "admin@localhost",
			}, {
				validate: false
			});
		}
	});

	app.listen(port, () => {
		logger.info(`Listening on port ${port}`);
	});
});
