(function(){
  window.SnakeGame = window.SnakeGame || {};

  var View = window.SnakeGame.View = function(el, challenge){
    this.challenge = parseInt(challenge) || 7
    this.challenge = (1000 - this.challenge * 100) / 2;
    this.$rootEl = el;
    this.scoreBoard = new window.SnakeGame.ScoreView(this.$rootEl.find('div.score-board'));
    this.setupGame();
    this.refreshTimeoutId = setTimeout(this.step.bind(this), this.challenge);
  }

  View.prototype.setupGame = function () {
    this.board = new window.SnakeGame.Board();
    this.$rootEl.find('div.game-board').html(this.render().$grid);
    this.bindEvents();
    this.changedPoses = [];
  };

  View.prototype.bindEvents = function () {
    $(document).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.prototype.render = function () {
    this.$grid = $("<ul class='grid'>");

    for (var i = 0; i < this.board.grid.length; i++) {
      for (var j = 0; j < this.board.grid[0].length; j++) {
        if (this.board.snake.segmentsIncludes([i,j])){
          this.$grid.append("<li class='snake-segment group'>");
        } else if (this.board.apple.equals([i,j])) {
          this.$grid.append("<li class='snake-apple group'>");
        } else {
          this.$grid.append("<li class='snake-empty group'>");
        }
      }
    }
    return this;
  }

  View.prototype.renderChangedPoses = function () {
    for (var i = 0; i < this.changedPoses.length; i++) {
      var x = this.changedPoses[i].pos[0]
      var y = this.changedPoses[i].pos[1]
      var location = this.$grid.find('li').eq(x * this.board.grid.length + y)
      if (this.board.snake.segmentsIncludes(this.changedPoses[i].pos)){
        location.addClass('snake-segment');
        location.removeClass('snake-apple');
        location.removeClass('snake-empty');
      } else if (this.board.apple.equals(this.changedPoses[i].pos)){
        this.scoreBoard.incrementScore(10 - this.challenge / 50);
        location.addClass('snake-apple');
        location.removeClass('snake-empty');
      } else {
        location.removeClass('snake-segment');
        location.removeClass('snake-apple');
        location.addClass('snake-empty');
      }
    }
    return this;
  }


  View.prototype.step = function () {
    this.refreshTimeoutId = setTimeout(this.step.bind(this), this.challenge);
    if (!this.board.over) {
      if (this.board.isLost()){
        this.gameOver();
        return;
      } else {
        this.renderChangedPoses();
        this.changedPoses = this.board.step();
      }
    }
  };

  View.prototype.gameOver = function () {
    this.board.over = true;
    var $gameOver = $('<div class="game-over">')
    this.$rootEl.append($gameOver);
    $gameOver.html("<h1>Game Over!</h1>");
    $gameOver.append("<button id='new-game'>Play Again?</button>");
    $gameOver.append("<button id='adjust-difficulty'>Adjust Difficulty?</button>");
    this.bindRestartEvents();
  };

  View.prototype.bindRestartEvents = function () {
    debugger
    this.$rootEl.on('click', 'button#new-game', this.playAgain.bind(this));
    this.$rootEl.on('click', 'button#adjust-difficulty', this.toggleChallengeModal.bind(this));
    this.$rootEl.on('click', 'button#cancel-challenge-adjust', this.toggleChallengeModal.bind(this));
    this.$rootEl.on('click', 'button#submit-challenge', this.submitChallenge.bind(this));
  };

  View.prototype.toggleChallengeModal = function () {
    debugger;
    this.$rootEl.find('.challenge-modal').toggleClass('active');
  };

  View.prototype.submitChallenge = function (e) {
    e.preventDefault();
    this.toggleChallengeModal();
    this.challenge = this.$rootEl.find('input#challenge').val()
    this.challenge = (1000 - this.challenge * 100) / 2;
    this.playAgain();
  };

  View.prototype.playAgain = function () {
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
    this.scoreBoard.restart();
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
