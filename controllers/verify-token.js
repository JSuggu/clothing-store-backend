const jwt = require("jsonwebtoken");
const getKey = require("./users-keys");


const getToken = function (req){
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if(!token)
        return "Necesita un token de autenticacion valido";
    
    if(token.startsWith("Bearer "))
        token = token.slice(7, token.length);
    
    return token;
}

const verification = {

    developer: function(req, res, next){
        const token = getToken(req);
        jwt.verify(token, getKey("developer"), (err, decoded) => {
            if(err)
                return res.status(401).send({message: token});
            
            req.decoded = decoded;
            next();
        });

    },

    admin: function (req, res, next){
        const token = getToken(req);
        jwt.verify(token, getKey("admin"), (err, decoded) => {
            if(err)
                return res.status(401).send({message: "El token no es valido"});
            
            req.decoded = decoded;
            next();
        });
    },

    customer: function(req, res, next){
        const token = getToken(req);
        jwt.verify(token, getKey("customer"), (err, decoded) => {
            if(err)
                return res.status(401).send({message: "El token no es valido"});
            
            req.decoded = decoded;
            next();
        });
    }

}

module.exports = verification;