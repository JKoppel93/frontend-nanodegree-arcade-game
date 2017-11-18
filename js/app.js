var TILE_WIDTH = 101,
    TILE_HEIGHT = 83;

// ENEMY OBJECTS AND METHODS

var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.initialize();
  this.height = 101; // height of the enemy sprite for hit detection
  this.width = 70; // width of the enemy sprite for hit detection

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = "images/enemy-bug.png";
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = (this.x + this.speed); // x coordinate multiplied by speed
  this.y = this.row * 83; // y coordinate

  if (this.x > 6 * 83) { // if enemy goes off-screen
    this.initialize();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.initialize = function() {
  this.col = -1; // enemy gets rendered off-screen
  this.row = getRandomInt(1, 3); // spawn enemy in random row 1-3
  this.x = this.col * 83; // x coordinate
  this.y = this.row * 101; // y coordinate
  this.speed = getRandomInt(2, 5); // random speed multiplier between 2-5
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// PLAYER OBJECTS AND METHODS

var Player = function() {
  this.initialize();
  this.sprite = "images/char-boy.png";
  this.win = 0; // player win count
  this.lose = 0; // player loss count
};

Player.prototype.checkCollisions  = function() {
  for (i = 0; i < allEnemies.length; i++) {
    if ((this.x > allEnemies[i].x - 50 && this.x < allEnemies[i].x - 50 + allEnemies[i].width) &&
        (this.y > allEnemies[i].y - 50 && this.y < allEnemies[i].height + allEnemies[i].y - 50)) { // if enemy collides with player; 50 is used for bigger hitbox
        this.canMove = false;
    }
  }
};

Player.prototype.checkResults = function() {
  ctx.font = "bold 36px Courier New";
  ctx.textAlign = "center";
  ctx.fillText("Wins: " + this.win, 100, 750);
  ctx.fillText("Losses: " + this.lose,400,750);
}.bind(this);



Player.prototype.update = function(dt) {
  if (this.canMove) {
    this.x = this.col * TILE_WIDTH; // x coordinate
    this.y = this.row * TILE_HEIGHT; // y coordinate
    this.checkCollisions(); // check for collisions with player
    this.checkResults(); // check and display win/loss
  }

  if (this.y < 83) { // if player gets to water
    this.canMove = false; // game is over
  }

  // Overlay text

  if (this.canMove === false && this.y >= 83) { // if player loses
    ctx.font = "108px Impact";
    ctx.fillStyle = "red";
    ctx.lineWidth = 3;
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", 250, 700);
    ctx.strokeText("GAME OVER", 250, 700);

    ctx.font = "bold 36px Courier New";
    ctx.fillStyle = "black";
    ctx.fillText("Press Enter to restart", 250, 35);

    this.result = false; // result is game over
  } else if (this.canMove === false && this.y < 83) { // if player wins
    ctx.font = "108px Impact";
    ctx.fillStyle = "green";
    ctx.lineWidth = 3;
    ctx.textAlign = "center";
    ctx.fillText("VICTORY", 250, 700);
    ctx.strokeText("VICTORY", 250, 700);

    ctx.font = "bold 36px Courier New";
    ctx.fillStyle = "black";
    ctx.fillText("Press Enter to restart", 250, 35);

    this.result = true; // result is victory
  }

  if (this.canMove === false && this.end === true) { // will run when enter key is pressed
    this.initialize();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear any overlay text
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.initialize = function() {

  if (this.end === true) { // if the enter key has been pressed upon end of game
    if (this.result === true)
      this.win++; // wins++
    else if (this.result === false)
      this.lose++; // losses++
  }
  this.col = 2;
  this.row = 5;
  this.canMove = true; // can move again upon reinitialization
  this.end = false; // can play again upon reinitialization
};

Player.prototype.handleInput = function(move) {
  switch (move) {
    case "left":
      this.col--;
      break;
    case "up":
      this.row--;
      break;
    case "right":
      this.col++;
      break;
    case "down":
      this.row++;
      break;
    case "enter":
      if (this.canMove === false) // will run only if the player can't move, ergo the game has ended
        this.end = true;
      break;
  }
  switch (true) {
    case (this.col < 0): // handles
      this.col = 0;
      break;
    case (this.col > 4): // out of
      this.col = 4;
      break;
    case (this.row < 0): // bounds
      this.row = 0;
      break;
    case (this.row > 5): // restrictions
      this.row = 5;
      break;
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
for (var i = 0; i < 3; i++) {
  allEnemies.push(new Enemy());
}

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    13: "enter",
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
