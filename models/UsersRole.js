const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");
const Users  = require("./Users");

const UsersRole = sequelize.define("users_role", {
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validator: {
            notNull: {
                msg: "El campo no puede estar vacio"
            },
            isAlpha: {
                args: true,
                msg: "El color no puede contener valores numericos"
            }
        }
    }
});

UsersRole.hasMany(Users, {
    foreignKey: "rol_id",
    sourceKey: "id"
});
Users.belongsTo(UsersRole, {
    foreignKey: "rol_id",
    targetId: "id"
});

module.exports = UsersRole;
