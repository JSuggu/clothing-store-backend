const express = require ("express");
const app = express();
const routes = require ("./routes/routes");
const sequelize = require ("./controllers/db-connection");

//TABLAS DE LA BASE DE DATOS IMPORTADAS
const Users = require("./models/Users"); 
const UsersRole = require("./models/UsersRole"); 
const Clothes = require("./models/Clothes"); 
const ClothesColor = require("./models/ClothesColor"); 
const ClothesType = require("./models/ClothesType"); 


//MIDDLEWARES
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, enc-entype, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//RUTAS Y CONEXION

sequelize.sync();
app.listen(3000, (req, res) => {
    console.log("servidor iniciado");
})

app.use("/", routes);