const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");

const Users = sequelize.define("users", {
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validator: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            isAlpha: {
                args: true,
                msg: "El nombre no puede contener valores numericos"
            }
        }
    },

    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validator: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            len: {
                args: [5, 30],
                msg: "El nombre de usuario debe contener entre 5 y 30 caracteres"
            }
        }
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validator: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            isEmail: {
                args: true,
                msg: "El campo tiene que ser un correo valido"
            }
        }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validator: {
            notNull: {
                msg: "El campo no puede ser nulo"
            }
        }
    }

});

module.exports = Users;