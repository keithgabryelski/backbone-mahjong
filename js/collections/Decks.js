app.models.Decks = app.models.Types.extend({
  model: app.models.Deck,
  generate_tiles: function(tile_sets) {
    var tiles = [];
    for (var i = 0; i < tile_sets.length; ++i) {
      var tile_set = tile_sets[i];
      for (var n = 0; n < tile_set[1]; ++n) {
        tiles = tiles.concat(tile_set[0])
      }
    }
    return tiles;
  }
});
