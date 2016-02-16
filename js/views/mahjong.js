app.views.mahjong = Backbone.View.extend({
  template: _.template($("#tpl-mahjong").html()),
  events: {
    'click button .quit': 'quit',
    'click button .hint': 'hint',
    'click button .undo': 'undo'
  },
  initialize: function(options) {
    this.boardStatus = new app.models.BoardStatus();
    this.configuration = options.model;
    this.dealer = new app.models.Dealer($("#mahjongBoard"), this.configuration, this.boardStatus)
    this.boardStatusView = new app.views.boardStatus({ model: this.boardStatus });
    this.boardControlsView = new app.views.boardControls();
  },
  render: function() {
    this.$el.html(this.template({status: 'ok', timer: '00:00'}));
    this.dealer.generate_board();
    this.boardStatusView.render();
    this.boardControlsView.render();
    $('#mahjongBoardStatus').append(this.boardStatusView.el);
    $('#mahjongBoardControls').append(this.boardControlsView.el);
    return this;
  },
  quit: function(e) {
    e.preventDefault();
    this.trigger("quit");
  },
  hint: function(e) {
    e.preventDefault();
    this.trigger("hint");
  },
});
