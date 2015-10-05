(function(){
  window.SnakeGame = window.SnakeGame || {};

  var ComputerSnake = window.SnakeGame.ComputerSnake = function (snakeNum, board) {
    window.SnakeGame.Snake.call(this, snakeNum, board);
  };

  ComputerSnake.prototype = Object.create(window.SnakeGame.Snake.prototype);

  ComputerSnake.prototype.target = function () {
    return this.board.apples[0];
  };

  ComputerSnake.prototype.calculateMove = function () {
    var posMoves = [];
    for (var dir in window.SnakeGame.Snake.moveDirs) {
      var test = this.testMove(dir);
      this.segments.unshift(test);
      if (!(this.ranIntoSelf() ||
            this.checkRanIntoOther({
              otherSnakes: this.board.snakes,
              snakeIdx: 0
            }) ||
            this.outOfBounds()) ){
        posMoves.push(dir);
        if (this.head().equals(this.target().pos)){
          this.turn(dir);
        }
      }
      this.segments.shift();
    }
    this.turn(posMoves[Math.floor(Math.random() * posMoves.length)]);
  };
})();
