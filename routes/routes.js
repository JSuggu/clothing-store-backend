const express = require("express");
const router = express.Router();
const routesQueries = require("../controllers/db-queries");

//RUTAS PARA USUARIOS
router.get("/users");
router.post("/login");
router.post("/check-in");
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

//RUTAS CREAR COLORES Y TIPOS DE ROPA
router.post("/add/clothes-color", routesQueries.addColor);
router.get("/colors", routesQueries.colors);
router.get("/color/:id", routesQueries.colors);
router.post("/add/clothes-type", routesQueries.addType);
router.get("/types", routesQueries.types);
router.get("/type/:id", routesQueries.types);

module.exports = router;

