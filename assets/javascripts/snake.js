(function(){
  window.SnakeGame = window.SnakeGame || {};

  var Snake = window.SnakeGame.Snake = function(){
    this.dir = "E";
    this.segments = [new window.SnakeGame.Coord([4,4]),
                     new window.SnakeGame.Coord([4,3]),
                     new window.SnakeGame.Coord([4,2])];
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
})();
