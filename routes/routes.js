const express = require("express");
const router = express.Router();
const verifyToken = require("../controllers/verify-token");
const routesQueries = require("../controllers/db-queries");

//RUTAS PARA USUARIOS
router.get("/users", verifyToken.admin, routesQueries.users);
router.post("/check-in", routesQueries.registerUser); //para cuando los clientes se registren
router.post("/add/user", verifyToken.developer, routesQueries.addUser); //para que el developer agregue usuarios
router.post("/login", routesQueries.login);
router.put("/modify/name/:id?", verifyToken.customer, );
router.put("/modify/user-name/:id?", verifyToken.customer, );
router.put("/modify/password/:id?", verifyToken.customer, );
router.put("/modify/email/:id?", verifyToken.customer, );
router.delete("/delete/user/:id?", verifyToken.customer, );


//RUTAS PARA PRODUCTOS
router.get("/products", routesQueries.products);
router.post("/add/products", verifyToken.admin, routesQueries.addProductos);
router.put("/modify/food/:id", verifyToken.admin, );
router.delete("/delete/food/:id", verifyToken.admin, );

//RUTAS CREAR ROLES DE USUARIOS, COLORES Y TIPOS DE ROPA
router.post("/add/user-rol", verifyToken.developer,routesQueries.addRol);
router.get("/roles", verifyToken.admin, routesQueries.roles);
router.post("/add/clothes-color", verifyToken.admin, routesQueries.addColor);
router.get("/colors", verifyToken.admin, routesQueries.colors);
router.post("/add/clothes-type", verifyToken.admin, routesQueries.addType);
router.get("/types", verifyToken.admin, routesQueries.types);

module.exports = router;

