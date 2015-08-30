var Player = function(Id,socket){
    this.Id = Id;
    this.drawStatus = false;
    this.socket=socket;
}

module.exports = Player;