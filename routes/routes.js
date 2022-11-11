const express = require("express");
const router = express.Router();
const routesQueries = require("../controllers/db-queries");

//RUTAS PARA USUARIOS
router.get("/users", routesQueries.users);
router.post("/check-in", routesQueries.registerUser); //para cuando los clientes se registren
router.post("/add/user", routesQueries.addUser); //para que el admin principal agregue usuarios
router.post("/login", routesQueries.login);
router.put("/modify/name/:id");
router.put("/modify/user-name/:id");
router.put("/modify/password/:id");
router.put("/modify/email/:id");
router.delete("/delete/users");


//RUTAS PARA PRODUCTOS
router.get("/products", routesQueries.products);
router.post("/add/products", routesQueries.addProductos);
router.put("/modify/food");
router.delete("/delete/food/:id");

//RUTAS CREAR COLORES, TIPOS DE ROPA y ROLES DE USUARIOS
router.post("/add/users-rol", routesQueries.addRol);
router.get("/rols", routesQueries.rol);
router.post("/add/clothes-color", routesQueries.addColor);
router.get("/colors", routesQueries.colors);
router.post("/add/clothes-type", routesQueries.addType);
router.get("/types", routesQueries.types);

module.exports = router;

