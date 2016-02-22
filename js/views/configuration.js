app.views.configuration = Backbone.View.extend({
  template: _.template($("#tpl-configuration").html()),
  events: {
    'submit': 'play'
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
    var board_layout_id = parseInt(this.$('#layout').val());
    this.model.set({ board_layout_id: board_layout_id})
    var background_id = parseInt(this.$('#background').val());
    this.model.set({ background_id: background_id})
    var tile_renderer_id = parseInt(this.$('#tile_renderer').val());
    this.model.set({ tile_renderer_id: tile_renderer_id})
    this.trigger("play");
  }
});
