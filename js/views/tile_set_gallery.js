app.views.tile_set_gallery = Backbone.View.extend({
  template: _.template($("#tpl-tile-set-gallery").html()),
  events: {
    "change #tile_renderer_id": "rendererSelected",
    'click #backButton': 'back',
  },
  initialize: function() {
    this.tiles = app.tiles
    this.plug = new app.models.UnicodeTilePlug();
    this.plug = new app.models.ImageTilePlug();
    this.plug.tileDimensions = {
      tileWidth: 48,
      tileHeight: 64,
      tileDepth: 6,
      fontSize: 48,
      lineHeight: 1.2
    }
    this.render();
  },
  render: function() {
    this.$el.html(this.template({collection: this.tiles.models}));
    this.delegateEvents();
    return this;
  },
  updateTileSets: function(klass) {
    this.plug = new klass(this.boardDiv, configuration);
  },
  rendererSelected: function(e) {
    e.preventDefault();
    this.render();
  },
  back: function(e) {
    this.trigger("back");
  },
});
