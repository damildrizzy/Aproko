"use strict";

if(process.env.NODE_ENV === 'production'){
    module.exports = {
        host : process.env.host || '',
        dbURI : process.env.dbURI,
        sessionSecret: process.env.sessionSecret,
        "google" : {
            "clientID": process.env.GoogleID,
            "clientSecret": process.env.GoogleSecret,
            "callbackURL": "https://aprokoherokuapp.com/auth/google/callback",
            "profileFields": ["id", "displayName", "photos"]
        },
         "facebook" : {
            "clientID": process.env.FbID,
            "clientSecret": process.env.FbSecret,
            "callbackURL": "https://aproko.herokuapp.com/auth/facebook/callback",
            "enableProof": true,
            "profileFields": ["id", "displayName", "photos"]
        }
    }
}else{
    module.exports = require("./development.json")
}