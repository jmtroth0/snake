(function(){
  window.SnakeGame = window.SnakeGame || {};

  var SplashPageView = window.SnakeGame.SplashPageView = function ($rootEl) {
    this.$rootEl = $rootEl;

    this.bindNavigationButtons();
    this.$rootEl.on("click", "button.init", this.initializeMultiPGame.bind(this));
    this.exposed = "front";
  };

  SplashPageView.prototype.bindNavigationButtons = function (e) {
    this.$rootEl.on("click", 'button#single-player',
      this.initializeGame.bind(this, {numSnakes: 1})
    );
    this.$rootEl.on("click", 'button.nav',
      this.exposeSet.bind(this)
    );
    this.$rootEl.on("click", 'button#front', this.exposeSet.bind(this));
  };

  SplashPageView.prototype.initializeMultiPGame = function (e) {
    this.initializeGame({
      numSnakes: parseInt(e.currentTarget.dataset.numPlayers),
      numComps: parseInt(e.currentTarget.dataset.numComps)
    });
  };

  SplashPageView.prototype.exposeSet = function (e) {
    this.$rootEl.find('.' + e.currentTarget.id).removeClass('hidden');
    this.$rootEl.find('.' + this.exposed).addClass('hidden');
    this.$rootEl.find('button#front').toggleClass('hidden');
    this.exposed = e.currentTarget.id;
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
