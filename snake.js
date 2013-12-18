var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

snake = {
	
	size: null,
	x: null,
	y: null,
	body: [],
	direction: null,

	init: function() {
		snake.size = 20;
		snake.x = 500;
		snake.y = 200;
		snake.body = [];
		snake.direction = "left";

		for (i = snake.x + (10 * snake.size); i >= snake.x; i-=snake.size) {
      		snake.body.push(i + ',' + snake.y);
    	}
	},

	move: function() {
		switch(snake.direction) {
			case "up":
				snake.y-=snake.size;
				break;
			case "down":
				snake.y+=snake.size;
				break;
			case "left":
				snake.x-=snake.size;
				break;
			case "right":
				snake.x+=snake.size;
				break;
	    }

		snake.body.push(snake.x + ',' + snake.y); 
		snake.body.shift();
	},

	draw: function() {
		for (var j = 0; j < snake.body.length; j++) {

			ctx.fillText(snake.body[j], 10, 50+(10*j));

			var bodyPart = snake.body[j].split(",");

			ctx.fillText(parseInt(bodyPart[0])+1, 60, 50+(10*j));

			if (bodyPart[0] == snake.x && bodyPart[1] == snake.y) {
				ctx.fillStyle="#FF0000";
			} else {
				ctx.fillStyle="#000000";
			}

			ctx.fillRect(parseInt(bodyPart[0]), bodyPart[1], snake.size-1, snake.size-1);

		}
	}

};

inverseDirection = {
  'up':'down',
  'left':'right',
  'right':'left',
  'down':'up'
};

keys = {
  up: [38, 75, 87],
  down: [40, 74, 83],
  left: [37, 65, 72],
  right: [39, 68, 76],
  start_game: [13, 32]
};

Object.prototype.getKey = function(value){
  for(var key in this){
    if(this[key] instanceof Array && this[key].indexOf(value) >= 0){
      return key;
    }
  }
  return null;
};

addEventListener("keydown", function (e) {
    lastKey = keys.getKey(e.keyCode);
    if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0
        && lastKey != inverseDirection[snake.direction]) {
      snake.direction = lastKey;
    } else if (['start_game'].indexOf(lastKey) >= 0 && game.over) {
      game.start();
    }
}, false);

function loop() {

	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	snake.move();
	snake.draw();

	setTimeout(function() {
        requestAnimationFrame(loop);
    }, 1000 / 8);

}

var requestAnimationFrame =  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

snake.init();
requestAnimationFrame(loop);