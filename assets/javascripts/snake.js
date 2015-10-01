(function(){
  window.SnakeGame = window.SnakeGame || {};

  var Snake = window.SnakeGame.Snake = function(snakeNum){
    this.dir = window.SnakeGame.snakeInfo[snakeNum].dir;
    this.segments = [];
    for (var i = 0; i < window.SnakeGame.snakeInfo[snakeNum].startingPoses.length; i++) {
      var segment = new window.SnakeGame.Coord(window.SnakeGame.snakeInfo[snakeNum].startingPoses[i]);
      this.segments.push(segment);
    }
    this.color = window.SnakeGame.snakeInfo[snakeNum].color;
    this.isGrowing = false;
  };

  // possible snakes
  // Need direction, starting position (recommended 3 segments, and color)
  window.SnakeGame.snakeInfo = {
    1: {
      dir: "E",
      startingPoses: [[4,4], [4,3], [4,2]],
      color: "red"
    },
    2: {
      dir: "W",
      startingPoses: [[46,46], [46,47], [46,48]],
      color: "blue",
    }
  };

  // movement
  Snake.prototype.move = function (changedPoses) {
    var move = this.testMove();

    this.segments.unshift(move);
    changedPoses.push(move);
    this._moveTail(changedPoses);
  };

  Snake.prototype.testMove = function() {
    var testMove;
    switch(this.dir){
    case "E":
      testMove = this.segments[0].plus([0, 1])
      break;
    case "W":
      testMove = this.segments[0].plus([0, -1])
      break;
    case "N":
      testMove = this.segments[0].plus([-1, 0])
      break;
    case "S":
      testMove = this.segments[0].plus([1, 0])
      break;
    default:
      break;
    };
    return testMove;
  };

  Snake.prototype.turn = function (dir) {
    this.dir = dir;
  };

  Snake.prototype._moveTail = function (changedPoses) {
    if (!this.isGrowing){
      changedPoses.push(this.segments.pop());
    }
  };

// Lose Conditions
  Snake.prototype.ranIntoSelf = function () {
    for (var i = 0; i < this.segments.length - 1; i++) {
      for (var j = i + 1; j < this.segments.length; j++) {
        if (i !== j && this.segments[i].equals(this.segments[j].pos)){
          return true;
        }
      }
    }
    return false;
  };

    // requires list of all snakes, own idx in that list
  Snake.prototype.checkRanIntoOther = function (options) {
    for (var snakeNum = 0; snakeNum < options.otherSnakes.length; snakeNum++) {
      if (snakeNum === options.snakeIdx) { continue };
      var otherSnake = options.otherSnakes[snakeNum];
      for (var i = 0; i < otherSnake.length(); i++) {
        if (otherSnake.segments[i].equals(this.head().pos)){
          return this.color + " ran into " + otherSnake.color;
        }
      }
    }
    return false;
  };

  // snake utils
  Snake.prototype.outOfBounds = function () {
    return this.head().outOfBounds();
  };

  Snake.prototype.segmentsIncludes = function (pos) {
    for (var i = 0; i < this.segments.length; i++) {
      if (this.segments[i].equals(pos)){
        return true;
      };
    };
    return false;
  };

  Snake.prototype.head = function () {
    return this.segments[0];
  };

  Snake.prototype.length = function () {
    return this.segments.length;
  };
})();
