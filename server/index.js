const express = require('express');
const path = require('path');
const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../chat-brew-ui/build')));

// Answer API requests.
app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

const port = process.env.PORT || 5000;
console.log(port);

const server = app.listen(port, function () {
  console.log(`chat-brew-server listening on port ${port}.`)
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

    Object.keys(currentRooms).forEach((key) => {
      /*delete the room if nobody if all connections close*/
      if(rooms.includes(key) && currentRooms[key].length <= 1) {
        rooms.splice(rooms.indexOf(key), 1);
      }
    });

    io.emit('share_rooms', {rooms: rooms});
  });


  socket.on('exit_room', function(data) {
    /*Close room if any participant leaves*/
    socket.leave(data.room, function () {
      rooms.splice(rooms.indexOf(data.room), 1);
      io.emit('share_rooms', {rooms: rooms});
    });
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
