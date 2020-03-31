'use strict';
const passport = require("passport");
const config = require("../config");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const FacebookStrategy = require("passport-facebook").Strategy
const h = require("../helpers");
const logger = require('../logger');

module.exports = () =>{
    passport.serializeUser((user, done)=>{
        done(null, user.id)
    });

    passport.deserializeUser((id, done)=>{
        //find by id
        h.findById(id)
            .then(user => done(null, user))
            .catch(error => console.log("Error deserializing user: ", error))
    })

    let authProcessor = (accessToken, refreshToken, profile, done) =>{
        let user = h.findOne(profile.id);
        if(user){
            done(null, user)
        }else{
             h.createNewUser(profile)                        
            .then(newChatUser => done(null, newChatUser))
            .catch(error => console.log("error creating new user"))
        }}
    passport.use(new GoogleStrategy(config.google, authProcessor))
    passport.use(new FacebookStrategy(config.facebook, authProcessor))
}