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
    addProduct: async function(req, res){
        const {name, price} = req.body;
        let {color, type} = req.body;

        if(invalidData.has(name) || invalidData.has(price))
            return res.status(400).send({message: "El producto debe tener un nombre y un precio"});

        //Condiciales que verifican si el admin ingreso un color o un tipo de ropa valido,
        //si es verdadero hace una consulta a la tabla de color y tipo de ropa y obtiene el id al que hacen referencia
        if(!invalidData.has(color)){
            color = await ClothesColor.findOne({
                where:{
                    name: color
                }
            });

            if(!invalidData.has(color)){
                color = color.id;
            }
        }

        if(!invalidData.has(type)){
            type = await ClothesType.findOne({
                where:{
                    name: type
                }
            })

            if(!invalidData.has(type)){
                type = type.id;
            }
        }

        const newProduct = await Clothes.create({
            name: name,
            price: price,
            color_id: color,
            type_id: type
        })

        return res.status(201).send({newProduct, message: "Producto añadido correctamente"});
    },

    modifyProduct: async function(req, res){
        const {name, price} = req.body;
        let {color, type} = req.body;
        const token = req.decoded;
        const id = req.params.id;

        if(token.users_role.priority > 2)
            return res.status(403).send({message:"El usuario no tiene los permisos necesario"});

        if(invalidData.has(name) || invalidData.has(price))
            return res.status(400).send({message:"El producto debe tener un nombre y un precio"})

        if(!invalidData.has(color)){
            color = await ClothesColor.findOne({
                where:{
                    name: color
                }
            });
    
            if(!invalidData.has(color)){
                color = color.id;
            }
        }
    
        if(!invalidData.has(type)){
            type = await ClothesType.findOne({
                where:{
                    name: type
                    }
            })
    
            if(!invalidData.has(type)){
                type = type.id;
            }
        }
    
        const productUpdated = await Clothes.update({
            name: name,
            price: price,
            color_id: color,
            type_id: type,
            }, {
                where: {
                    id: id
                }
            });

        
        if(productUpdated == 0)
            return res.status(404).send({message: "El producto que intento modifcar no existe"});

        return res.status(201).send({productUpdated, message:"Producto actulizado correctamente"});
    },

    deleteProduct: async function(req, res){
        const token = req.decoded;
        const id = req.params.id;

        if(token.users_role.priority > 2)
            return res.status(403).send({message:"No tiene los permisos para eliminar productos"});

        const productDeleted = await Clothes.destroy({
            where: {
                id: id
            }
        });

        if(productDeleted == 0)
            return res.status(404).send({message:"El producto que esta intentando eliminar no exite"});
        
        return res.status(200).send({productDeleted, message:"El producto ha sido eliminado"});
    },

    //PARA LOS USUARIOS
    //Cuando se compara la prioridad de los usuarios, si "X > Y" quiere decir que X tiene menor prioridad que Y,
    //esto es asi porque el valor 1 representa la prioridad mas alta y mientras mas aumenta este valor menor es la prioridad.
    roles: async function(req, res){
        const allRoles = await UsersRole.findAll();
        return res.status(200).send({allRoles});
    },

    addRole: async function(req, res){
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
                attributes: ["name", "priority"]
            },
            attributes: ["id", "name", "user_name", "email", "password"]
        });

        return res.status(200).send({allUsers});
    },

    //consulta para que el admin o desarrollador agregue un nuevo usuario
    addUser: async function (req, res){
        const {names, userName, email, password} = req.body;
        let role = req.body.role;

        if(invalidData.has(names) || invalidData.has(userName) || invalidData.has(email) || invalidData.has(password) || invalidData.has(role))
            return res.status(400).send({message: "Los valores no pueden ser nulos"});
        
        const encryptedPassword = await bcrypt.hash(password, 8);

        role = await UsersRole.findOne({
            where: {
                name: role
            }
        });

        if(invalidData.has(role))
            return res.status(404).send({message:"El Usuario no pudo agregarse porque el rol que intento asignarsele no existe"});

        const newUser = await Users.create({
            names: names,
            user_name: userName,
            email: email,
            password: encryptedPassword,
            role_id: role.id
        });
        
        return res.status(201).send({newUser, message:"Usuario agregado correctamente"});
    },

    //consulta para cuando el usuario se registra
    registerUser: async function(req, res){
        const {names, userName, email, password} = req.body;

        const encryptedPassword = await bcrypt.hash(password, 8);

        if(invalidData.has(names) || invalidData.has(userName) || invalidData.has(email) || invalidData.has(password))
            return res.status(400).send({message: "Los valores no pueden ser nulos"});

        const role = (await UsersRole.findOne({
            where: {
                name: "customer"
            }
        })).id;

        const newUser = await Users.create({
            names: names,
            user_name: userName,
            email: email,
            password: encryptedPassword,
            role_id: role
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
                attributes: ["name", "priority"]
            },
            where: {
                user_name: userName,
            },
            attributes: ["id", "name", "user_name", "email", "password"]
        });

        if(invalidData.has(user))
            return res.status(404).send({message:"El usuario o la contraseña son incorrectos"});

        if(!await bcrypt.compare(password, user.password))
            return res.status(401).send({message: "El usuario o la contraseña son incorrectos"});
        
        const key = getKey(user.users_role.name);
        const token = jwt.sign(user.toJSON(), key, {expiresIn: "7d"});

        return res.status(200).send({user: user, token: token, message: "Usuario logeado correctamente"});
    },

    //consultas para hacer modificaciones a los datos del usuario
    modifyNames: async function(req, res){
        const token = req.decoded;
        const names = req.body.names;
        const id = req.params.id;

        if(invalidData.has(names))
            return res.status(400).send({message: "Debe ingresar algun nombre"});
        
        if(invalidData.has(id)){
            const userId = token.id;
            const userUpdated = await Users.update({names: names}, {
                where: {
                    id: userId
                }
            });
            return res.status(201).send({userUpdated, message:"Nombres actualizados correctamente"});
        }

        const tokenRole = token.users_role;

        //consulta a la base de datos para obtener el rol del usuario que quiero modificar,
        //esto es para que los admin no puedan modificar los datos de otros admin o de los dev.
        const userToModify = await Users.findOne({
            include: {
                model: UsersRole,
                attributes: ["name", "priority"]
            },
            where: {
                id: id
            }
        });

        if(invalidData.has(userToModify))
            return res.status(404).send({message:"El usuario que esta intentando modificar no existe"});

        if(tokenRole.priority > userToModify.users_role.priority)
            return res.status(403).send({message:"No tiene autorizacion para modificar datos de otros usuarios"});
            
        const userUpdated = await Users.update({names: names}, {
            where: {
                id: id
            }
        });

        return res.status(201).send({userUpdated, message:"Nombres actualizado actualizado correctamente"});
    },

    //Modificar nombre de usuario
    modifyUserName: async function(req, res){
        const token = req.decoded;
        const userName = req.body.userName;
        const id = req.params.id;

        if(invalidData.has(userName))
            return res.status(400).send({message: "Debe ingresar algun nombre"});
        
        if(invalidData.has(id)){
            const userId = token.id;
            const userUpdated = await Users.update({user_name: userName}, {
                where: {
                    id: userId
                }
            });
            return res.status(201).send({userUpdated, message:"Nombre de usuario actualizado actualizado correctamente"});
        }

        const tokenRole = token.users_role;

        //consulta a la base de datos para obtener el rol del usuario que quiero modificar,
        //esto es para que los admin no puedan modificar los datos de otros admin o de los dev.
        const userToModify = await Users.findOne({
            include: {
                model: UsersRole,
                attributes: ["name", "priority"]
            },
            where: {
                id: id
            }
        });

        if(invalidData.has(userToModify))
            return res.status(404).send({message:"El usuario que esta intentando modificar no existe"});

        if(tokenRole.priority > userToModify.users_role.priority)
            return res.status(403).send({message:"No tiene autorizacion para modificar datos de otros usuarios"});
            
        const userUpdated = await Users.update({user_name: userName}, {
            where: {
                id: id
            }
        });

        return res.status(201).send({userUpdated, message:"Nombre de usuario actualizado correctamente"});
    },

    modifyPassword: async function(req, res){
        const token = req.decoded;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const id = req.params.id;

        if(invalidData.has(oldPassword) || invalidData.has(newPassword))
            return res.status(400).send({message: "Debe ingresar su contraseña actual y la nueva contraseña"});
        
        //Esta validacion solo sirve cuando un cliente esta intentado cambiar su contraseña,
        //ya que cuando lo quiere hacer un admin o un dev 
        if(!await bcrypt.compare(oldPassword, token.password))
            return res.status(401).send({message:"Su contraseña actual no coincide con la que se encuentra en la base de datos"});
        
        if(invalidData.has(id)){
            const userId = token.id;
            const password = await bcrypt.hash(newPassword, 8);
            const userUpdated = await Users.update({password: password}, {
                where: {
                    id: userId
                }
            });
            return res.status(201).send({userUpdated, message:"Contraseña actualizada correctamente"});
        }

        const tokenRole = token.users_role;

        //consulta a la base de datos para obtener el rol del usuario que quiero modificar,
        //esto es para que los admin no puedan modificar los datos de otros admin o de los dev.
        const userToModify = await Users.findOne({
            include: {
                model: UsersRole,
                attributes: ["name", "priority"]
            },
            where: {
                id: id
            }
        });

        if(invalidData.has(userToModify))
            return res.status(404).send({message:"El usuario que esta intentando modificar no existe"});

        if(tokenRole.priority > userToModify.users_role.priority)
            return res.status(403).send({message:"No tiene autorizacion para modificar datos de otros usuarios"});
            
        const password = await bcrypt.hash(newPassword, 8);
        const userUpdated = await Users.update({password: password}, {
        where: {
                id: id
            }
        });

        return res.status(201).send({userUpdated, message:"Contraseña actualizada correctamente"});
    },

    //Modificar email del usuario
    modifyEmail: async function(req, res){
        const token = req.decoded;
        const email = req.body.email;
        const id = req.params.id;

        if(invalidData.has(email))
            return res.status(400).send({message: "Debe ingresar algun email"});
        
        if(invalidData.has(id)){
            const userId = token.id;
            const userUpdated = await Users.update({email: email}, {
                where: {
                    id: userId
                }
            });
            return res.status(201).send({userUpdated, message:"Email actualizado actualizado correctamente"});
        }

        const tokenRole = token.users_role;

        //consulta a la base de datos para obtener el rol del usuario que quiero modificar,
        //esto es para que los admin no puedan modificar los datos de otros admin o de los dev.
        const userToModify = await Users.findOne({
            include: {
                model: UsersRole,
                attributes: ["name", "priority"]
            },
            where: {
                id: id
            }
        });

        if(invalidData.has(userToModify))
            return res.status(404).send({message:"El usuario que esta intentando modificar no existe"});

        if(tokenRole.priority > userToModify.users_role.priority)
            return res.status(403).send({message:"No tiene autorizacion para modificar datos de otros usuarios"});
            
        const userUpdated = await Users.update({email: email}, {
            where: {
                id: id
            }
        });

       return res.status(201).send({userUpdated, message:"Email actualizado correctamente"});    
    },

    deleteUser: async function(req, res){
        const token = req.decoded;
        const id = req.params.id;

        if(invalidData.has(id)){
            const userDeleted = await Users.destroy({
                where: {
                    id: token.id
                }
            }); 
            return res.status(200).send({userDeleted, message: "Usuario eliminado"});
        }

        const roleToken = token.users_role;

        const userToDelete = await Users.findOne({
            include: {
                model: UsersRole,
                attributes: ["name", "priority"]
            },
            where: {
                id:id
            }
        });

        if(invalidData.has(userToDelete))
            return res.status(400).send({message: "El usuario que esta intentando eliminar no existe"});

        if(roleToken.priority > userToDelete.users_role.priority)
            return res.status(403).send({message: "No tiene los permisos necesarios para modificar este usuario"});

        const userDeleted = await Users.destroy({
            where: {
                id: id
            }
        });

        return res.status(200).send({userDeleted, message: "Usuario eliminado"});
    }
}

module.exports = queries;