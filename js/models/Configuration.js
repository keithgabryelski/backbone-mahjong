app.models.Configuration = Backbone.Model.extend({
  defaults: {
    background_style: null,
    deck: null,
    board_layout: null,
    time_limit: true,
    show_hints: true,
    show_matches: true,
    highlight_unblocked_tiles: true,
    allow_undo: true,
    allow_reshuffle: true,
    ensure_solvable: false
  }
});
