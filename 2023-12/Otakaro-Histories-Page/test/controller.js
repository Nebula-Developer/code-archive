const controller = require("../src/controller");
const database = require("../src/database");

const expect = require("chai").expect;
const chai = require("chai");
const Module = require("../src/models/Module");
const User = require("../src/models/User");

describe("Module", () => {
	beforeEach(async () => {
		await database.sync({ force: true });
	});

	describe("createModule", () => {
		it("should create a module", async () => {
			const user = await controller.createUser(
				"test",
				"test",
				"test@test.com",
			);

			const module = await controller.createModule(
				"test",
				"test",
				user,
				1,
				["test"],
			);

			expect(module.name).to.equal("test");
			expect(module.content).to.equal("test");
			expect(module.ageGroup).to.equal(1);
			expect(module.tags).to.eql(["test"]);
			expect(module.userId).to.equal(user.id);
		});
	});
});
