(function(){
  window.SnakeGame = window.SnakeGame || {};

  var ScoreView = window.SnakeGame.ScoreView = function(el){
    this.$rootEl = el;
    this.score = 0;
    this.placeScore();
  };

  ScoreView.prototype.restart = function () {
    this.score = 0;
    this.placeScore();
  };

  ScoreView.prototype.placeScore = function () {
    this.$rootEl.html('<h2>' + this.score + '</h2>');
  };

  ScoreView.prototype.incrementScore = function (level) {
    this.score += level;
    this.placeScore();
  };
})();
