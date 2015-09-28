(function(){
  window.SnakeGame = window.SnakeGame || {};

  var Board = window.SnakeGame.Board = function(){
    this.snake = new window.SnakeGame.Snake();
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

  var randomCoord = function(){
    var x = Math.floor(Math.random() * Board.GRIDSIZE);
    var y = Math.floor(Math.random() * Board.GRIDSIZE);
    return new window.SnakeGame.Coord([x,y]);
  }

})();
