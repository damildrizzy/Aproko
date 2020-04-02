"use strict";


if(process.env.NODE_ENV === 'production'){
    let host = process.env.host;
    if (host[-1] == '/'){
        host = host.slice(0, -1)
    }
    module.exports = {
        host : process.env.host || '',
        dbURI : process.env.dbURI,
        sessionSecret: process.env.sessionSecret,
        "google" : {
            "clientID": process.env.GoogleID,
            "clientSecret": process.env.GoogleSecret,
            "callbackURL": host + "/auth/google/callback",
            "profileFields": ["id", "displayName", "photos"],
            "proxy": true
        },
         "facebook" : {
            "clientID": process.env.FbID,
            "clientSecret": process.env.FbSecret,
            "callbackURL": host + "/auth/facebook/callback",
            "enableProof": true,
            "profileFields": ["id", "displayName", "photos"]
        }
    }
}else{
    module.exports = require("./development.json")
}