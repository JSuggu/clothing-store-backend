const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users"); 
const UsersRole = require("../models/UsersRole"); 
const Clothes = require("../models/Clothes"); 
const ClothesColor = require("../models/ClothesColor"); 
const ClothesType = require("../models/ClothesType");
const getKey = require("./users-keys");

//Conjunto que uso para verificar en los condicionales si se ingreso algun tipo de dato que no es valido
const invalidData = new Set([undefined, null, NaN, ""]);

const queries = {
    //COLORES DE LAS ROPAS
    colors: async function(req, res){
        const allColors = await ClothesColor.findAll();
        return res.status(200).send({allColors});
    },

    addColor: async function(req, res){
        const name = req.body.name;

        if(invalidData.has(name))
            return res.status(400).send({message: "No ha ingresado ningun color"});

        //Creo el color y lo inserto en la tabla "clothes_color" en la base de datos;
        const newColor = await ClothesColor.create({
            name: name,
        })

        return res.status(201).send({newColor, message:"Color añadido correctamente"})
    },

    //TIPOS DE ROPA
    types: async function(req, res){
        const allTypes = await ClothesType.findAll();
        return res.status(200).send({allTypes});
    },

    addType: async function(req, res){
        const name = req.body.name;

        if(invalidData.has(name))
            return res.status(400).send({message: "No ha ingresado ningun tipo de ropa"});

        //Creo el tipo de ropa y lo inserto en la tabla "clothes_type" en la base de datos;
        const newType = await ClothesType.create({
            name: name
        })
        
        return res.status(201).send({newType, message:"Tipo de ropa añadido correctamente"})
    },

    //PARA LOS PRODUCTOS
    products: async function(req, res){
        const allProducts = await Clothes.findAll({
            include: [
                {
                    model: ClothesColor,
                    attributes: ["name"]
                },

                {
                    model: ClothesType,
                    attributes: ["name"]
                }
            ],
            attributes: ["id", "name", "price"]
        });
        return res.status(200).send({allProducts});
    },

    //Completar esta funcion para color y tipo representen un id de sus respectivas tablas
    addProductos: async function(req, res){
        const {name, price} = req.body;
        let {color, type} = req.body;

        if(invalidData.has(name) || invalidData.has(price))
            return res.status(400).send({message: "El producto debe tener un nombre y un precio"});

        //Condiciales que verifican si el admin ingreso un color o un tipo de ropa valido,
        //si es verdadero hace una consulta a la tabla de color y tipo de ropa y obtiene el id al que hacen referencia
        if(!invalidData.has(color)){
            color = (await ClothesColor.findOne({
                where:{
                    name: color
                }
            })).id
        }

        if(!invalidData.has(type)){
            type = (await ClothesType.findOne({
                where:{
                    name: type
                }
            })).id
        }

        const newProduct = await Clothes.create({
            name: name,
            price: price,
            color_id: color,
            type_id: type
        })

        return res.status(201).send({newProduct, message: "Producto añadido correctamente"});
    },

    //PARA LOS USUARIOS
    roles: async function(req, res){
        const allRoles = await UsersRole.findAll();
        return res.status(200).send({allRoles});
    },

    addRol: async function(req, res){
        const name = req.body.name;

        if(invalidData.has(name))
            return res.status(400).send({message: "El rol debe tener un nombre"});

        const newRol = await UsersRole.create({
            name: name
        });
        return res.status(201).send({newRol, message: "Nuevo rol creado"})
    },

    users: async function(req, res){
        const allUsers = await Users.findAll({
            include: {
                model: UsersRole,
                attributes: ["name"]
            },
            attributes: ["id", "name", "user_name", "email", "password"]
        });
        return res.status(200).send({allUsers, token: req.decoded});
    },

    //consulta para que el admin o desarrollador agregue un nuevo usuario
    addUser: async function (req, res){
        const {name, userName, email, password} = req.body;
        let rol = req.body.rol;

        const encryptedPassword = await bcrypt.hash(password, 8);

        if(invalidData.has(name) || invalidData.has(userName) || invalidData.has(email) || invalidData.has(password) || invalidData.has(rol))
            return res.status(400).send({message: "Los valores no pueden ser nulos"});

        const rolId = (await UsersRole.findOne({
            where: {
                name: rol
            }
        })).id;

        const newUser = await Users.create({
            name: name,
            user_name: userName,
            email: email,
            password: encryptedPassword,
            rol_id: rolId
        });
        
        return res.status(201).send({newUser, message:"Usuario agregado correctamente"});
    },

    //consulta para cuando el usuario se registra
    registerUser: async function(req, res){
        const {name, userName, email, password} = req.body;

        const encryptedPassword = await bcrypt.hash(password, 8);

        if(invalidData.has(name) || invalidData.has(userName) || invalidData.has(email) || invalidData.has(password))
            return res.status(400).send({message: "Los valores no pueden ser nulos"});

        const rol = (await UsersRole.findOne({
            where: {
                name: "customer"
            }
        })).id;

        const newUser = await Users.create({
            name: name,
            user_name: userName,
            email: email,
            password: encryptedPassword,
            rol_id: rol
        });
        
        return res.status(201).send({newUser, message:"Usuario agregado correctamente"});
    },

    login: async function(req, res){
        const {userName, password} = req.body;
        if(invalidData.has(userName) || invalidData.has(password))
            return res.status(401).send({message: "El usuario o la contraseña son incorrectos"});

        const user = await Users.findOne({
            include: {
                model: UsersRole,
                attributes: ["name"]
            },
            where: {
                user_name: userName,
            },
            attributes: ["id", "name", "user_name", "email", "password"]
        });

        if((await bcrypt.compare(password, user.password)) || password == user.password){
            const key = getKey(user.users_role.name);
            const token = jwt.sign(user.toJSON(), key, {expiresIn: "7d"});
            return res.status(200).send({user: user, token: token, message: "Usuario logeado correctamente"});
        }

        return res.status(401).send({message: "El usuario la contraseña son incorrectos"});
    },

    //consultas para hacer modificaciones a los datos del usuario
    /*
    modifyName: async function(req, res){
        const token = req.decoded;
        const id = req.params.id;
        // devuelve undefined si no se envia un id
        console.log(token);
        console.log(id);
        res.send("ok")
    */
}

module.exports = queries;