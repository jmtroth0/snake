(function(){
  window.SnakeGame = window.SnakeGame || {};

  var ScoreView = window.SnakeGame.ScoreView = function(el){
    this.$rootEl = el;
    this.vsScore = 0;
    this.appleScore = 0;
    this.setUpScoreBoard();
  };

  ScoreView.prototype.setUpScoreBoard = function () {
    this.$vsScore = $('<h2 class="vs-score">');
    this.$appleScore = $('<h2 class="apple-score">');
    this.$vsScore.html('Vs Score: 0');
    this.$appleScore.html('Apple Score: 0');
    this.$rootEl.append(this.$vsScore).append(this.$appleScore);
  };

  ScoreView.prototype.resetAppleScore = function () {
    this.appleScore = 0;
    this.placeAppleScore();
  };

  ScoreView.prototype.placeVsScore = function () {
    this.$vsScore.html('Vs Score: ' + this.vsScore);
  };

  ScoreView.prototype.incrementVsScore = function () {
    this.vsScore += this.appleScore;
    this.placeVsScore();
  };

  ScoreView.prototype.placeAppleScore = function () {
    this.$appleScore.html('Apple Score: ' + this.appleScore);
  };

  ScoreView.prototype.incrementAppleScore = function (score) {
    this.appleScore += score;
    this.placeAppleScore();
  };
})();
