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
    if(this.word){
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
    
    var addGuess = function(guess,Id){
        $('#guesses ul').append( "<li>"+guess+"</li>" );
        console.log(Id+'addGuess '+self.Id);
        if(Id === self.Id){
            $('#resetGame').show();
        }
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
    
    /////// reset game
var resetGame = function(Id,word){
    self.word = word;
    $('#word span').html("");
    if(self.word){
        $('#word span').append(self.word);
        $('#word').show();
        $('#guess').hide();
    }else{
        $('#word').hide();
        $('#guess').show();
    }
    
    $('canvas').remove();
    $('#main').append('<canvas id=canvas></canvas>');
    var canvas = $('canvas');
    
    var context = canvas[0].getContext('2d');
    context.clearRect(0, 0, canvas[0].width, canvas[0].height);
    $('#guesses li').hide();
    console.log(self.Id,Id);
    $(document).off();
    //$('#resetGame').off();
    if(self.Id === Id){
        $('#resetGame').hide();
        console.log(word);
    }else{
      //  alert(word);
    }
     pictionaryEvent();
        if(self.word !==null){ //remove conditional for collaborative drawing
            pictionary();
        }
        // reset Game
}

var disconnectReset = function(Id,word){
    console.log('disconnnectReset: ',Id,self.Id);
    if(Id === self.Id){
        console.log('Inside if: disconnectReset');
        self.word = word;
        alert('the old drawer left you are the new drawer');
        $('#word span').html("");
        $('#word span').append(self.word);
        $('#word').show();
        $('#guess').hide();
        
        $('canvas').remove();
        $('#main').append('<canvas id=canvas></canvas>');
        var canvas = $('canvas');
    
        var context = canvas[0].getContext('2d');
        context.clearRect(0, 0, canvas[0].width, canvas[0].height);
        $('#guesses li').hide();
        
        $(document).off();
        
        pictionaryEvent();
        pictionary();
    }
    
   
    
    if(self.Id === Id){
        $('#resetGame').hide();
        console.log(word);
    }else{
     
    }
     pictionaryEvent();
        if(self.word !==null){ //remove conditional for collaborative drawing
            pictionary();
        }
        // reset Game
}
    //////////
    $(document).ready(function() {
        console.log(player);
 
        pictionaryEvent();
        if(self.word !==null){ //remove conditional for collaborative drawing
            pictionary();
        }
        // reset Game
        $('#resetGame').on('click',function(){ socket.emit('resetGame',self.Id) });
            socket.on('resetGame',resetGame);
            guessBox = $('#guess input');
            guessBox.on('keydown', onKeyDown);
        
        });
        socket.on('disconnectReset',disconnectReset);
    
      
}

