var http = require('http');
var express = require('express');
var socket_io = require('socket.io');
var WORDS = require('./words');
var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var Game = require('./services/game');


var game = new Game();
game.wordFind();

io.on('connection', function (socket) {
  
   var playerCreatedOnConnection = game.createPlayer(socket);
   
   playerCreatedOnConnection.drawStatus ? socket.emit('person',playerCreatedOnConnection.Id, game.word) : socket.emit('person',playerCreatedOnConnection.Id, null);
   
    socket.on('draw', function (coords) {
      socket.broadcast.emit('draw', coords );
    });
    
    socket.on('guess',function(guess,Id){
          if(guess === game.word){
            io.emit('guess',guess+", CONGRATS: player "+Id+"!",Id);
          }else{
            io.emit('guess',guess,null);
          }
    });
    
    socket.on('resetGame',function(Id){
      game.resetGame();
      socket.emit('resetGame',Id,game.word);
      socket.broadcast.emit('resetGame',Id,null);
    });
    
    socket.on('disconnect', function() {
        var playerStatus;
        game.players.forEach(function(player,index){
           
           if(player.socket === socket){
               playerStatus = player.drawStatus;
                game.players.splice(index,index+1);
               console.log(game.players);
               return game.payers
           } 
        });
        if(playerStatus){
                   console.log(game,'game');
                    socket.broadcast.emit('disconnectReset',game.players[0].Id,game.word);
               }
    });

});


server.listen(8080);