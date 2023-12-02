const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('testing', 'nebuladev', '', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;
