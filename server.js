var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var port = process.env.PORT || 3000;
var drawArray = [];   //for storing what has been drawn so far

io.on('connection', function(socket){

  //user has connected
  io.emit('user_connected', {message: "a user has connected"});

  //user has disconnected
  socket.on('disconnect', function(){
    io.emit('user-disconnect', {message: "a user disconnected"});
  });

 //update new client with current drawing that has been drawn
   socket.emit('draw-current', {array: drawArray});

  //client has drawn something
  socket.on('draw-new', function(data){
    drawArray.push(data.line);
    //send line to clients
    socket.broadcast.emit('draw-new', {line: data.line});
  });

});

server.listen(port, function(){
  console.log('listening on *:', port);
});
