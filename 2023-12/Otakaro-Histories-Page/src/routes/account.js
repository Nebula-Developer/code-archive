const router = require("express").Router();
const fs = require("fs");
const controller = require("../controller");

const getReqAccount = (req) =>
	req.session.account == undefined
		? { loggedIn: false }
		: { ...req.session.account, loggedIn: true };

router.post("/login", (req, res) => {
	const { email, password } = req.body;

	var isLocal = req.hostname == "localhost" || req.hostname == "127.0.0.1";

	if (!isLocal && email == "admin@localhost") {
		res.status(401).send({ error: "Invalid username or password" });
		return;
	}

	controller
		.getUser(email, password)
		.then((account) => {
			if (account == undefined) {
				res.status(401).send({ error: "Invalid username or password" });
			} else {
				req.session.account = account;
				res.send(account);
			}
		})
		.catch((err) => {
			res.status(500).send({ error: err });
		});
});

router.post("/register", (req, res) => {
	const { username, email, password } = req.body;

	if (!getReqAccount(req).loggedIn) {
		res.status(403).send({ error: "Not logged in" });
		return;
	}

	controller
		.createUser(username, email, password)
		.then((account) => {
			if (account == undefined) {
				res.status(401).send({ error: "Invalid username or password" });
			} else {
				req.session.account = account;
				res.send(account);
			}
		})
		.catch((err) => {
			res.status(500).send({ error: err });
		});
});

router.get("/logout", (req, res) => {
	console.log("a");
	req.session.destroy();
	res.redirect("/");
});

module.exports = router;
