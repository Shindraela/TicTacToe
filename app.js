'use strict';

let express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(process.env.PORT || 7001, function() {
  console.log('listening on *:7001');
});

// routing
app.get('/', function(req, res) {
    res.sendFile("index.html", {"root": __dirname});
});
app.use('/', express.static(__dirname + '/public'));


// Set users list
let players = [];
let player;

function initTheGame(socket) {
  // Add user in list user
  if(Object.keys(io.sockets.sockets).length < 3) {
    players.push(socket);
  }

  // Send initialisation of board
  socket.emit("initBoard");

  // Send to initialize second player
  if (Object.keys(io.sockets.sockets).length > 1 ) {
    socket.emit("startGame");
    socket.emit("secondPlayer", { mark: socket.mark });
  }
}

// When user is connecting to server
io.sockets.on("connection", function (socket) {
  console.log("Number of sockets :", Object.keys(io.sockets.sockets).length);

  // Initialize the game
  initTheGame(socket);

  socket.on("playTurn", function(data) {
    socket.emit("turnPlayed", {
      square: data.square
    });
  });

  // Send and receive chat and messages
  socket.on("chat", function(msg) {
    io.emit("chatMessages", msg);
  });

  // When client disconnected
  socket.on("disconnect", function() {
    console.log("Player has disconnect");

    // Delete player from sockets list
    var index = players.indexOf(socket);
    players.splice(index, 1);
  });

});
