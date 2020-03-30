'use strict';
const h = require('../helpers');

module.exports = (io, app) =>{
	let allrooms = app.locals.chatrooms;

	io.of('/roomslist').on('connection', socket =>{
		socket.on('getChatrooms', () =>{
			socket.emit('chatRoomsList', JSON.stringify(allrooms));
		})
		socket.on('createNewRoom', newRoomInput => {
			//check to see if room with the same title exists
			//if not create one and broadcast
			if(!h.findRoomsByName(allrooms, newRoomInput)){
				//create new room
				allrooms.push({
					room: newRoomInput,
					roomID: h.randomHex(),
					users : []
				});
				// Emit an updated list to the creator
				socket.emit('chatRoomsList', JSON.stringify(allrooms))
				//Emit an updated list to everyone in the room
				socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms))
			}
		});
	});

	io.of('/chatter').on('connection', socket =>{
		socket.on('join', data => {
			let usersList = h.addUserToRoom(allrooms, data, socket);

			//update the list of active users on chatroom page
		
			socket.broadcast.to('updateUsersList').emit('updateUsersList', JSON.stringify(usersList.users));
			socket.emit('updateUsersList', JSON.stringify(usersList.users));
		})

		//when socket exits
		socket.on('disconnect', ()=>{
			let room = h.removeUserFromRoom(allrooms, socket);
			//console.log(room)
			socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
		});

		//when a new message arrives
		socket.on('newMessage', data =>{
			socket.broadcast.to(data.roomID).emit('inMessage', JSON.stringify(data))
		})
	})


}; 
