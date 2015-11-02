(function(){
  window.SnakeGame = window.SnakeGame || {};

  var ComputerSnake = window.SnakeGame.ComputerSnake = function (snakeNum, board) {
    window.SnakeGame.Snake.call(this, snakeNum, board);
    this.path = [];
  };

  ComputerSnake.prototype = Object.create(window.SnakeGame.Snake.prototype);

  ComputerSnake.prototype.targets = function () {
    return this.board.apples;
  };

  ComputerSnake.prototype.getMove = function () {
    var move = this.calculateDirection();
    if (move) this.turn(move.dir);
  };

  ComputerSnake.prototype.calculateDirection = function () {
    var moves = this.getValidDirs();
    this.sortMovesByPreference(moves);
    if (moves[0]) return moves[0];
  };

  ComputerSnake.prototype.getValidDirs = function () {
    var validMoves = [];
    for (var dir in window.SnakeGame.Snake.moveDirs) {
      var test = {move: this.testMove(dir), dir: dir};
      if (this.validMove(test)) validMoves.push(test);
    }
    return validMoves;
  };

  ComputerSnake.prototype.sortMovesByPreference = function (moves) {
    var targets = this.targets();
    moves.forEach(function(move){
      possibleScores = [];
      targets.forEach(function(target){
        possibleScores.push(Math.abs(target.pos[0] - move.move.pos[0]) +
                            Math.abs(target.pos[1] - move.move.pos[1]));
      });
      move.score = Math.min.apply({}, possibleScores);
    });
    moves.sort(function(left, right){
      if (left.score <= right.score) return -1;
      if (left.score > right.score) return 1;
    });
  };

  ComputerSnake.prototype.validMove = function (test) {
    return (!test.move.outOfBounds() &&
            !this.segmentsIncludes(test.move.pos) &&
            !this.oppDir(this.dir, test.dir) );
  };
})();
