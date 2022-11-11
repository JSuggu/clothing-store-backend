const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");
const Clothes = require("./Clothes");

const ClothesType = sequelize.define("clothes_type", {
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validator: {
            notNull: {
                msg: "El campo no puede estar vacio"
            },
            isAlpha: {
                args: true,
                msg: "El tipo de ropa no puede contener valores numericos"
            }
        }
    }
});

ClothesType.hasMany(Clothes, {
    foreignKey: "type_id",
    sourceKey: "id"
});
Clothes.belongsTo(ClothesType, {
    foreignKey: "type_id",
    targetId: "id"
})


module.exports = ClothesType;