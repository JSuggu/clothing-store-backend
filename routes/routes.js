const express = require("express");
const router = express.Router();
const verifyToken = require("../controllers/verify-token");
const routesQueries = require("../controllers/db-queries");

//RUTAS PARA USUARIOS
router.get("/users/:id?", verifyToken.admin, routesQueries.users);
router.post("/check-in", routesQueries.registerUser); //para cuando los clientes se registren
router.post("/add/user", verifyToken.developer, routesQueries.addUser); //para que el developer agregue usuarios
router.post("/log-in", routesQueries.login);
router.put("/modify/names/:id?", verifyToken.customer, routesQueries.modifyNames);
router.put("/modify/user-name/:id?", verifyToken.customer, routesQueries.modifyUserName);
router.put("/modify/password/:id?", verifyToken.customer, routesQueries.modifyPassword);
router.put("/modify/email/:id?", verifyToken.customer, routesQueries.modifyEmail);
router.delete("/delete/user/:id?", verifyToken.customer, routesQueries.deleteUser);


//RUTAS PARA PRODUCTOS
router.get("/products/:type?", routesQueries.products);
router.post("/add/product", verifyToken.admin, routesQueries.addProduct);
router.put("/modify/product/:id", verifyToken.admin, routesQueries.modifyProduct);
router.delete("/delete/product/:id", verifyToken.admin, routesQueries.deleteProduct);

//RUTAS CREAR ROLES DE USUARIOS, COLORES Y TIPOS DE ROPA
router.post("/add/user-role", verifyToken.developer,routesQueries.addRole);
router.get("/roles", verifyToken.admin, routesQueries.roles);
router.post("/add/clothes-color", verifyToken.admin, routesQueries.addColor);
router.get("/colors", verifyToken.admin, routesQueries.colors);
router.post("/add/clothes-type", verifyToken.admin, routesQueries.addType);
router.get("/types", verifyToken.admin, routesQueries.types);

module.exports = router;

