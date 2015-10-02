(function(){
  window.SnakeGame = window.SnakeGame || {};

  var View = window.SnakeGame.View = function(options){
    this.challenge = parseInt(options.challenge) || 5
    this.challenge = (100 - this.challenge * 10);
    this.$rootEl = options.el;
    this.numSnakes = options.numSnakes || 2;
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
    this.board = new window.SnakeGame.Board({numSnakes: this.numSnakes});
    this.renderGrid();
    this.bindEvents();
  };

  View.prototype.bindEvents = function () {
    $(document).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.prototype.renderChangedPoses = function () {
    var self = this;
    this.updateClasses(this.board.apples, 'snake-apple');

    this.board.snakes.forEach(function(snake, idx){
      self.updateClasses(snake.segments, 'snake-segment' + (idx + 1))
    })
  };

  View.prototype.updateClasses = function(coords, className) {
    this.$grid.find('li').filter("." + className).removeClass();

    coords.forEach(function(coord){
      var location = coord.pos[0] * window.SnakeGame.Board.GRIDSIZE + coord.pos[1];
      this.$grid.find('li').eq(location).addClass(className)
    }.bind(this))
  }

  View.prototype.renderGrid = function () {
    this.$grid = $("<ul class='grid'>");

    for (var i = 0; i < this.board.grid.length; i++) {
      for (var j = 0; j < this.board.grid[0].length; j++) {
        this.$grid.append("<li class='group'>");
      }
    }
    this.$rootEl.find('div.game-board').html(this.$grid);
    this.renderChangedPoses();
  };

  View.prototype.step = function () {
    if (!this.board.over) {
      if (this.board.gameOver()){
        this.gameOverProtocol();
      } else {
        this.board.step();
        this.renderChangedPoses();
        this.incrementAppleScores();
        this.refreshTimeoutId = setTimeout(this.step.bind(this), this.challenge);
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
  View.prototype.playAgain = function (e) {
    e.preventDefault();
    this.restartGame();
    this.setupGame();
  };

  View.prototype.restartGame = function () {
    this.unBindGameOverEvents();
    this.board.over = false;
    this.board.snakes.forEach(function(snake) { snake.lost = false });
    this.scoreBoards.forEach(function(board){
      board.resetAppleScore();
    })
  };

  View.prototype.bindRestartEvents = function () {
    this.$rootEl.on('click', 'button#new-game', this.playAgain.bind(this));
    this.$rootEl.on('click', 'button#adjust-difficulty', this.toggleChallengeModal.bind(this));
    this.$rootEl.on('click', 'button#cancel-challenge-adjust', this.toggleChallengeModal.bind(this));
    this.$rootEl.on('click', 'button#submit-challenge', this.submitChallenge.bind(this));
  };

  View.prototype.unBindGameOverEvents = function () {
    this.$rootEl.off();
    this.$rootEl.find('button#new-game').off();
    this.$rootEl.find('button#adjust-difficulty').off();
    this.$rootEl.find('button#cancel-challenge-adjust').off();
    this.$rootEl.find('button#submit-challenge').off();
    this.$rootEl.find('div.game-over').remove();
  };

  View.prototype.gameOverProtocol = function () {
    this.board.over = true;
    this.incrementScores();
    this.addGameOverBox();
    this.bindRestartEvents();
  };

  View.prototype.addGameOverBox = function () {
    var $gameOver = $('<div class="game-over">');
    $gameOver.html("<h1>Game Over!</h1>");
    $gameOver.append("<p>" + this.board.gameOverText + "</p>");
    $gameOver.append("<button id='new-game'>Play Again?</button>");
    $gameOver.append("<button id='adjust-difficulty'>Adjust Difficulty?</button>");
    this.$rootEl.append($gameOver);
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

  View.GENERAL_KEYS = {
    32: true, // start again
    80: true  // pause or start
  }

  View.PLAYER_ONE_KEYS = {
    // arrow keys
    38: "N",
    37: "W",
    40: "S",
    39: "E",
  };

  View.PLAYER_TWO_KEYS = {
    // wasd
    87: "N",
    65: "W",
    83: "S",
    68: "E",
  };

  View.PLAYER_THREE_KEYS = {
    // ijkl
    75: "N",
    76: "W",
    73: "S",
    74: "E",
  };

  View.prototype.handleKeyEvent = function (e) {
    e.preventDefault();

    // pause and restart (p and spacebar)
    if (View.GENERAL_KEYS[e.keyCode]) {
      this.handleGeneralKeyEvent(e)
    } else if (View.PLAYER_ONE_KEYS[e.keyCode]) {
      this.board.snakes[0].turn(View.PLAYER_ONE_KEYS[e.keyCode])
    } else if (View.PLAYER_TWO_KEYS[e.keyCode]) {
      this.board.snakes[1].turn(View.PLAYER_TWO_KEYS[e.keyCode])
    } else if (View.PLAYER_THREE_KEYS[e.keyCode]) {
      this.board.snakes[2].turn(View.PLAYER_THREE_KEYS[e.keyCode])
    }
  };

  View.prototype.handleGeneralKeyEvent = function (e) {
    switch (e.keyCode) {
    case 32:
      this.playAgain(e);
      break;
    case 80:
      this.togglePause(e);
      break;
    default:
      break;
    }
  }

})();
