(function(){
  window.SnakeGame = window.SnakeGame || {};

  var Snake = window.SnakeGame.Snake = function(){
    this.dir = "E";
    this.segments = [new Coord([4,4])];
  }

  Snake.prototype.move = function () {
    this._moveTail();
    switch(this.dir){
    case "E":
      this.segments[0].plus([0, 1]);
      break;
    case "W":
      this.segments[0].plus([0, -1]);
      break;
    case "N":
      this.segments[0].plus([-1, 0]);
      break;
    case "S":
      this.segments[0].plus([1, 0]);
      break;
    default:
      break;
    };
  };

  Snake.prototype.turn = function (dir) {
    this.dir = dir;
  };

  Snake.prototype._moveTail = function () {
    for (var i = this.segments.length; i > 1; i--) {
      this.segments[i] = this.segments[i-1]
    }
  };

  Snake.prototype.segmentsIncludes = function (pos) {
    for (var i = 0; i < this.segments.length; i++) {
      if (this.segments[i].equals(pos)){
        return true;
      }
    }
    return false;
  };

  var Board = window.SnakeGame.Board = function(){
    this.snake = new Snake();
    this.grid = [];
    // this.apples = [];
    this.setupBoard();
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

  Board.prototype.isLost = function (){
    return this.snake.segments[0].outOfBounds();
  }

  Board.prototype.render = function () {
    var view = "";
    for (var i = 0; i < Board.GRIDSIZE; i++) {
      var row = "";
      for (var j = 0; j < Board.GRIDSIZE; j++) {
        if (this.snake.segmentsIncludes([i,j])){
          row += "S";
        } else {
          row += ".";
        };
      };
      view += row + "\n"
      console.log(row);
    };
    return view;
  };

  var Coord = window.SnakeGame.Coord = function(pos){
    this.pos = pos;
  }

  Coord.prototype.plus = function(offset){
    this.pos[0] += offset[0];
    this.pos[1] += offset[1];
  }

  Coord.prototype.equals = function(otherPos){
    return (this.pos[0] === otherPos[0] && this.pos[1] === otherPos[1]);
  }

  Coord.prototype.outOfBounds = function(){
    return (this.pos[0] > Board.GRIDSIZE ||
            this.pos[0] < 0 ||
            this.pos[1] > Board.GRIDSIZE ||
            this.pos[1] < 0 );
  }


})();
