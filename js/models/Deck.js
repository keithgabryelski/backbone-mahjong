app.models.Deck = app.models.Type.extend({
  defaults: {
    tile_sets: []
  },
  getShuffledTiles: function() {
    var tiles = [];
    var tile_sets = this.get('tile_sets');
    var exemplar_tiles = app.tiles.where({tile_category: this.get('tile_category')})
    for (var i = 0; i < exemplar_tiles.length; ++i) {
      for (var n = 0; n < this.get('num_sets'); ++n) {
        tiles = tiles.concat(exemplar_tiles)
      }
    }
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
