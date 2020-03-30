'use strict';
const h = require("../helpers");
const router = require("express").Router();
const passport = require("passport");
const config = require("../config");

router.get('/', (req, res, next )=>{
    res.render('login')
});

router.get('/rooms', [h.isAuthenticated, (req, res, next)=>{
    res.render('rooms', {
    	user: req.user,
      host: config.host
    })
}]);

router.get('/chat/:id', [h.isAuthenticated, (req, res, next)=>{
  //find a chatroom with given id and render it if id is found
  let getRoom = h.findRoomById(req.app.locals.chatrooms, req.params.id);
  if(getRoom === undefined){
    console.log("an error here")
    return next();
  }
  res.render('chatroom', {
    user: req.user,
    host: config.host,
    room: getRoom.room,
    roomID: getRoom.roomID
  })
  
    
}]);

router.get('/auth/google', passport.authenticate('google', { 
    scope: 'https://www.googleapis.com/auth/plus.login'
}))

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/rooms');
  });

router.get('/auth/facebook',
  passport.authenticate('facebook')
);

router.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect: '/rooms',
		failureRedirect: '/'
	}));

router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/');
})

//Renders a 404 page. That is why this middleware is placed last
router.use('', (req, res, next) =>{
    res.render('404')
})

module.exports = router;