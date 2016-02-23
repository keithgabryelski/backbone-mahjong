app.views.instructions = Backbone.View.extend({
  tagName: 'div',
  template: _.template($("#tpl-instructions").html()),
  events: {
    'click #backButton': 'back',
  },
  initialize: function(options) {
  },
  render: function() {
    this.$el.html(this.template());
    this.delegateEvents();
    return this;
  },
  back: function(e) {
    this.trigger("back");
  },
});
