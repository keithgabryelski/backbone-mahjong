app.views.boardControls = Backbone.View.extend({
  template: _.template($("#tpl-board-controls").html()),
  
  render: function() {
    this.$el.html(this.template());
    return this;
  },
});
