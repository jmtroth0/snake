(function(){
  window.SnakeGame = window.SnakeGame || {};

  var Snake = window.SnakeGame.Snake = function(snakeNum, board){
    this.dir = Snake.snakeInfo[snakeNum].dir;
    this.segments = [];
    for (var i = 0; i < Snake.snakeInfo[snakeNum].startingPoses.length; i++) {
      var segment = new window.SnakeGame.Coord(Snake.snakeInfo[snakeNum].startingPoses[i]);
      this.segments.push(segment);
    }
    this.color = Snake.snakeInfo[snakeNum].color;
    this.growTurns = 3;
    this.board = board;
  };

  // possible snakes
  // Need direction, starting position (recommended another corner and color)
  Snake.snakeInfo = {
    1: {
      dir: "E",
      startingPoses: [[4,4]],
      color: "red"
    },
    2: {
      dir: "W",
      startingPoses: [[26,26]],
      color: "blue",
    },
    3: {
      dir: "S",
      startingPoses: [[26, 4]],
      color: "purple"
    }
  };

  Snake.moveDirs = {
    "N": [-1,  0],
    "W": [ 0, -1],
    "S": [ 1,  0],
    "E": [ 0,  1],
  };

  // movement
  Snake.prototype.move = function () {
    if (this.getMove) {
      this.getMove();
    }
    var move = this.testMove(this.dir);
    this.segments.unshift(move);
    this.turning = false;
    this._moveTail();
    this.eatApple();
  };

  Snake.prototype.testMove = function(dir, options) {
    var head = (options && options.head) || this.head();
    var testMove = head.plus(Snake.moveDirs[dir]);

    return testMove;
  };

  Snake.prototype.turn = function (dir) {
    if (this.turning) { return; }
    if (this.oppDir(this.dir, dir))
      { return; }
    this.dir = dir;
    this.turning = true;
  };

  Snake.prototype._moveTail = function () {
    if (this.growTurns > 0) {
      this.growTurns--;
    } else {
      this.segments.pop();
    }
  };

  Snake.prototype.eatApple = function () {
    this.board.apples.forEach(function(apple, idx){
      if (this.head().equals(apple.pos)){
        this.growTurns += 3;
        this.scoreChange = true;
        this.board.replaceApple(idx);
        return true;
      }
    }.bind(this));

    return false;
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
      if (snakeNum === options.snakeIdx) { continue; }
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

  Snake.prototype.segmentsIncludes = function (pos, segments) {
    segments = segments || this.segments;
    for (var i = 0; i < segments.length; i++) {
      if (segments[i].equals(pos)){
        return true;
      }
    }
    return false;
  };

  Snake.prototype.head = function () {
    return this.segments[0];
  };

  Snake.prototype.length = function () {
    return this.segments.length;
  };

  Snake.prototype.oppDir = function (currentDir, otherDir) {
    return ((currentDir == "N" && otherDir == "S") ||
            (currentDir == "S" && otherDir == "N") ||
            (currentDir == "E" && otherDir == "W") ||
            (currentDir == "W" && otherDir == "E"));
  };
})();
