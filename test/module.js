const database = require('../src/database');
const User = require('../src/models/User');
const Module = require('../src/models/Module');

const expect = require('chai').expect;
const chai = require('chai');

describe('Module', () => {
    beforeEach(async () => {
        await database.sync({ force: true });
    });

    it('should create a module', async () => {
        const user = await User.create({
            username: 'test',
            password: 'test',
            email: 'test@test.com',
        });
        
        const module = await Module.create({
            name: 'test',
            content: 'test',
            userId: user.id,
        });

        expect(module.name).to.equal('test');
        expect(module.content).to.equal('test');
        expect(module.userId).to.equal(user.id);
    });

    it('should not create a module without a name', async () => {
        const user = await User.create({
            username: 'test',
            password: 'test',
            email: 'test@test.com',
        });

        try {
            await Module.create({
                content: 'test',
                userId: user.id,
            });
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });
});
