// Group.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Group = sequelize.define('Group', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

const Message = sequelize.define('Message', {
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});


// Define associations between models
Group.hasMany(Message);
Message.belongsTo(User, { as: 'sender' });

// Define a many-to-many relationship for members
Group.belongsToMany(User, { through: 'GroupMembers', as: 'members' });
User.belongsToMany(Group, { through: 'GroupMembers', as: 'groups' });

// Define a many-to-many relationship for the blocklist
Group.belongsToMany(User, { through: 'GroupBlocklist', as: 'blocklist' });
User.belongsToMany(Group, { through: 'GroupBlocklist', as: 'blockedGroups' });

// Define a one-to-many relationship for the owner
Group.belongsTo(User, { as: 'owner' });
User.hasMany(Group, { as: 'ownedGroups' });

// Define a many-to-many relationship for the moderators
Group.belongsToMany(User, { through: 'GroupModerators', as: 'moderators' });
User.belongsToMany(Group, { through: 'GroupModerators', as: 'moderatorGroups' });

async function createGroup(name, owner, password = null) {
    try {
        const group = await Group.create({
            name: name,
            password: password,
        });

        await group.setOwner(owner);
        await group.addMember(owner);

        return group;
    } catch (error) {
        throw error;
    }
}

async function deleteGroup(group, sender) {
    try {
        if (group.ownerId !== sender.id) {
            throw new Error('You are not the owner of this group.');
        }

        // Delete all messages
        const messages = await group.getMessages();

        for (const message of messages) {
            await message.destroy();
        }

        await group.destroy();
    } catch (error) {
        throw error;
    }
}

async function joinGroup(group, user, password = null) {
    try {
        // check if user is blocked
        const blocked = await group.hasBlocklist(user);

        if (blocked) {
            throw new Error('You are blocked from this group.');
        }

        if (group.password !== password) {
            throw new Error('Invalid password.');
        }

        await group.addMember(user);
    } catch (error) {
        throw error;
    }
}

async function leaveGroup(group, user) {
    try {
        if (group.ownerId === user.id) {
            throw new Error('You cannot leave a group you own.');
        }

        await group.removeMember(user);
    } catch (error) {
        throw error;
    }
}

async function isAdmin(group, user) {
    try {
        const admin = await group.hasModerator(user);

        return user.id === group.ownerId || admin;
    } catch (error) {
        throw error;
    }
}

async function blockUser(group, user, sender) {
    try {
        if (!await isAdmin(group, sender)) {
            throw new Error('You are not permitted to do this.');
        }

        if (group.ownerId === user.id) {
            throw new Error('You cannot block the owner of this group.');
        }

        await group.addBlocklist(user);
        await group.removeMember(user);
    } catch (error) {
        throw error;
    }
}

async function unblockUser(group, user, sender) {
    try {
        if (!await isAdmin(group, sender)) {
            throw new Error('You are not permitted to do this.');
        }

        await group.removeBlocklist(user);
    } catch (error) {
        throw error;
    }
}

async function addAdmin(group, user, sender) {
    try {
        if (group.ownerId !== sender.id) {
            throw new Error('You are not permitted to do this.');
        }

        await group.addModerator(user);
    } catch (error) {
        throw error;
    }
}

async function removeAdmin(group, user, sender) {
    try {
        if (group.ownerId !== sender.id) {
            throw new Error('You are not permitted to do this.');
        }

        await group.removeModerator(user);
    } catch (error) {
        throw error;
    }
}

async function sendMessage(group, sender, text) {
    try {
        if (!await group.hasMember(sender)) {
            throw new Error('You are not a member of this group.');
        }

        const message = await Message.create({
            text: text,
        });

        await group.addMessage(message);
        await message.setSender(sender);

        return message;
    } catch (error) {
        throw error;
    }
}

async function deleteMessage(group, sender, messageId) {
    try {
        if (!await group.hasMember(sender)) {
            throw new Error('You are not a member of this group.');
        }
        
        const message = await Message.findOne({
            where: {
                id: messageId
            }
        });
        
        if (!message) {
            throw new Error('Message not found.');
        }
        
        if (!await isAdmin(group, sender) && sender.id !== message.senderId) {
            throw new Error('You are not permitted to do this.');
        }

        await message.destroy();
    } catch (error) {
        throw error;
    }
}

async function runStaticTest() {
    try {
        
        // const group = await Group.create({
        //     name: 'Test Group',
        //     password: 'password123'
        // });
        
        const user = await User.create({
            username: 'testuser',
            password: 'testpassword',
            email: Date.now() + Math.random() + '@gmfail.com'
        });
        
        const user2 = await User.create({
            username: 'testuser2',
            password: 'testpassword',
            email: Date.now() + Math.random() + '@gmail.com'
        });
        
        const user3 = await User.create({
            username: 'testuser3',
            password: 'testpassword',
            email: Date.now() + Math.random() + '@gmail.com'
        });
        
        var timerStart = Date.now();

        createGroup("test", user, "hi").then(async (res) => {
            console.log((await res.getOwner()).username);

            joinGroup(res, user, "hi").then(() => {

                blockUser(res, user2, user).then(() => {

                    joinGroup(res, user2, "hi").then(() => {
                        return;
                    }).catch((err) => {

                        deleteGroup(res, user).then(() => {
                            console.log('Test completed in', Date.now() - timerStart, 'ms.');
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// setTimeout(async () => {
//     for (var i = 0; i < 10; i++) {
//         await runStaticTest();
//     }
// }, 1009);
// Run the static test case
  

module.exports = {
    Group,
    Message,
}
