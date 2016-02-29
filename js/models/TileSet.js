app.models.TileSet = Backbone.Model.extend({
  defaults: {
    tile_category: null,
    num_sets: null
  },
  getTiles: function() {
    return app.tiles.where({tile_category: this.get('tile_category')});
  },
  asTilePairs: function() {
    var tile_pairs = []
    var tiles = this.getTiles();
    var num_sets = this.get('num_sets');
    if ((num_sets % 2) == 0) {
      for (var nn = 0; nn < num_sets / 2; ++nn) {
        for (var n = 0; n < tiles.length; ++n) {
          tile_pairs.push(new app.models.TilePair({
            tile1: tiles[n],
            tile2: tiles[n]
          }))
        }
      }
    } else {
      if ((tiles.length % 2) != 0) {
        throw "don't know how to handle a tileset that has an odd number of tiles and only appears once"
      }
      for (var nn = 0; nn < num_sets / 2; ++nn) {
        for (var n = 0; n < tiles.length; n += 2) {
          tile_pairs.push(new app.models.TilePair({
            tile1: tiles[n],
            tile2: tiles[n+1]
          }))
        }
      }
    }
    return tile_pairs;
  }
});
