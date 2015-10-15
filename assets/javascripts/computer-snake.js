(function(){
  window.SnakeGame = window.SnakeGame || {};

  var ComputerSnake = window.SnakeGame.ComputerSnake = function (snakeNum, board) {
    window.SnakeGame.Snake.call(this, snakeNum, board);
    this.path = [];
  };

  ComputerSnake.prototype = Object.create(window.SnakeGame.Snake.prototype);

  ComputerSnake.prototype.target = function () {
    return this.board.apples[0];
  };

  ComputerSnake.prototype.calculateDirections = function () {
    var firstNode = new MoveNode(this.head(), this.dir, 0, null);
    var firstMove = firstNode.coord.pos[0] * window.SnakeGame.Board.GRIDSIZE + firstNode.coord.pos[1];
    var listOfMoves = {};
    listOfMoves[firstMove] = true;
    var currentMoves = [firstNode];
    while (currentMoves.length !== 0) {
      var currentCheck = currentMoves.shift();
      for (var dir in window.SnakeGame.Snake.moveDirs) {
        var test = this.testMove(dir, {head: currentCheck.coord});
        if (listOfMoves[test.pos[0] * window.SnakeGame.Board.GRIDSIZE + test.pos[1]] ||
          (currentCheck.dir && this.oppDir(currentCheck.dir, dir))
        ) { continue; }
        if ((!this.wouldRunIntoSelf(test, currentCheck.steps + 1) &&
              /* this.checkRanIntoOther({
                otherSnakes: this.board.snakes,
                snakeIdx: 0
              }) || */
              !this.wouldBeOutOfBounds (test)) ){
          var newNode = new MoveNode(
            test, dir, currentCheck.steps + 1, currentCheck
          );
          if (test.equals(this.target().pos) || currentCheck.steps === 3){
            this.addToPath(newNode);
            debugger
            return;
          } else {
            currentMoves.push(newNode);
          }
        }
      }
    }
  };

  ComputerSnake.prototype.addToPath = function (node) {
    this.path.unshift(node.dir);
    if (node.prev_move) {
      this.addToPath(node.prev_move);
    }
  };

  ComputerSnake.prototype.validMove = function () {
    return (!(this.wouldRunIntoSelf(test, currentCheck.steps + 1) ||
              this.wouldBeOutOfBounds (test)));
  };

  ComputerSnake.prototype.wouldRunIntoSelf = function (coord, steps) {
    return this.segmentsIncludes(coord.pos);
  };

  ComputerSnake.prototype.wouldBeOutOfBounds = function (coord) {
    return coord.outOfBounds();
  };

  ComputerSnake.prototype.getMove = function () {
    if (this.path.length === 0){
      this.calculateDirections();
    }
    this.turn(this.path.shift());
  };

  // ComputerSnake.prototype.calculateMove = function () {
  //   debugger
  //   var posMoves = [];
  //   for (var dir in window.SnakeGame.Snake.moveDirs) {
  //     var test = this.testMove(dir);
  //     this.segments.unshift(test);
  //     if (!(this.ranIntoSelf() ||
  //           this.checkRanIntoOther({
  //             otherSnakes: this.board.snakes,
  //             snakeIdx: 0
  //           }) ||
  //           this.outOfBounds()) ){
  //       posMoves.push(dir);
  //       if (this.head().equals(this.target().pos)){
  //         this.turn(dir);
  //       }
  //     }
  //     this.segments.shift();
  //   }
  //   this.turn(posMoves[Math.floor(Math.random() * posMoves.length)]);
  // };

  var MoveNode = function (coord, dir, steps, prev_move) {
    this.coord = coord;
    this.dir = dir;
    this.steps = steps;
    this.prev_move = prev_move;
  };
})();
