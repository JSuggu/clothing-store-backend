const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");

const Clothes = sequelize.define("clothes", {
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            isAlpha: {
                args: true,
                msg: "El nombre no puede contener caracteres numericos"
            }
        }
    },

    price: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            isNumeric: {
                args: true,
                msg: "El precio debe ser un valor numerico"
            }
        }
    }
});

module.exports = Clothes;