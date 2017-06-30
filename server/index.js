const express = require('express');
const path = require('path');
const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../chat-brew-ui/build')));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, function () {
  console.log(`chat-brew-server listening on port ${PORT}.`)
});

const io = require('socket.io')(server);

var rooms = [];

io.on('connection', function (socket) {

  socket.on('create_room', function(data) {
      socket.join(data.room, function () {
        rooms.push(data.room);
        io.emit('share_rooms', {rooms: rooms});
      });
  });

  socket.on('disconnecting', function() {
    let currentRooms = io.nsps['/'].adapter.rooms;

    Object.keys(currentRooms).forEach((room) => {
      if(rooms.includes(room) && currentRooms[room].length === 1
         && io.sockets.adapter.sids[socket.id][room]) {
        rooms.splice(rooms.indexOf(room), 1);
      }
    });

    io.emit('share_rooms', {rooms: rooms});
  });


  socket.on('exit_room', function(data) {
    let currentRooms = io.nsps['/'].adapter.rooms;

    if(rooms.includes(data.room) && currentRooms[data.room].length === 1
         && io.sockets.adapter.sids[socket.id][data.room]) {
      socket.leave(data.room, function () {
        rooms.splice(rooms.indexOf(data.room), 1);
        io.emit('share_rooms', {rooms: rooms});
      });
    }
  });

  socket.on('get_rooms', function() {
      socket.emit('share_rooms', {rooms: rooms});
  });

  socket.on('join_room', function(data) {
    socket.join(data.room);
  });

  socket.on('send_message', function(data) {
    socket.broadcast.to(data.room).emit('message_to_room', {msg: data.msg});
  });
});
