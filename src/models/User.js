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
		validate: {
			len: [3, 20],
		},
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [4, 100],
		},
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
		},
	},
});

module.exports = User;
