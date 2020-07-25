const fs = require("fs");
var redis = require('redis');
var JWTR = require('jwt-redis').default;

var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);


const JWT_PRIVATE_KEY = fs.readFileSync("./private.key");
var expiration_day = 2

const signOptions = {
    issuer: "Kuber User",
    subject: "Validate user",
    audience: "Users",
    expiresIn: (expiration_day).toString() + 'd',
    algorithm: "RS256"
};



const getSignedToken = (payload) =>
    new Promise((resolve, reject) => {

        jwtr.sign(payload,
            JWT_PRIVATE_KEY,
            signOptions
        ).then(token => { resolve(token) }).catch(err => { reject(err) })
    });


const verifyToken = (req, res, next) => {
    console.log("Request Came at ", new Date(), " For -");
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        //Split at the space
        const bearer = bearerHeader.split(" ");
        //console.log(bearer);
        //Get token from array
        const bearerToken = bearer[1];
        var publicKEY = fs.readFileSync("./public.key", "utf8");
        //console.log(bearerToken);
        // jwtr.verify(token, secretOrPublicKey, [options])

        jwtr.verify(bearerToken, publicKEY, signOptions).catch(err => {
            res.send({
                code: 403,
                err_cd: "Invalid Token"
            });
        }).then(authData => {
            {//console.log(authData);
                req.token = bearerToken;
                req["token"] = bearerToken;
                //set userData
                req.user_data = authData;
                req["user_data"] = authData;
                next();
            }
        })
    } else {
        //Forbidden
        res.sendStatus(403);
    }
}


const destroySignedToken = (payload) =>
    new Promise((resolve, reject) => {
        jwtr.destroy(payload, signOptions).then(destroy => resolve(destroy)).catch(err => reject(err))
    });

module.exports = {
    getSignedToken,
    verifyToken,
    destroySignedToken
}