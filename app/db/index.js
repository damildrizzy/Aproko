'use strict';
const config = require("../config");
const mongoose = require("mongoose");
const logger = require('../logger');

//connect to database and log connection status
mongoose.connect(config.dbURI, {
    useNewUrlParser: true
})
.then(() => logger.log("Mongo Conn status: ", JSON.stringify(mongoose.connection.readyState)))

//log connection error
mongoose.connection.on('error', error => logger.log('error', 'Mongo Error'))

//create user schema
const chatUser = new mongoose.Schema({
    profileId: String,
    fullName: String,
    profilePic: String
})

//create user model
let userModel = mongoose.model('chatUser', chatUser)

module.exports = {
    mongoose, 
    userModel
}