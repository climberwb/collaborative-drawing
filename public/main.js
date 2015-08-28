var socket = io();

//////// PERSON CONSTRUCTOR

var User = function(Id,word){
    this.Id = Id;
    this.word = word;
}

var player;
var setPlayer =function(Id,word){
    
   player =  new User(Id,word);
   player.playGame();
}

socket.on('person',setPlayer);


User.prototype.playGame = function(){
    var self = this;
    ////////////////////////// Show word
    if(this.word !== null){
        console.log(this.word);
        $('#word span').append( this.word );
        $('#guess').hide();
        $('#word').show();
    }else{
        $('#word').hide();
        $('#guess').show();
    }
    ////////////////////////// GUESS BOX
    var guessBox;
    
    var addGuess = function(guess){
        $('#guesses ul').append( "<li>"+guess+"</li>" );
    };
    
    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
        //addGuess(this.value);
        socket.emit('guess',this.value,self.Id);
        this.value = '';
        
    };
    
    socket.on('guess',addGuess);
    
    var pictionaryEvent = function(){
        
        var canvas, context;
        var draw = function(pos) {
            context.beginPath();
            context.arc(pos.x, pos.y,
                             6, 0, 2 * Math.PI);
            context.fill();
        };
         canvas = $('canvas');
         context = canvas[0].getContext('2d');
         canvas[0].width = canvas[0].offsetWidth;
         canvas[0].height = canvas[0].offsetHeight;
         var offset = canvas.offset();
    
          socket.on('draw',draw);
    }
    
    var pictionary = function() {
        
        var canvas, context, drawing;
    
        
        var draw = function(position) {
            context.beginPath();
            context.arc(position.x, position.y,
                             6, 0, 2 * Math.PI);
            context.fill();
        };
    
        canvas = $('canvas');
        context = canvas[0].getContext('2d');
        canvas[0].width = canvas[0].offsetWidth;
        canvas[0].height = canvas[0].offsetHeight;
        canvas.on('mousedown',function(){drawing = true
            canvas.on('mouseup',function(){drawing = false;});
                canvas.on('mousemove', function(event) {
                    if(drawing){
                        var offset = canvas.offset();
                        var position = {x: event.pageX - offset.left,
                                        y: event.pageY - offset.top};
                        socket.emit('draw', position);
                        draw(position);
                    }
                });
            });
    };
    
    // var guessBroadcast = function(){
        
    // } 
    
    $(document).ready(function() {
        console.log(player,3);
        
        pictionaryEvent();
        if(self.word !==null){ //remove conditional for collaborative drawing
            pictionary();
        }
        $('#clearCanvas').on('click',function(){//TODO get this event to trigger with socket events
                                                //after person wins. 
                                                //TODO only show clar canvas button after a win to the winner.
            var canvas = $('canvas');
            var context = canvas[0].getContext('2d');
            context.clearRect(0, 0, canvas[0].width, canvas[0].height);
        });
        guessBox = $('#guess input');
        guessBox.on('keydown', onKeyDown);
        
    });

}