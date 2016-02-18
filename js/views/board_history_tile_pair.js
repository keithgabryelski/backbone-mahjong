app.views.boardHistoryTilePair = Backbone.View.extend({
  template: _.template($("#tpl-board-history-tile-pair").html()),
  
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});
