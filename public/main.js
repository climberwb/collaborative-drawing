var socket = io();
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

$(document).ready(function() {

    pictionaryEvent();
    pictionary();
});