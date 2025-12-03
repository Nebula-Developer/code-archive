const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Place = sequelize.define('Place', {
    x: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    y: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING, // Adjust the data type based on your color representation
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Place;
