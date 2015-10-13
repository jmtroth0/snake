(function(){
  window.SnakeGame = window.SnakeGame || {};

  var SplashPageView = window.SnakeGame.SplashPageView = function ($rootEl) {
    this.$rootEl = $rootEl;
    this.$rootEl.on("click", 'button#single-player', this.initializeSinglePlayerGame.bind(this));
    this.$rootEl.on("click", 'button#vs-game', this.initializeVSGame.bind(this));
  };

  SplashPageView.prototype.removeModal = function () {
    this.$rootEl.find('.splash-modal').remove();
  };

  SplashPageView.prototype.initializeSinglePlayerGame = function (e) {
    e.preventDefault();
    this.removeModal();
    new window.SnakeGame.View({el: this.$rootEl, challenge: 4, numSnakes: 1});
  };

  SplashPageView.prototype.initializeVSGame = function (e) {
    e.preventDefault();
    this.removeModal();
    new window.SnakeGame.View({el: this.$rootEl, challenge: 4, numSnakes: 2});
  };

})();
