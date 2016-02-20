app.views.gameStatus = Backbone.View.extend({
  template: _.template($("#tpl-game-status").html()),
  
  initialize: function() {
    this.model.on("change", this.modelChanged, this)
  },
  modelChanged: function (model, changes) {
    this.render();
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});
