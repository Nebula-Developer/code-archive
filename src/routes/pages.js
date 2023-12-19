const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const logger = require("../logger");

const getReqAccount = (req) =>
	req.session.account == undefined
		? { loggedIn: false }
		: { ...req.session.account, loggedIn: true };

router.get("/", (req, res) => {
	res.render("index", {
		account: getReqAccount(req),
	});
});

router.get("/:page(*)", (req, res) => {
	let page = req.params.page;

	if (page.startsWith("admin")) {
		logger.error("Request passed through admin routes");
		res.write("Forbidden");
		res.end();
		return;
	}

	const sanitizedPage = page.replace(/[^a-zA-Z0-9_\-]/g, ""); // Allow only alphanumeric, underscore, and hyphen
	let mPath = path.join(
		require.main.path,
		"..",
		"views",
		sanitizedPage + ".ejs",
	);

	if (fs.existsSync(mPath)) {
		res.render(sanitizedPage, {
			account: getReqAccount(req),
		});
	} else {
		res.render("404");
	}
});

module.exports = router;
