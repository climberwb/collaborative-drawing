var http = require('http');
var express = require('express');
var socket_io = require('socket.io');
var WORDS = require('./words');
var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var connectionId =0;
var drawStatus;
var connectedUsers =[];


var wordFind = function(){
    var index = Math.floor(Math.random() * WORDS.list.length);
    return WORDS.list[index];
}
var players = [];
var word;
io.on('connection', function (socket) {
  
  connectionId++;
  console.log(connectionId);
  players.push(connectionId);
  connectionId === 1 ? drawStatus = true : drawStatus = false;
  if(drawStatus){
    word = wordFind();
  }
  drawStatus ? socket.emit('person',connectionId, word) : socket.emit('person',connectionId, null);
        
     socket.on('draw', function (coords) {
      //console.log(coords);
      socket.broadcast.emit('draw', coords );
      //online = online - 1;
     });
     
   socket.on('guess',function(guess,Id){
       console.log(guess===word,word,guess);
       if(guess === word){
            io.emit('guess',guess+"CONGRATS "+Id+"!");
       }else{
           io.emit('guess',guess);
       }
   });

  socket.on('disconnect', function() {
        console.log('A user has disconnected');
    });
    
    
   // });   
});

server.listen(8080);