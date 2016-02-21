app.models.Board = Backbone.Model.extend({
  defaults: {
    deck: null,
    board_layout: null,
    positioned_tiles: [],
    pulled_tiles: [],
    highlighted_tile: null,
    current_matches: []
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
  current_dimensions: function() {
    var tiles = new app.models.PositionedTiles(this.get_all_positioned_tiles());
    var positions = new app.models.Positions(tiles.pluck('position'));
    var left_column = Math.min.apply(Math, positions.pluck('column'));
    var right_column = Math.max.apply(Math, positions.pluck('column'));
    var top_row = Math.min.apply(Math, positions.pluck('row'));
    var bottom_row = Math.max.apply(Math, positions.pluck('row'));
    var back_layer = Math.min.apply(Math, positions.pluck('layer'));
    var front_layer = Math.max.apply(Math, positions.pluck('layer'));

    if (left_column == null) {
      left_column = 0;
      right_column = 0;
      top_row = 0;
      bottom_row = 0;
      back_layer = 0;
      front_layer = 0;
    }

    return {
      top: top_row,
      right: right_column,
      bottom: bottom_row,
      left: left_column,
      front: front_layer,
      back: back_layer,
      numRows: (bottom_row - top_row) + 1,
      numColumns: (right_column - left_column) + 1,
      numLayers: (front_layer - back_layer) + 1
    };
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
  add_tile: function(positioned_tile) {
    var position = positioned_tile.get('position');
    this.get('positioned_tiles')[position.get('layer')][position.get('row')][position.get('column')] = positioned_tile;
  },
});
