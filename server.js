var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var port = process.env.PORT || 3000;
var drawArray = [];   //for storing what has been drawn so far
var lineArray = [];
var squareArray = [];
var circleArray = [];
var triangleArray = [];
var userArray = [];
var userNum = 1;

io.on('connection', function(socket){

  let socketID = socket.id;
  let currentUser = "";

  //add unique user to userArray
  userArray.push({[socketID]: "User-" + userNum});
  userNum++;

  //filter particular user
  userArray.filter(function(user){
      if(Object.keys(user) == socketID){
        for(val in user){
          currentUser = user[val];
        }
      }
  });


  //user has connected
  io.emit('user_connected', {loginMessage: currentUser + " has connected" });


  //user has disconnected
  socket.on('disconnect', function(){

    userArray.filter(function(user, index){
        if(Object.keys(user) == socket.id){
          for(val in user){
            currentUser = user[val];
          }
          userArray.splice(index, 1);
        }
    });
    io.emit('user-disconnect', {disconnectMessage: currentUser + " has disconnected"});
  });

 //update new client with current drawing that has been drawn
  socket.emit('draw-current-drawing', {draw: drawArray});
 // update new client with lines that have been drawn;
  socket.emit('draw-current-line', {line: lineArray});
  // update new client with squares that have been drawn
  socket.emit('draw-current-square', {square: squareArray});
  // update new client with circles that have been drawn
  socket.emit('draw-current-circle', {circle: circleArray});
  // update new client with triangle that have been drawn
  socket.emit('draw-current-triangle', {triangle: triangleArray});


  //client has drawn something
  socket.on('draw-new', function(data){
    drawArray.push(data.line);
    //send line to clients
    socket.broadcast.emit('draw-new', {line: data.line});
  });

  //client has drawn a line
  socket.on('draw-new-line', function(data){
    lineArray.push(data.line);
    socket.broadcast.emit('draw-new-line', {line: data.line});
  });

  //client has drawn a square
  socket.on('draw-new-square', function(data){
    squareArray.push(data.square);
    socket.broadcast.emit('draw-new-square', {square: data.square});
  });

  //client has drawn a circle
  socket.on('draw-new-circle', function(data){
    circleArray.push(data.circle);
    socket.broadcast.emit('draw-new-circle', {circle: data.circle});
  });

  //client has drawn a triangle
  socket.on('draw-new-triangle', function(data){
    triangleArray.push(data.triangle);
    socket.broadcast.emit('draw-new-triangle', {triangle: data.triangle})
  })

});

server.listen(port, function(){
  console.log('listening on *:', port);
});
