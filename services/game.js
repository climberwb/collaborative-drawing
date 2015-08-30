var Player = require('./player');
var WORDS = require('../words');

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
          self.players[i].drawStatus = false;
          
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
           

    }
    }
}
Game.prototype.wordFind = function(){
    var index = Math.floor(Math.random() * WORDS.list.length);
    this.word = WORDS.list[index];
    return this.word;
}

module.exports = Game;