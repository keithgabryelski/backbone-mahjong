app.views.mahjong = Backbone.View.extend({
  tagName: 'div',
  template: _.template($("#tpl-mahjong").html()),
  events: {
    'click #quitButton': 'quit',
    'click #hintButton': 'hint',
    'click #undoButton': 'undo'
  },
  initialize: function(options) {
    this.boardStatus = new app.models.BoardStatus();
    this.configuration = options.model;
    this.dealer = new app.models.Dealer($("#mahjongBoard"), this.configuration, this.boardStatus)
    this.boardHistoryView = new app.views.boardHistory({ collection: this.boardStatus.get('history') });
    this.boardGameTimerView = new app.views.gameTimer({ model: this.boardStatus });
    this.boardGameStatusView = new app.views.gameStatus({ model: this.boardStatus });
    this.boardGameDetailsView = new app.views.gameDetails({ model: this.boardStatus });
    $(window).on('resize.resizeview', this.onResize.bind(this));
  },
  render: function() {
    this.$el.css({height: "100%"})
    this.$el.html(this.template({board_layout_name: this.configuration.board_layout().get('name')}));
    this.dealer.generate_board();
    this.boardHistoryView.render();
    this.boardGameTimerView.render();
    this.boardGameStatusView.render();
    $('#mahjongBoardHistory').append(this.boardHistoryView.el);
    $('#mahjongGameTimer').append(this.boardGameTimerView.el);
    $('#mahjongGameStatus').append(this.boardGameStatusView.el);
    this.delegateEvents();
    this.dealer.startGame();
    return this;
  },
  remove: function() {
    $(window).off('resize.resizeview');
    Backbone.View.prototype.remove.call(this);
  },
  onResize: function () {
    this.dealer.refreshBoard();
  },
  quit: function(e) {
    alert("quit")
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
});
