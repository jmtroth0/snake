(function(){
  window.SnakeGame = window.SnakeGame || {};

  var ScoreView = window.SnakeGame.ScoreView = function(el){
    this.$rootEl = el;
    this.vsScore = 0;
    this.appleScore = 0;
    this.setUpScoreBoard();
  };

  ScoreView.prototype.setUpScoreBoard = function () {
    this.$vsScore = $('<h2 class="vs-score">')
    this.$appleScore = $('<h2 class="apple-score">')
    this.$vsScore.html('Vs Score: ')
    this.$appleScore.html('Apple Score: ')
    this.$rootEl.append(this.$vsScore).append(this.$appleScore)
  };

  ScoreView.prototype.restart = function () {
    this.placeScore();
  };

  ScoreView.prototype.placeVsScore = function () {
    this.$vsScore.html('Vs Score: ' + this.vsScore);
  };

  ScoreView.prototype.incrementVsScore = function (level) {
    this.vsScore += level;
    this.placeVsScore();
  };

  ScoreView.prototype.placeAppleScore = function () {
    this.$appleScore.html('Apple Score: ' + this.appleScore);
  };

  ScoreView.prototype.incrementAppleScore = function (level) {
    this.appleScore += level;
    this.placeAppleScore();
  };
})();
