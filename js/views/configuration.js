app.views.configuration = Backbone.View.extend({
  template: _.template($("#tpl-configuration").html()),
  events: {
    'click button': 'play'
  },
  initialize: function() {
    this.render();
  },
  render: function(index) {
    this.$el.html(this.template(this.model.attributes));
    this.delegateEvents();
    return this;
  },
  play: function(e) {
    e.preventDefault();
    this.trigger("play");
  }
});
