const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [4, 32]
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [4, 32]
        }
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        },
        allowNull: false,
        unique: true
    },
    bio: {
        type: DataTypes.TEXT,
        validate: {
            len: [0, 256]
        }
    },
    avatar: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
    }
});

module.exports = User;
