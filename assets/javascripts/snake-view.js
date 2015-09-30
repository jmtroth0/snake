(function(){
  window.SnakeGame = window.SnakeGame || {};

  var View = window.SnakeGame.View = function(el, challenge){
    this.challenge = parseInt(challenge) || 5
    this.challenge = (100 - this.challenge * 10);
    this.$rootEl = el;
    this.scoreBoard1 = new window.SnakeGame.ScoreView(this.$rootEl.find('div.score-board1'));
    this.scoreBoard2 = new window.SnakeGame.ScoreView(this.$rootEl.find('div.score-board2'));
    this.setupGame();
    this.refreshTimeoutId = setTimeout(this.step.bind(this), this.challenge);
  };

  View.prototype.setupGame = function () {
    this.pause = false
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
        if (this.board.snake1.segmentsIncludes([i,j])){
          this.$grid.append("<li class='snake-segment1 group'>");
        } else if (this.board.snake2.segmentsIncludes([i,j])){
          this.$grid.append("<li class='snake-segment2 group'>");
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
      var x = this.changedPoses[i].pos[0];
      var y = this.changedPoses[i].pos[1];
      var location = this.$grid.find('li').eq(x * this.board.grid.length + y)
      if (this.board.snake1.segmentsIncludes(this.changedPoses[i].pos)){
        this.renderSnakePos(this.board.snake1, location, 'snake-segment1');
      } else if (this.board.snake2.segmentsIncludes(this.changedPoses[i].pos)){
        this.renderSnakePos(this.board.snake2, location, 'snake-segment2');
      } else if (this.board.apple.equals(this.changedPoses[i].pos)){
        this.renderApplePos(location)
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
    location.removeClass('snake-segment1');
    location.removeClass('snake-segment2');
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
        // this.registerScores();
        this.changedPoses = this.board.step();
      }
    }
  };

  View.prototype.registerScores = function () {
    if (this.board.snake1.scoreChange){
      this.scoreBoard1.incrementScore(10 - this.challenge / 10);
      this.board.snake1.scoreChange = false
    }
    if (this.board.snake2.scoreChange){
      this.scoreBoard2.incrementScore(10 - this.challenge / 10);
      this.board.snake2.scoreChange = false
    }
  };

  View.prototype.gameOverProtocol = function () {
    this.board.over = true;
    if (this.board.snake1.lost) { this.scoreBoard2.incrementScore(10 - this.challenge / 10)}
    if (this.board.snake2.lost) { this.scoreBoard1.incrementScore(10 - this.challenge / 10)}
    var $gameOver = $('<div class="game-over">');
    this.$rootEl.append($gameOver);
    $gameOver.html("<h1>Game Over!</h1>");
    $gameOver.append("<p>" + this.board.gameOverText + "</p>");
    $gameOver.append("<button id='new-game'>Play Again?</button>");
    $gameOver.append("<button id='adjust-difficulty'>Adjust Difficulty?</button>");
    this.bindRestartEvents();
  };

  View.prototype.bindRestartEvents = function () {
    this.$rootEl.on('click', 'button#new-game', this.playAgain.bind(this));
    this.$rootEl.on('click', 'button#adjust-difficulty', this.toggleChallengeModal.bind(this));
    this.$rootEl.on('click', 'button#cancel-challenge-adjust', this.toggleChallengeModal.bind(this));
    this.$rootEl.on('click', 'button#submit-challenge', this.submitChallenge.bind(this));
  };

  View.prototype.toggleChallengeModal = function () {
    this.$rootEl.find('.challenge-modal').toggleClass('active');
  };

  View.prototype.submitChallenge = function (e) {
    e.preventDefault();
    this.toggleChallengeModal();
    this.challenge = this.$rootEl.find('input#challenge').val()
    this.challenge = (100 - this.challenge * 10);
    this.playAgain();
  };

  View.prototype.togglePause = function () {
    if (this.pause) {
      this.refreshTimeoutId = setTimeout(this.step.bind(this), this.challenge);
    } else {
      clearTimeout(this.refreshTimeoutId);
    }
    this.pause = !this.pause
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
  };

  View.prototype.handleKeyEvent = function (e) {
    e.preventDefault();
    switch (e.keyCode) {
    case 37:
      if (this.board.snake1.dir === "E") { return }
      this.board.snake1.turn("W");
      break;
    case 38:
      if (this.board.snake1.dir === "S") { return }
      this.board.snake1.turn("N");
      break;
    case 39:
      if (this.board.snake1.dir === "W") { return }
      this.board.snake1.turn("E");
      break;
    case 40:
      if (this.board.snake1.dir === "N") { return }
      this.board.snake1.turn("S");
      break;
    case 80:
      this.togglePause();
      break;
    case 87:
      if (this.board.snake2.dir === "S") { return }
      this.board.snake2.turn("N");
      break;
    case 65:
      if (this.board.snake2.dir === "E") { return }
      this.board.snake2.turn("W");
      break;
    case 68:
      if (this.board.snake2.dir === "W") { return }
      this.board.snake2.turn("E");
      break;
    case 83:
      if (this.board.snake2.dir === "N") { return }
      this.board.snake2.turn("S");
      break;
    case 32:
      this.gameOverProtocol();
      this.playAgain();
      break;
    default:
      break;
    }
  };

})();
