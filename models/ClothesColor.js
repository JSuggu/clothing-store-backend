const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");
const Clothes = require("./Clothes");

const ClothesColor = sequelize.define("clothes_color", {
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
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

ClothesColor.hasMany(Clothes, {
    foreignKey: "color_id",
    sourceKey: "id"
});
Clothes.belongsTo(ClothesColor, {
    foreignKey: "color_id",
    targetId: "id"
});

module.exports = ClothesColor;