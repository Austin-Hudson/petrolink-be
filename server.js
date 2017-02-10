var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var port = process.env.PORT || 3000;

// app.get('/', function(req, res){
//   res.sendfile('/index.html');
// });

io.on('connection', function(socket){

  //user has connected
  io.emit('user_connected', {message: "a user has connected"});

  //user has disconnected
  socket.on('disconnect', function(){
    io.emit('user-disconnect', {message: "a user disconnected"});
 });
});

server.listen(port, function(){
  console.log('listening on *:', port);
});
