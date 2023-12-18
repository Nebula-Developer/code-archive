const Sequelize = require('sequelize');
const database = require('../database');
const User = require('./User');

const Module = database.define('module', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false,
    }    
});

User.hasMany(Module, { as: 'modules' });
Module.belongsTo(User, { as: 'user' });

module.exports = Module;
