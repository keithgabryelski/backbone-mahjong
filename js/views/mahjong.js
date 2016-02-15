app.views.mahjong = Backbone.View.extend({
  template: _.template($("#tpl-mahjong").html()),
  events: {
    'click button .quit': 'quit',
    'click button .hint': 'hint',
    'click button .undo': 'undo'
  },
  initialize: function(options) {
    this.timer = 0;
    this.delegateEvents();
    this.configuration = options.model;
    this.dealer = new app.models.Dealer($("#mahjongBoard"), this.configuration)
    this.tileHandler = null;

    this.intervalId = null;     // 
    this.startTime = null;
  },
  render: function(index) {
    this.$el.html(this.template({status: 'ok', timer: '00:00'}));
    this.dealer.generate_board();
    this.delegateEvents();
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
