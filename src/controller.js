const database = require("./database");
const User = require("./models/User");
const Module = require("./models/Module");
const { Op } = require("sequelize");

function createModule(name, content, user, ageGroup, tags) {
	return Module.create({
		name,
		content,
		ageGroup,
		tags,
		userId: user.id,
	});
}

function createUser(username, password, email) {
	return User.create({
		username,
		password,
		email,
	});
}

const getModules = () => Module.findAll();
const getUsers = () => User.findAll();

function getUser(email, password) {
	return User.findOne({
		where: {
			email: {
				[Op.iLike]: email,
			},
			password,
		},
	});
}

const deleteModule = (id) => Module.destroy({ where: { id } });
const deleteUser = (id) => User.destroy({ where: { id } });

function updateModule(id, name, content, ageGroup, tags) {
	return Module.update(
		{
			name,
			content,
			ageGroup,
			tags,
		},
		{
			where: {
				id,
			},
		},
	);
}

module.exports = {
	createModule,
	createUser,
	getModules,
	getUsers,
	getUser,
};
