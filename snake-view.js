(function(){
  window.SnakeGame = window.SnakeGame || {};

  var View = window.SnakeGame.View = function(el){
    this.$el = el;
    this.board = new window.SnakeGame.Board();
    this.$el.append(this.board.render());

    this.bindEvents();

    this.refreshIntervalId = setInterval(this.step.bind(this), 500);
  }

  View.prototype.bindEvents = function () {
    $(document).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.prototype.step = function () {
    if (this.board.isLost()){
      this.$el.empty();
      this.$el.append("<h1>Game Over!</h1>")
      clearInterval(this.refreshIntervalId);
      return;
    }

    this.board.snake.move();
    this.$el.empty();
    this.$el.append(this.board.render());
  };

  View.prototype.handleKeyEvent = function (e) {
    switch (e.keyCode) {
    case 37:
      this.board.snake.turn("W");
      break;
    case 38:
      this.board.snake.turn("N");
      break;
    case 39:
      this.board.snake.turn("E");
      break;
    case 40:
      this.board.snake.turn("S");
      break;
    default:
      break;
    }
  };

})();
