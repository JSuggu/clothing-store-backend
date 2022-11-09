const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("clothing_store", "root", "41100188", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = sequelize;

