(function () {
  window.SnakeGame = window.SnakeGame || {};

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
    return (this.pos[0] >= window.SnakeGame.Board.GRIDSIZE - 1  ||
            this.pos[0] <= 0 ||
            this.pos[1] >= window.SnakeGame.Board.GRIDSIZE - 1||
            this.pos[1] <= 0 );
  }

})();
