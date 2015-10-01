(function(){
  window.SnakeGame = window.SnakeGame || {};

  // just requires numSnakes for now
  var Board = window.SnakeGame.Board = function(options){
    this.snakes = []
    for (var i = 0; i < options.numSnakes; i++) {     // for now max 2
      this.snakes.push(new window.SnakeGame.Snake(i));
    }
    this.grid = [];
    this.apples = [randomCoord(), randomCoord()];
    this.setupBoard();
    this.turns = 0;
    this.over = false;
  };

  Board.GRIDSIZE = 50;

  Board.prototype.setupBoard = function () {
    for (var i = 0; i < Board.GRIDSIZE; i++) {
      var row = [];
      for (var j = 0; j < Board.GRIDSIZE; j++) {
        row.push("null");
      };
      this.grid.push(row);
    };
  };

  // loss handlers
  Board.prototype.gameOver = function () {
    if (this.snakes.some(this.isLost, this) ||
        this.ranIntoOther()) {
      return true;
    } else {
    return false;
    }
  };

  Board.prototype.isLost = function (snake){
    if (snake.outOfBounds()) {
      this.gameOverText = snake.color + " hit the wall";
      snake.lost = true;
      return true;
    } else if (snake.ranIntoSelf()) {
      this.gameOverText = snake.color + " ran into self"
      snake.lost = true;
      return true;
    } else {
      return false;
    }
  };

  Board.prototype.ranIntoOther = function () {
    var snakeResults = [];
    this.gameOverText = this.gameOverText || "";
    for (var i = 0; i < this.snakes.length; i++) {
      snakeResults.push(this.snakes[i].checkRanIntoOther({
        snakeIdx: i,
        otherSnakes: this.snakes
      }));
    };
    var numLosses = 0;
    snakeResults.forEach(function (result) {
      if (!!result) { numLosses++ };
    });
    if (numLosses > 1) {
      this.gameOverText = "Draw";
      return true;
    } else if (numLosses === 1) {
      snakeResults.forEach(function(result, snakeIdx){
        if (result) {
          this.snakes[snakeIdx].lost = true;
          this.gameOverText = result;
        }
      }.bind(this))
      return true;
    } else {
      return false;
    }
  };

  Board.prototype.step = function(){
    var changedPoses = [];
    var self = this;
    this.snakes.forEach(function (snake){
      changedPoses = changedPoses.concat(self.stepSnake(snake))
    })
    this.turns++;
    return changedPoses;
  };

  Board.prototype.stepSnake = function(snake){
    var changedPoses = [];
    snake.move(changedPoses);
    for (var i = 0; i < this.apples.length; i++) {
      if (snake.segmentsIncludes(this.apples[i].pos)) {
        snake.scoreChange = true;
        changedPoses = changedPoses.concat(this.replaceApple(i));
        snake.isGrowing = true;
        snake.finishGrowing = this.turns + 5;
      };
    };
    if (snake.finishGrowing === this.turns){
      snake.isGrowing = false;
    };
    return changedPoses;
  };

  // Apple handlers
  Board.prototype.generateApple = function () {
    this.apples.push(randomCoord());
    while (this.snakes.some(function (snake) {
      return snake.segmentsIncludes(this.apples[this.apples.length - 1].pos)
    }.bind(this))){
      var newApple = randomCoord();
      this.apples[this.apples.length - 1] = newApple;
    };
  };

  Board.prototype.replaceApple = function (appleIdx) {
    var changedPoses = []
    changedPoses.push(this.apples[appleIdx]);
    this.apples.splice(appleIdx, 1);
    this.generateApple();
    changedPoses.push(this.apples[this.apples.length - 1]);
    return changedPoses;
  };

  Board.prototype.render = function () {
    return this;
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

  // util

  var randomCoord = function(){
    var x = Math.floor(Math.random() * Board.GRIDSIZE);
    var y = Math.floor(Math.random() * Board.GRIDSIZE);
    return new window.SnakeGame.Coord([x,y]);
  }

})();
