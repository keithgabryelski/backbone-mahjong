app.views.mahjong = Backbone.View.extend({
  tagName: 'div',
  template: _.template($("#tpl-mahjong").html()),
  events: {
    'click button.quit': 'quit',
    'click button.hint': 'hint',
    'click button.undo': 'undo'
  },
  initialize: function(options) {
    this.boardStatus = new app.models.BoardStatus();
    this.configuration = options.model;
    this.dealer = new app.models.Dealer($("#mahjongBoard"), this.configuration, this.boardStatus)
    this.boardStatusView = new app.views.boardStatus({ model: this.boardStatus });
    this.boardHistoryView = new app.views.boardHistory({ collection: this.boardStatus.get('history') });
    this.boardControlsView = new app.views.boardControls();
    this.boardGameTimerView = new app.views.gameTimer({ model: this.boardStatus });
    this.boardGameStatusView = new app.views.gameStatus({ model: this.boardStatus });
    this.boardGameDetailsView = new app.views.gameDetails({ model: this.boardStatus });
    $(window).on('resize.resizeview', this.onResize.bind(this));
  },
  render: function() {
    this.$el.css({height: "100%"})
    this.$el.html(this.template({board_layout_name: this.configuration.board_layout().get('name')}));
    this.dealer.generate_board();
    this.boardStatusView.render();
    this.boardHistoryView.render();
    this.boardControlsView.render();
    this.boardGameTimerView.render();
    this.boardGameStatusView.render();
    this.boardGameDetailsView.render();
    $('#mahjongBoardHistory').append(this.boardHistoryView.el);
    $('#mahjongGameTimer').append(this.boardGameTimerView.el);
    $('#mahjongGameStatus').append(this.boardGameStatusView.el);
    $('#mahjongGameDetails').append(this.boardGameDetailsView.el);
    this.delegateEvents();
    this.dealer.startGame();
    return this;
  },
  quit: function(e) {
    e.preventDefault();
    this.trigger("quit");
  },
  hint: function(e) {
    e.preventDefault();
    if (this.dealer) {
      this.dealer.show_hint();
    }
  },
  undo: function(e) {
    e.preventDefault();
    if (this.dealer) {
      this.dealer.undo();
    }
  },
  remove: function() {
    $(window).off('resize.resizeview');
    Backbone.View.prototype.remove.call(this);
  },
  onResize: function () {
    this.dealer.refreshBoard();
  },
});
