'use strict';
const express = require("express");
const app = express()
const chatCat = require("./app");
const passport = require("passport");
const port = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(chatCat.session)
app.use(passport.initialize())
app.use(passport.session())
app.use(require('morgan')('combined', {
    stream: {
        write : message => {
            //write to Logs
            chatCat.logger.log('info', message);
        }
    }
}))




app.use('/', chatCat.router)


chatCat.ioServer(app).listen(port, () =>{
    console.log("Chatcat is running on: ", port)
});