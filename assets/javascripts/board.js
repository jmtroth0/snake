(function(){
  window.SnakeGame = window.SnakeGame || {};

  var Board = window.SnakeGame.Board = function(){
    this.snake1 = new window.SnakeGame.Snake([4,4], "E", "red");
    this.snake2 = new window.SnakeGame.Snake([46,4], "E", "blue");
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

  Board.prototype.generateApple = function () {
    this.apples.push(randomCoord());
    while (this.snake1.segmentsIncludes(this.apples[this.apples.length-1].pos),
           this.snake2.segmentsIncludes(this.apples[this.apples.length-1].pos)){
      var newApple = randomCoord();
      this.apples[this.apples.length-1] = newApple;
    };
  };

  Board.prototype.gameOver = function () {
    if (this.isLost(this.snake1) ||
        this.isLost(this.snake2) ||
        this.ranIntoOther(this.snake1, this.snake2) ||
        this.ranIntoOther(this.snake2, this.snake1)){
      return true;
    };
    return false;
  };

  Board.prototype.isLost = function (snake){
    if (snake.segments[0].outOfBounds() || this.ranIntoSelf(snake)) {
      this.gameOverText = this.gameOverText || snake.color + " hit the wall";
      snake.lost = true;
      return true;
    };
    return false;
  };

  Board.prototype.ranIntoSelf = function (snake) {
    for (var i = 0; i < snake.segments.length - 1; i++) {
      for (var j = i + 1; j < snake.segments.length; j++) {
        if (i !== j && snake.segments[i].equals(snake.segments[j].pos)){
          this.gameOverText = snake.color + " ran into self";
          snake.lost = true;
          return true;
        }
      }
    }
    return false;
  };

  Board.prototype.ranIntoOther = function (snake, otherSnake) {
    for (var i = 0; i < otherSnake.segments.length; i++) {
      if (otherSnake.segments[i].equals(snake.segments[0].pos)){
        this.gameOverText = snake.color + " ran into " + otherSnake.color;
        return true;
      }
    }
    return false;
  };

  Board.prototype.step = function(){
    var changedPoses1 = this.stepSnake(this.snake1);
    var changedPoses2 = this.stepSnake(this.snake2);
    this.turns++;
    return changedPoses1.concat(changedPoses2);
  };

  Board.prototype.stepSnake = function(snake){
    var changedPoses = [];
    snake.move(changedPoses);
    for (var i = 0; i < this.apples.length; i++) {
      if (snake.segmentsIncludes(this.apples[i].pos)) {
        snake.scoreChange = true;
        changedPoses = changedPoses.concat(this.apples[i]);
        this.apples.splice(i, 1);
        this.generateApple();
        snake.isGrowing = true;
        snake.finishGrowing = this.turns + 5;
      };
    }
    if (snake.finishGrowing === this.turns){
      snake.isGrowing = false;
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

  var randomCoord = function(){
    var x = Math.floor(Math.random() * Board.GRIDSIZE);
    var y = Math.floor(Math.random() * Board.GRIDSIZE);
    return new window.SnakeGame.Coord([x,y]);
  }

})();
