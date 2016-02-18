app.models.Configuration = Backbone.Model.extend({
  defaults: {
    background_style_name: "wood",
    deck_id: 1,
    board_layout_id: 1,
    time_limit: true,
    show_hints: true,
    show_matches: true,
    highlight_unblocked_tiles: true,
    allow_undo: true,
    allow_reshuffle: true,
    ensure_solvable: false,
    scale_as_tiles_are_removed: false
  },
  board_layout: function() {
    return app.boardLayouts.findWhere({ID: this.get('board_layout_id')});
  }
});
