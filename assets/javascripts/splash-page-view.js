(function(){
  window.SnakeGame = window.SnakeGame || {};

  var SplashPageView = window.SnakeGame.SplashPageView = function ($rootEl) {
    this.$rootEl = $rootEl;
    this.$rootEl.on("click", 'button#single-player',
      this.initializeGame.bind(this, {numSnakes: 1}));
    this.$rootEl.on("click", 'button#vs-game',
      this.initializeGame.bind(this, {numSnakes: 2})
    );
    this.$rootEl.on("click", 'button#pvpvp-game',
      this.initializeGame.bind(this, {numSnakes: 3})
    );
    this.$rootEl.on("click", 'button#pvcvc-game',
      this.initializeGame.bind(this, {numSnakes: 3, numComps: 2})
    );
    this.$rootEl.on("click", 'button#vs-comp',
      this.initializeGame.bind(this, {numSnakes: 2, numComps: 1})
    );
  };

  SplashPageView.prototype.removeModal = function () {
    this.$rootEl.off();
    this.$rootEl.find('.splash-modal').remove();
  };

  SplashPageView.prototype.initializeGame = function (options) {
    this.removeModal();
    new window.SnakeGame.View({
      el: this.$rootEl,
      challenge: 4,
      numSnakes: options.numSnakes,
      numComps: options.numComps
    });
  };

})();
