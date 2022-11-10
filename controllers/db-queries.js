const bcryptjs = require("bcrypt");
const Users = require("../models/Users"); 
const UsersRole = require("../models/UsersRole"); 
const Clothes = require("../models/Clothes"); 
const ClothesColor = require("../models/ClothesColor"); 
const ClothesType = require("../models/ClothesType");

const queries = {
    //COLORES DE LAS ROPAS
    colors: async function(req, res){
        const id = req.params.id;

        //Condicional para verificar si se paso un id como parametro, si no se paso un id; devuelvo todos los colores de la ropa.
        if(id == null || id == "" || id == undefined){
            const allColors = await ClothesColor.findAll();
            return res.send({allColors});
        }

        const color = await ClothesColor.findAll({
            where: {
                id: id
            }
        })
        return res.send({color});
    },

    addColor: async function(req, res){
        const name = req.body.name;

        if(name == null || name == "")
            return res.send({message: "no ha ingresado ningun color"});

        //Creo el color y lo inserto en la tabla "clothes_color" en la base de datos;
        const newColor = await ClothesColor.create({
            name: name
        })

        return res.send({newColor, message:"color añadido correctamente"})
    },

    //TIPOS DE ROPA
    types: async function(req, res){
        const id = req.params.id;

        //Condicional para verificar si se paso un id como parametro, si no se paso un id; devuelvo todos los tipos de ropa.
        if(id == null || id == "" || id == undefined){
            const allTypes = await ClothesType.findAll();
            return res.send({allTypes});
        }

        const type = await ClothesType.findAll({
            where: {
                id: id
            }
        })
        return res.send({type});
    },

    addType: async function(req, res){
        const name = req.body.name;

        if(name == null || name == "")
            return res.send({message: "no ha ingresado ningun tipo de ropa"});

        //Creo el tipo de ropa y lo inserto en la tabla "clothes_type" en la base de datos;
        const newType = await ClothesType.create({
            name: name
        })
        
        return res.send({newType, message:"tipo de ropa añadido correctamente"})
    },


    //PRODUCTOS
    products: function(req, res){
        
    },

    //Completar esta funcion para color y tipo representen un id de sus respectivas tablas
    addProductos: async function(req, res){
        const {name, price, color, type} = req.body;

        if(name == "" || name == null || price == "" || price == "null")
            return res.send({message: "El producto debe tener un nombre y un precio"});

        

        const newProduct = await Clothes.create({
            name: name,
            price: price,
            color: color,
            type: type
        })

        return res.send({newProduct, message: "producto añadido correctamente"});
    }


}

module.exports = queries;