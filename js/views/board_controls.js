app.views.boardControls = Backbone.View.extend({
  template: _.template($("#tpl-board-controls").html()),
  el: "#mahjongGameControls",
  initialize: function(dealer) {
    this.dealer = dealer;
  },
  render: function() {
    this.$el.html(this.template());
    this.delegateEvents();
    return this;
  },
});
