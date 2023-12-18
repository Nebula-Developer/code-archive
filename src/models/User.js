const Sequelize = require("sequelize");
const database = require("../database");
const { Model } = Sequelize;

/**
 * @type {Model}
 */
const User = database.define("user", {
	username: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
});

module.exports = User;
