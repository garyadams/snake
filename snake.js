var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var sound_eat = new Audio("eat.wav");
var sound_explode = new Audio("explode.wav");
var sound_move = new Audio("move.wav");

canvas.width = 800;
canvas.height = 600;

game = {

	score: null,
	hiscore: 0,
	over: null,
	fps: null,
	startTime: null,

	init: function() {
		game.score = 0;
		game.over = false;
		game.fps = 8;
		game.startTime = Date.now();
		game.scoreCalculated = Date.now();

		snake.init();
		food.init();
	},

	draw: function() {

		if (Date.now() - game.scoreCalculated > 1) {
			game.score += 100;
			game.scoreCalculated = Date.now();
		}

		if (game.score > game.hiscore) {
			game.hiscore = game.score;
		}

		if (game.fps < 20) {
			if (game.score > (500*game.fps)*game.fps) {
				game.fps++;	
			}
		}

		ctx.fillStyle = "#fff";
		ctx.font = "bold 20px courier new";
		ctx.textAlign = "center";
		ctx.fillText("SCORE: " + addCommas(game.score), (canvas.width/2)-270, 36);
		ctx.fillText("TIME: " + ((Date.now() - game.startTime)/1000).toFixed(1), (canvas.width/2), 36);
		ctx.fillText("HI-SCORE: " + addCommas(game.hiscore), (canvas.width/2)+250, 36);

		ctx.fillText("FPS: " + game.fps, (canvas.width/2), 66);

	}

};

snake = {
	
	size: null,
	x: null,
	y: null,
	body: [],
	direction: null,
	lastDirection: null,

	init: function() {
		snake.size = 20;
		snake.x = 500;
		snake.y = 200;  
		snake.body = [];
		snake.direction = "left";
		snake.lastDirection = "left";

		for (var i = snake.x + (1*snake.size); i >= snake.x; i-=snake.size) {
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

	    //Used to make sure we can't double back on ourselves.
	    snake.lastDirection = snake.direction;

		snake.body.push(snake.x + ',' + snake.y); 
		snake.body.shift();
		//sound_move.play();
	},

	draw: function() {
		for (var i = 0; i < snake.body.length; i++) {

			var bodyPart = snake.body[i].split(",");

			//ctx.fillStyle="#fff";
			//ctx.font = "10px courier new";
			//ctx.textAlign = "left";
			//ctx.fillText(snake.body[i], 20, 30+(10*i));

			if (bodyPart[0] == snake.x && bodyPart[1] == snake.y) {
				ctx.fillStyle="#990000";
			} else {
				ctx.fillStyle="#660000";
			}

			ctx.fillRect(parseInt(bodyPart[0])+1, parseInt(bodyPart[1])+1, snake.size-2, snake.size-2);

		}
	},

	detectCollisions: function () {
		var i;

		//Map edges.
		if (snake.x < 0 || (snake.x + snake.size) > canvas.width || snake.y < 0 || (snake.y + snake.size) > canvas.height) {
			game.over = true;
			sound_explode.play();
		}
		//Body parts.
		for (i = 0; i < snake.body.length-1; i++) {
			if (snake.x + "," + snake.y === snake.body[i]) {
				game.over = true;
				sound_explode.play();
			}
		}
		//Food.
		for (i = 0; i < snake.body.length; i++) {
			for (var j = 0; j < food.locations.length; j++) {
				if (snake.body[i] === food.locations[j]) {
					snake.grow();
					food.locations.splice(j, 1);

					//Play sound.
					sound_eat.play();
				} 
			}
		}
	},

	grow: function() {
		snake.body.push(snake.x + "," + snake.y);
		game.score += 1000;
	}

};

food = {

	size: null,
	locations: [],

	init: function() {
		food.size = 20;
		food.locations = [];
	},

	spawn: function() {
		if (Math.random() * food.locations.length < 1) {
			var randomX = Math.round((Math.random()*(canvas.width-0)+0)/20)*20;
			var randomY = Math.round((Math.random()*(canvas.height-0)+0)/20)*20;
		
			food.locations.push(randomX + "," + randomY);
		}
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

	if (!game.over) {

		ctx.clearRect(0,0,canvas.width,canvas.height);
		drawGridLines();

		snake.move();
		snake.detectCollisions();
		food.spawn();
		food.draw();
		snake.draw();
		game.draw();

	} else {

		ctx.font = "bold 68px courier new";
		ctx.textAlign = "center";
		ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);

		ctx.font = "20px courier new";
		ctx.fillText("HIT SPACEBAR TO RESTART", canvas.width/2, (canvas.height/2)+56);

	}

	setTimeout(function() {
		requestAnimationFrame(loop);
	}, 1000 / game.fps);
	

}

var requestAnimationFrame =  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

game.init();
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

	if (["up", "down", "left", "right"].indexOf(lastKey) >= 0 && lastKey != inverseDirection[snake.lastDirection]) {
		snake.direction = lastKey;
	}

	if(e.keyCode === 32) {
		if (game.over) {
			game.init();
			snake.init();
		}
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

function addCommas(nStr)
{
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}