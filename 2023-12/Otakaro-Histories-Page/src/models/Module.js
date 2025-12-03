const Sequelize = require("sequelize");
const database = require("../database");
const User = require("./User");
const { Model } = Sequelize;

/**
 * @type {Model}
 */
const Module = database.define(
	"module",
	{
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		content: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		ageGroup: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		tags: {
			type: Sequelize.ARRAY(Sequelize.STRING),
			allowNull: true,
		},
	},
	{
		defaultScope: {
			include: [User],
		},
	},
);

Module.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Module, { foreignKey: "userId" });

module.exports = Module;
