const router = require("express").Router();
const fs = require("fs");
const path = require("path");

const getReqAccount = (req) =>
	req.session.account == undefined
		? { loggedIn: false }
		: { ...req.session.account, loggedIn: true };

router.get("/login", (req, res) => {
	let account = getReqAccount(req);

	if (account.loggedIn) {
		res.redirect("/admin");
		return;
	}

	res.render("admin/login", {
		account: account,
	});
});

router.get("*", (req, res) => {
	console.log("test");
	let account = getReqAccount(req);

	if (!account || !account.loggedIn) {
		res.redirect("/admin/login");
		return;
	}

	res.render("admin/panel", {
		account: account,
	});
});

module.exports = router;
