(function(){
  window.SnakeGame = window.SnakeGame || {};

  var View = window.SnakeGame.View = function(el, challenge){
    this.challenge = parseInt(challenge) || 5
    this.challenge = (100 - this.challenge * 10);
    this.$rootEl = el;
    this.numSnakes = 2;
    this.scoreBoards = [];
    for (var i = 1; i <= this.numSnakes; i++) {
      this.scoreBoards.push(
        new window.SnakeGame.ScoreView(this.$rootEl.find('div.score-board' + i))
      )
    }
    this.setupGame();
    this.pause = true;
  };

  View.prototype.setupGame = function () {
    this.pause = false;
    this.board = new window.SnakeGame.Board({numSnakes: this.numSnakes});
    this.$rootEl.find('div.game-board').html(this.render().$grid);
    this.bindEvents();
    this.changedPoses = [];
  };

  View.prototype.bindEvents = function () {
    $(document).on("keydown", this.handleKeyEvent.bind(this));
  };

  // initial board render
  View.prototype.render = function () {
    this.$grid = $("<ul class='grid'>");

    for (var i = 0; i < this.board.grid.length; i++) {
      for (var j = 0; j < this.board.grid[0].length; j++) {

        var isSnake = false;
        for (var numSnake = 0; numSnake < this.numSnakes; numSnake++) {
          if (this.board.snakes[numSnake].segmentsIncludes([i,j])) {
            this.$grid.append("<li class='snake-segment" + (numSnake + 1) + " group'>");
            isSnake = true;
          }
        }
        if (isSnake) {
          continue;
        } else if (this.board.apples.some(function(apple){
          return apple.equals([i,j])
        })) {
          this.$grid.append("<li class='snake-apple group'>");
        } else {
          this.$grid.append("<li class='snake-empty group'>");
        }
      }
    }
    return this;
  };

  // in game render
  View.prototype.renderChangedPoses = function () {
    for (var i = 0; i < this.changedPoses.length; i++) {
      var x = this.changedPoses[i].pos[0];
      var y = this.changedPoses[i].pos[1];
      var location = this.$grid.find('li').eq(x * this.board.grid.length + y);
      var isSnake = false;
      for (var numSnake = 0; numSnake < this.numSnakes; numSnake++) {
        if (this.board.snakes[numSnake].segmentsIncludes([x,y])) {
          this.renderSnakePos(this.board.snake1, location, 'snake-segment' + (numSnake + 1));
          isSnake = true;
        }
      }
      if (isSnake) {
        continue;
      } else if (this.board.apples.some(function(apple){
        return apple.equals([x,y])
      })) {
        this.renderApplePos(location);
      } else {
        this.removeRenders(location);
      }
    }
    return this;
  };

  View.prototype.renderSnakePos = function (snake, location, cssClass){
    location.addClass(cssClass);
    location.removeClass('snake-apple');
    location.removeClass('snake-empty');
  };

  View.prototype.renderApplePos = function (location){
    location.addClass('snake-apple');
    location.removeClass('snake-empty');
  };

  View.prototype.removeRenders = function (location) {
    for (var i = 0; i < this.board.snakes.length; i++) {
      location.removeClass('snake-segment' + (i + 1));
    }
    location.removeClass('snake-apple');
    location.addClass('snake-empty');
  };

  View.prototype.step = function () {
    this.refreshTimeoutId = setTimeout(this.step.bind(this), this.challenge);
    if (!this.board.over) {
      if (this.board.gameOver()){
        this.gameOverProtocol();
        return;
      } else {
        this.renderChangedPoses();
        this.incrementAppleScores();
        this.changedPoses = this.board.step();
      }
    }
  };

  View.prototype.incrementAppleScores = function () {
    this.board.snakes.forEach(function(snake, idx){
      if (snake.scoreChange) {
        this.scoreBoards[idx].incrementAppleScore(10 - this.challenge / 10);
        snake.scoreChange = false;
      }
    }.bind(this))
  };

  View.prototype.incrementScores = function () {
    for (var i = 0; i < this.board.snakes.length; i++) {
      if (!this.board.snakes[i].lost) {
        this.scoreBoards[i].incrementVsScore(10 - this.challenge / 10)
      };
    };
  };

  // changing level
  View.prototype.toggleChallengeModal = function (e) {
    e.preventDefault();
    this.$rootEl.find('.challenge-modal').toggleClass('active');
  };

  View.prototype.submitChallenge = function (e) {
    e.preventDefault();
    this.toggleChallengeModal(e);
    this.challenge = this.$rootEl.find('input#challenge').val()
    this.challenge = (100 - this.challenge * 10);
    this.playAgain(e);
  };

  // on game over stuff

  View.prototype.bindRestartEvents = function () {
    this.$rootEl.on('click', 'button#new-game', this.playAgain.bind(this));
    this.$rootEl.on('click', 'button#adjust-difficulty', this.toggleChallengeModal.bind(this));
    this.$rootEl.on('click', 'button#cancel-challenge-adjust', this.toggleChallengeModal.bind(this));
    this.$rootEl.on('click', 'button#submit-challenge', this.submitChallenge.bind(this));
  };

  View.prototype.playAgain = function (e) {
    e.preventDefault();
    this.restartGame();
    this.setupGame();
  };

  View.prototype.restartGame = function () {
    this.$rootEl.off();
    this.$rootEl.find('button#new-game').off();
    this.$rootEl.find('button#adjust-difficulty').off();
    this.$rootEl.find('button#cancel-challenge-adjust').off();
    this.$rootEl.find('button#submit-challenge').off();
    this.$rootEl.find('div.game-over').remove();
    this.board.over = false;
    this.board.snakes.forEach(function(snake) { snake.lost = false });
    this.scoreBoards.forEach(function(board){
      board.resetAppleScore();
    })
  };

  View.prototype.gameOverProtocol = function () {
    this.board.over = true;
    this.incrementScores();
    var $gameOver = $('<div class="game-over">');
    this.$rootEl.append($gameOver);
    $gameOver.html("<h1>Game Over!</h1>");
    $gameOver.append("<p>" + this.board.gameOverText + "</p>");
    $gameOver.append("<button id='new-game'>Play Again?</button>");
    $gameOver.append("<button id='adjust-difficulty'>Adjust Difficulty?</button>");
    this.bindRestartEvents();
  };

  // on keypress of 'p'
  View.prototype.togglePause = function () {
    if (this.pause) {
      this.refreshTimeoutId = setTimeout(this.step.bind(this), this.challenge);
    } else {
      clearTimeout(this.refreshTimeoutId);
    }
    this.pause = !this.pause
  };

  View.prototype.handleKeyEvent = function (e) {
    e.preventDefault();
    switch (e.keyCode) {
    case 37:
      if (this.board.snakes[0].dir === "E") { return }
      this.board.snakes[0].turn("W");
      break;
    case 38:
      if (this.board.snakes[0].dir === "S") { return }
      this.board.snakes[0].turn("N");
      break;
    case 39:
      if (this.board.snakes[0].dir === "W") { return }
      this.board.snakes[0].turn("E");
      break;
    case 40:
      if (this.board.snakes[0].dir === "N") { return }
      this.board.snakes[0].turn("S");
      break;
    case 87:
      if (this.board.snakes[1].dir === "S") { return }
      this.board.snakes[1].turn("N");
      break;
    case 65:
      if (this.board.snakes[1].dir === "E") { return }
      this.board.snakes[1].turn("W");
      break;
    case 68:
      if (this.board.snakes[1].dir === "W") { return }
      this.board.snakes[1].turn("E");
      break;
    case 83:
      if (this.board.snakes[1].dir === "N") { return }
      this.board.snakes[1].turn("S");
      break;
    case 32:
      this.playAgain(e);
      break;
    case 80:
      this.togglePause();
      break;
    default:
      break;
    }
  };

})();
