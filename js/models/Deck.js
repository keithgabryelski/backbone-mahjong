app.models.Deck = app.models.Type.extend({
  defaults: {
    tile_sets: []
  },
  getShuffledTiles: function() {
    var tiles = [];
    this.get('tile_sets').each(function(tile_set) {
      tiles = tiles.concat(tile_set.getTiles())
    });
    return tiles.shuffle();
  },
  getShuffledTilePairs: function() {
    var tiles = [];
    this.get('tile_sets').each(function(tile_set) {
      tiles = tiles.concat(tile_set.asTilePairs())
    });
    return tiles.shuffle();
  },
});
