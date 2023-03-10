const express = require ("express");
const app = express();
const routes = require ("./routes/routes");
const sequelize = require ("./controllers/db-connection");
require("dotenv").config({path:"./.env"});

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
app.listen(process.env.PORT, (req, res) => {
    console.log("servidor iniciado");
})

app.use("/", routes);