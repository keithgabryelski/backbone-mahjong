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
    $(window).on('resize.resizeview', this.onResize.bind(this));
  },
  render: function() {
    this.$el.css({height: "100%"})
    this.$el.html(this.template());
    this.dealer.generate_board();
    this.boardStatusView.render();
    this.boardHistoryView.render();
    this.boardControlsView.render();
    this.boardStatusPanel = $.jsPanel({
      title:     'Status',
      size:     { height: "auto", width: 200 },
      position: 'bottom right',
      content:  this.boardStatusView.el,
      resizable: "disabled",
      controls:  { close: "disable", maximize: "disable" },
    });
    this.boardHistoryPanel = $.jsPanel({
      title:     'History',
      size:     { height: "auto", width: this.dealer.boardWidth },
      position: 'bottom left',
      content:  this.boardHistoryView.el,
      controls:  { smallify: "disable", close: "disable", maximize: "disable" },
      panelstatus: "minimized"
    });
    this.boardControlsPanel = $.jsPanel({
      size:     { width:  "auto", height: "auto" },
      resizable: "disabled",
      position: 'top left',
      removeHeader: true,
      draggable: {handle: 'div.jsPanel-content'},
      content:       this.boardControlsView.el
    });
    this.$el.append(this.boardControlsPanel);
    this.$el.append(this.boardHistoryPanel);
    this.$el.append(this.boardStatusPanel);
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
