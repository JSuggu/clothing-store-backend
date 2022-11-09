const express = require("express");
const router = express.Router();

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
router.get("/products");
router.post("/add/products");
router.put("/modify/food");
router.delete("/delete/food/:id");

module.exports = router;

