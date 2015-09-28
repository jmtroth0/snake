(function(){
  window.SnakeGame = window.SnakeGame || {};

  var Snake = window.SnakeGame.Snake = function(){
    this.dir = "E";
    this.segments = [new Coord([4,4])];
    this.isGrowing = false;
  };

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
  }

  Snake.prototype.turn = function (dir) {
    this.dir = dir;
  };

  Snake.prototype._moveTail = function (changedPoses) {
    if (!this.isGrowing){
      changedPoses.push(this.segments.pop());
    }
  };

  Snake.prototype.segmentsIncludes = function (pos) {
    for (var i = 0; i < this.segments.length; i++) {
      if (this.segments[i].equals(pos)){
        return true;
      };
    };
    return false;
  };

  var Board = window.SnakeGame.Board = function(){
    this.snake = new Snake();
    this.grid = [];
    this.apple = randomCoord();
    this.setupBoard();
    this.turns = 0;
    this.over = false;
  };

  Board.GRIDSIZE = 20;

  Board.prototype.setupBoard = function () {
    for (var i = 0; i < Board.GRIDSIZE; i++) {
      var row = [];
      for (var j = 0; j < Board.GRIDSIZE; j++) {
        row.push("null");
      };
      this.grid.push(row);
    };
  };

  Board.prototype.generateApple = function () {
    this.apple = randomCoord();
    while (this.snake.segmentsIncludes(this.apple.pos)){
      var newApple = randomCoord();
      this.apple = newApple
    };
  };

  Board.prototype.isLost = function (){
    return this.snake.segments[0].outOfBounds() || this.ranIntoSelf();
  };

  Board.prototype.ranIntoSelf = function () {
    for (var i = 0; i < this.snake.segments.length - 1; i++) {
      for (var j = i + 1; j < this.snake.segments.length; j++) {
        if (i !== j && this.snake.segments[i].equals(this.snake.segments[j].pos)){
          return true;
        }
      }
    }
    return false;
  };

  Board.prototype.step = function(){
    var changedPoses = [];
    this.snake.move(changedPoses);
    this.turns++;
    if (this.snake.segments[0].equals(this.apple.pos)){
      this.generateApple();
      changedPoses = changedPoses.concat(this.apple);
      this.snake.isGrowing = true;
      this.finishGrowing = this.turns + 2;
    };
    if (this.finishGrowing === this.turns){
      this.snake.isGrowing = false;
    };
    return changedPoses;
  }

  // Board.prototype.renderASCII = function () {
  //   var view = "";
  //   for (var i = 0; i < Board.GRIDSIZE; i++) {
  //     var row = "";
  //     for (var j = 0; j < Board.GRIDSIZE; j++) {
  //       if (this.snake.segmentsIncludes([i,j])){
  //         row += "S";
  //       } else if (this.apple.equals([i,j])) {
  //         row += "A";
  //       } else {
  //         row += ".";
  //       };
  //     };
  //     view += row + "\n"
  //     console.log(row);
  //   };
  //   return view;
  // };

  Board.prototype.render = function () {
    return this;
  }

  var Coord = window.SnakeGame.Coord = function(pos){
    this.pos = pos;
  }

  Coord.prototype.plus = function(offset){
    return new Coord([this.pos[0] + offset[0], this.pos[1] + offset[1]]);
  }

  Coord.prototype.equals = function(otherPos){
    return (this.pos[0] === otherPos[0] && this.pos[1] === otherPos[1]);
  }

  Coord.prototype.outOfBounds = function(){
    return (this.pos[0] >= Board.GRIDSIZE ||
            this.pos[0] < 0 ||
            this.pos[1] >= Board.GRIDSIZE ||
            this.pos[1] < 0 );
  }

  var randomCoord = function(){
    var x = Math.floor(Math.random() * Board.GRIDSIZE);
    var y = Math.floor(Math.random() * Board.GRIDSIZE);
    return new Coord([x,y]);
  }


})();
