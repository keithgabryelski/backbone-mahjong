app.models.Board = Backbone.Model.extend({
  defaults: {
    deck: null,
    board_layout: null,
    positioned_tiles: [],
    pulled_tiles: [],
    highlighted_tile: null,
    current_matches: [],
    history: new app.models.TilePairs()
  },
  num_layers: function() {
    return this.get('positioned_tiles').length;
  },
  num_rows: function() {
    return this.get('positioned_tiles')[0].length;
  },
  num_columns: function() {
    return this.get('positioned_tiles')[0][0].length
  },
  get_all_positioned_tiles: function() {
    var tiles = [];
    for (var depth = 0; depth < this.get('positioned_tiles').length; ++depth) {
      var board_layer = this.get('positioned_tiles')[depth];
      for (var y = 0; y < board_layer.length; ++y) {
        var board_row = board_layer[y];
        for (var x = 0; x < board_row.length; ++x) {
          if (board_row[x]) {
            tiles.push(board_row[x])
          }
        }
      }
    }
    return tiles;
  },
  remove_tile: function(position) {
    this.get('positioned_tiles')[position.get('layer')][position.get('row')][position.get('column')] = null;
  },
  tile_move: function(tile1, tile2) {
    this.history.push[tile1, tile2]
  }
});
