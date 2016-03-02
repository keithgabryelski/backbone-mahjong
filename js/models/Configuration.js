app.models.Configuration = Backbone.Model.extend({
  defaults: {
    background_id: 1,
    deck_id: 1,
    tile_renderer_id: 2,
    board_layout_id: 1,
    time_limit: true,
    show_hints: true,
    show_matches: true,
    highlight_unblocked_tiles: true,
    allow_undo: true,
    allow_reshuffle: true,
    ensure_solvable: false,
    scale_as_tiles_are_removed: false,
    audio_volume: .75,
    dealing_style_id: 3
  },
  tile_renderer: function() {
    return app.tileRenderers.findWhere({ID: this.get('tile_renderer_id')});
  },
  tile_rendering_plug_class: function() {
    return this.tile_renderer().get('rendering_plug_class')
  },
  board_layout: function() {
    return app.boardLayouts.findWhere({ID: this.get('board_layout_id')});
  },
  background: function() {
    return app.backgrounds.findWhere({ID: this.get('background_id')});
  },
  background_image_url: function() {
    return this.background().get('image_url')
  },
  background_repeat: function() {
    return this.background().get('repeat')
  },
  getDealer: function() {
    var dealing_style = app.dealingStyles.findWhere({ID: this.get('dealing_style_id')});
    var dealer_class = dealing_style.get('dealer_class');
    var dealer = new dealer_class(this);
    return dealer;
  }
});
