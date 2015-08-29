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
///TODO finish class system to keep track of players 
var Game = function(){
    this.connectionOrderId=0;
    this.players=[];
    this.firstConnection = true;
    this.word;
}

Game.prototype.addPlayer = function(player){
    this.players.push(player);
    return this.players;
}

Game.prototype.incrementOrderId = function(){
    this.connectionOrderId++;
    return this.connectionOrderId;
}
Game.prototype.createPlayer = function(socket){
    var player;
    this.incrementOrderId();
    player= new Player(this.connectionOrderId,socket);
    console.log(player.Id);
    if(this.firstConnection && player.Id ===1){
        player.drawStatus = true;
    }
    this.addPlayer(player);
    return player;
}
Game.prototype.resetGame = function(){
    this.firstConnection = false;
    this.wordFind();
    var self = this;
    
    for(var i = 0; i< this.players.length-1;i++){
       if(self.players[i].drawStatus === true){
          // console.log(self.players[i].drawStatus);
           self.players[i].drawStatus = false;
          // console.log(self.players[i+1].drawStatus);
          // self.players[i-1].drawStatus;
          if(i === 0){
              self.players[i+1].drawStatus=true;
              console.log(self.players);
              return;
          }
          else if(i <self.players.length-1){
              self.players[i-1].drawStatus=true;
              console.log(self.players);
              return;
          }
           
     //  }
    }
    }
}
Game.prototype.wordFind = function(){
    var index = Math.floor(Math.random() * WORDS.list.length);
    this.word = WORDS.list[index];
    return this.word;
}

var Player = function(Id,socket){
    this.Id = Id;
    this.drawStatus = false;
    this.socket=socket;
}
// UNCOMMENT CODE BELOW AND COMMENT CODE ABOVE FOR OLD FUNCTIONALITY

// var startGame = function(socket){
//   connectionId++;
//   console.log(connectionId);
//   players.push(connectionId);
//   connectionId === 1 ? drawStatus = true : drawStatus = false;
//   if(drawStatus){
//     word = wordFind();
//   }
//   drawStatus ? socket.emit('person',connectionId, word) : socket.emit('person',connectionId, null);
        
//      socket.on('draw', function (coords) {
//       //console.log(coords);
//       socket.broadcast.emit('draw', coords );
//       //online = online - 1;
//      });
     
//   socket.on('guess',function(guess,Id){
//       console.log(guess===word,word,guess);
//       if(guess === word){
//             io.emit('guess',guess+", CONGRATS: player "+Id+"!",Id);
//       }else{
//           io.emit('guess',guess,null);
//       }
//   });
   
//   socket.on('resetGame',function(Id){
//       io.emit('resetGame',Id);
//   });

//   socket.on('disconnect', function() {
//         console.log('A user has disconnected');
//     });
    
// }
////////////// new connection event
var game = new Game();
game.wordFind();

io.on('connection', function (socket) {
  
   var playerCreatedOnConnection = game.createPlayer(socket);
   
   playerCreatedOnConnection.drawStatus ? socket.emit('person',playerCreatedOnConnection.Id, game.word) : socket.emit('person',playerCreatedOnConnection.Id, null);
   
    socket.on('draw', function (coords) {
      socket.broadcast.emit('draw', coords );
    });
    
    socket.on('guess',function(guess,Id){
          console.log(guess===game.word,game.word,guess);
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
        console.log('before',game.players);
        var playerStatus;
        game.players.forEach(function(player,index){
           
           if(player.socket === socket){
               playerStatus = player.drawStatus;
               delete game.players.splice(index,index);
               
               return game.payers
           } 
        });
        if(playerStatus){
                   console.log(game,'game');
                    socket.broadcast.emit('disconnectReset',game.players[0].Id,game.word);
               }
        console.log('after',game.players);
        // game.player.forEach(function(player){
            
        // });
    });
//   startGame(socket);
//   socket.on('newGame',startGame);
  
   
});











////////////////// above class system to clean up code
// var wordFind = function(){
//     var index = Math.floor(Math.random() * WORDS.list.length);
//     return WORDS.list[index];
// }
// var players = [];
// var word;

// var startGame = function(socket){
//   connectionId++;
//   console.log(connectionId);
//   players.push(connectionId);
//   connectionId === 1 ? drawStatus = true : drawStatus = false;
//   if(drawStatus){
//     word = wordFind();
//   }
//   drawStatus ? socket.emit('person',connectionId, word) : socket.emit('person',connectionId, null);
        
//      socket.on('draw', function (coords) {
//       //console.log(coords);
//       socket.broadcast.emit('draw', coords );
//       //online = online - 1;
//      });
     
//   socket.on('guess',function(guess,Id){
//       console.log(guess===word,word,guess);
//       if(guess === word){
//             io.emit('guess',guess+", CONGRATS: player "+Id+"!",Id);
//       }else{
//           io.emit('guess',guess,null);
//       }
//   });
   
//   socket.on('resetGame',function(Id){
//       io.emit('resetGame',Id);
//   });

//   socket.on('disconnect', function() {
//         console.log('A user has disconnected');
//     });
    
// }
// io.on('connection', function (socket) {
//   startGame(socket);
//   socket.on('newGame',startGame);
    
//   // });   
// });

server.listen(8080);