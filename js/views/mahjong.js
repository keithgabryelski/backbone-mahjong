app.views.mahjong = Backbone.View.extend({
  tagName: 'div',
  template: _.template($("#tpl-mahjong").html()),
  events: {
    'click #quitButton': 'quit',
    'click #hintButton': 'hint',
    'click #undoButton': 'undo',
    'click #mahjongGameTimer': 'pause',
    'click #pausePanelClose': 'unpause'
  },
  initialize: function(options) {
    this.boardStatus = new app.models.BoardStatus();
    this.configuration = options.model;
    this.mahjongGame = new app.models.MahjongGame();
    this.boardHistoryView = new app.views.boardHistory({ collection: this.boardStatus.get('history') });
    this.boardGameTimerView = new app.views.gameTimer({ model: this.boardStatus });
    this.boardGameStatusView = new app.views.gameStatus({ model: this.boardStatus });
    this.boardGameDetailsView = new app.views.gameDetails({ model: this.boardStatus });
    $(window).on('resize.resizeview', this.onResize.bind(this));
  },
  render: function() {
    this.$el.css({height: "100%"})
    this.$el.html(this.template({board_layout_name: this.configuration.board_layout().get('name')}));
    this.boardHistoryView.render();
    this.boardGameTimerView.render();
    this.boardGameStatusView.render();
    this.boardGameDetailsView.render();
    this.mahjongGame.setupGame($("#mahjongBoard"), this.configuration, this.boardStatus);
    $('#mahjongBoardHistory').append(this.boardHistoryView.el);
    $('#mahjongGameTimer').append(this.boardGameTimerView.el);
    $('#mahjongGameStatus').append(this.boardGameStatusView.el);
    $('#mahjongGameDetails').append(this.boardGameDetailsView.el);
    this.mahjongGame.startGame();
    this.delegateEvents();
    return this;
  },
  remove: function() {
    $(window).off('resize.resizeview');
    Backbone.View.prototype.remove.call(this);
  },
  onResize: function () {
    this.mahjongGame.refreshBoard();
  },
  quit: function(e) {
    e.preventDefault();
    this.trigger("quit");
  },
  hint: function(e) {
    e.preventDefault();
    if (this.mahjongGame) {
      if (e.shiftKey) {
        this.mahjongGame.select_hint();
      } else {
        this.mahjongGame.show_hint();
      }
    }
  },
  undo: function(e) {
    e.preventDefault();
    if (this.mahjongGame) {
      this.mahjongGame.undo();
    }
  },
  pause: function(e) {
    e.preventDefault();
    if (this.mahjongGame) {
      this.mahjongGame.pauseGame();
    }
  },
  unpause: function(e) {
    e.preventDefault();
    if (this.mahjongGame) {
      this.mahjongGame.unpauseGame();
    }
  },
});
