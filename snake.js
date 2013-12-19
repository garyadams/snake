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

			var bodyPart = snake.body[j].split(",");

			ctx.fillStyle="#fff";

			ctx.fillText(snake.body[j], 10, 20+(10*j));

			if (bodyPart[0] == snake.x && bodyPart[1] == snake.y) {
				ctx.fillStyle="#990000";
			} else {
				ctx.fillStyle="#660000";
			}

			ctx.fillRect(parseInt(bodyPart[0])+1, parseInt(bodyPart[1])+1, snake.size-2, snake.size-2);

		}
	}

};

food = {

	size: 20,
	locations: [],
  
  spawn: function() {
  	food.locations.push('400,400');
	},

	draw: function() {
		for (var i = 0; i < food.locations.length; i++) {
			var foodPart = food.locations[i].split(",");

			ctx.fillStyle="#009900";
			ctx.fillRect(parseInt(foodPart[0])+1, parseInt(foodPart[1])+1, food.size-2, food.size-2);
		}
	}

};

function loop() {

	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawGridLines();

	snake.move();
	food.draw();
	snake.draw();

	setTimeout(function() {
  	requestAnimationFrame(loop);
  }, 1000 / 8);

}

var requestAnimationFrame =  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

food.spawn();
snake.init();
requestAnimationFrame(loop);















//Controls and user input.

inverseDirection = {
  'up':'down',
  'left':'right',
  'right':'left',
  'down':'up'
};

addEventListener("keydown", function (e) {
    
	var lastKey;

  if(e.keyCode === 38) {
		lastKey = "up"
	}

	if(e.keyCode === 40) {
		lastKey = "down"
	}

	if(e.keyCode === 37) {
		lastKey = "left"
	}

	if(e.keyCode === 39) {
		lastKey = "right"
	}

  if (["up", "down", "left", "right"].indexOf(lastKey) >= 0 && lastKey != inverseDirection[snake.direction]) {
    snake.direction = lastKey;
  }

}, false);











function drawGridLines() 
{

	var gridPixelSize = 20;
	ctx.lineWidth = 0.3;
	ctx.strokeStyle = "#999";

	//Horizontal grid lines.
	for(var i = 0; i <= canvas.height - 0; i = i + gridPixelSize)
	{
		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(canvas.width, i);
		ctx.closePath();
		ctx.stroke();
	}
	
	//Vertical grid lines.
	for(var j = 0; j <= canvas.width -0; j = j + gridPixelSize)
	{
		ctx.beginPath();
		ctx.moveTo(j, 0);
		ctx.lineTo(j, canvas.height);
		ctx.closePath();
		ctx.stroke();
	}

}