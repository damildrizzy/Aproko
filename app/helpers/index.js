'use strict';
const db = require('../db');
const crypto = require('crypto');


//query a single user
let findOne = profileID =>{
   db.userModel.findOne({
        profileId : profileID
    }, (err, result)=>{
        if(err){
            console.log(err)
            return done(err)
        }
    })
};

//let findOne = profileID => {
//    return new Promise((resolve, reject) =>{
  //      let chatUser = db.userModel.findOne({profileId: profileID })
   // });
   // resolve(chatUser)
//}

let createNewUser = profile =>{
    return new Promise((resolve, reject)=>{
        let newChatUser = new db.userModel({
            profileId: profile.id,
            fullName: profile.displayName,
            profilePic: profile.photos[0].value || ''
        });
        newChatUser.save(error =>{
            if(error){
                reject(error)
            }else{
                resolve(newChatUser)
            }   
        })
    })
};

let findById = id =>{
    return new Promise((resolve, reject)=>{
        db.userModel.findById(id, (error, user)=>{
            if(error){
                reject(error)
            }else{
                resolve(user)
            }
        });
    });
};

//A middleware to check if user is logged in
let isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        next()
    }else{
        res.redirect('/')
    }
}

let findRoomsByName = (allrooms, room) => {
    let findRoom = allrooms.findIndex((element, index, array)=>{
        if(element.room === room){
            return true
        }else{
            return false
        }
    });
    return findRoom > -1 ? true : false
}

let randomHex = () => {
    return crypto.randomBytes(24).toString('hex');
}

let findRoomById = (allrooms, roomID)=>{
    return allrooms.find((element, index, array)=>{
        if(element.roomID === roomID){
            return true
        }else{
            return false
        }
    });
};

//add users to room
let addUserToRoom = (allrooms, data, socket)=>{
    //get room object
    let getRoom = findRoomById(allrooms, data.roomID)
    if (getRoom!== undefined){
        //get active user's objectID
        let userID = socket.request.session.passport.user;
        //check to see if user is already in the chatroom
        let checkUser = getRoom.users.findIndex((element, index, array)=>{
            if(element.userID === userID){
                return true
            }else{
                return false
            }
        });
        //If user is already in room remove him first
        if(checkUser > -1){
            getRoom.users.splice(checkUser, 1)
        }

        //push user to room's users array
        getRoom.users.push({
            socketID : socket.id,
            userID,
            user: data.user,
            userPic: data.userPic
        })

        //join the room
        socket.join(data.roomID);

        return getRoom
    }
}

let removeUserFromRoom = (allrooms, socket) =>{
    for (let room of allrooms){
        let findUser = room.users.findIndex((element, index, array)=>{
            if(element.socketID == socket.id){
                return true
            }else{
                return false
            }
        });
        if (findUser > -1){
            socket.leave(room.roomID)
            room.users.splice(findUser, 1)
            return room
        }
    }
}


module.exports ={
    findOne,
    createNewUser, 
    findById,
    isAuthenticated,
    findRoomsByName,
    randomHex,
    findRoomsByName,
    findRoomById,
    addUserToRoom,
    removeUserFromRoom
}