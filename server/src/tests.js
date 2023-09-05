const { Database } = require('./db');
const db = new Database('test');
const fs = require('fs');
const YAML = require('yaml');
const logger = require('./logger');

var testTimer = Date.now();

db.db.serialize(() => {
    db.db.run(`DROP TABLE IF EXISTS users`);
    db.db.run(`DROP TABLE IF EXISTS chats`);
    db.db.run(`DROP TABLE IF EXISTS messages`);

    db.createTables().then(() => {
        const testFile = "temp/TestResults.yaml";
    
        testMethods().then((res) => {
            const searchResults = {
                users: res.search.user.map((user) => { return user.username }),
                chats: res.search.chat.map((chat) => { return chat.name }),
                messages: res.search.message.map((message) => { return message.content })
            };

            const toWrite = {
                allResults: res,
                searchResults: searchResults
            };
            
            const yaml = YAML.stringify(toWrite);
            fs.writeFileSync(testFile, yaml);

            logger.info("Successfully ran tests in " + (Date.now() - testTimer) + "ms");
        }).catch((err) => {
            logger.info("Error running tests:", err);
        });
    });
});

async function createTestEntries() {
    try {
        var userTimestamp = Date.now();
        var user = await db.createUser('TestUser', 'TestPassword', 'TestEmail-' + userTimestamp + '@test.com');
        var chat = await db.createChat('TestChat-' + userTimestamp, user.id);
        var message = await db.createMessage('TestMessage', user.id, chat.id);

        return {
            user, chat, message
        }
    } catch (err) {
        throw err;
    }
}

async function testGetMethods() {
    try {
        var { user, chat, message } = await createTestEntries();

        var userGet = await db.getUser(user.id);
        var chatGet = await db.getChat(chat.id);
        var messageGet = await db.getMessage(message.id);
        var tokenGet = await db.getUserByToken(user.id);

        return {
            user: userGet, chat: chatGet, message: messageGet, token: tokenGet
        }
    } catch (err) {
        throw err;
    }
}

async function testGetAllFromMethods() {
    try {
        var userGet = await db.getUsersFrom(0, 10);
        var chatGet = await db.getChatsFrom(0, 10);
        var messageGet = await db.getMessagesFrom(0, 0, 10);

        return {
            user: userGet.length, chat: chatGet.length, message: messageGet.length
        }
    } catch (err) {
        throw err;
    }
}

async function testSearchMethods() {
    try {
        var userSearch = await db.searchUsers({ username: "Updated" });
        var chatSearch = await db.searchChats({ name: "Updated" });
        var messageSearch = await db.searchMessages({ content: "Updated" });

        return {
            user: userSearch, chat: chatSearch, message: messageSearch
        }
    } catch (err) {
        throw err;
    }
}

async function testUpdateMethods() {
    try {
        var { user, chat, message } = await createTestEntries();

        var userUpdate = await db.updateUser(user.id, { username: 'TestUserUpdated' });
        var chatUpdate = await db.updateChat(chat.id, { name: 'TestChatUpdated-' + Date.now() });
        var messageUpdate = await db.updateMessage(message.id, { content: 'TestMessageUpdated' });

        return {
            user: userUpdate, chat: chatUpdate, message: messageUpdate
        }
    } catch (err) {
        throw err;
    }
}

async function testDeleteMethods() {
    try {
        var { user, chat, message } = await createTestEntries();

        var userDelete = await db.deleteUser(user.id);
        var chatDelete = await db.deleteChat(chat.id);
        var messageDelete = await db.deleteMessage(message.id);

        return true;
    } catch (err) {
        throw err;
    }
}

async function testSafeUserMethods() {
    try {
        var user = await db.getUserSafe(1);
        var users = await db.getUsersSafe();
        var usersFrom = await db.getUsersFromSafe(0, 10);
        var userSearch = await db.searchUsersSafe({ username: "Updated" });

        return {
            user, users, usersFrom, userSearch
        }
    } catch (err) {
        throw err;
    }
}

async function testMethods() {
    try {
        var get = await testGetMethods();
        var getAllFrom = await testGetAllFromMethods();
        var update = await testUpdateMethods();
        var search = await testSearchMethods();
        var del = await testDeleteMethods();
        var safe = await testSafeUserMethods();

        return {
            get, getAllFrom, search, update, del, safe
        }
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createTestEntries,
    testGetMethods, testGetAllFromMethods,
    testSearchMethods, testUpdateMethods,
    testDeleteMethods, testSafeUserMethods,
    testMethods
};
