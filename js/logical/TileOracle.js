app.models.TileOracle = Backbone.Model.extend({
  getTileStates: function(board_array) {
    var hit_master = new app.models.HitMaster(board_array);
    var tiles_on_board = this.getAllPositionedTiles(board_array);
    var visible_tiles = [];
    var unblocked_tiles = [];

    for (var i = 0; i < tiles_on_board.length; ++i) {
      var tile = tiles_on_board[i];
      if (hit_master.isTileVisible(tile)) {
        visible_tiles.push(tile);
      }
      if (!hit_master.isTileBlocked(tile)) {
        unblocked_tiles.push(tile);
      }
    }
    
    var tiles_having_matches = [];
    for (var i = 0; i < unblocked_tiles.length; ++i) {
      var tile1 = unblocked_tiles[i];
      var matching_tiles = [];
      for (var n = i+1; n < unblocked_tiles.length; ++n) {
        var tile2 = unblocked_tiles[n];
        if (tile1.isMatching(tile2)) {
          if (!this.isPreviousMatch(tile2, tiles_having_matches)) {
            matching_tiles.push(tile2)
          }
        }
      }
      if (matching_tiles.length > 0) {
        tiles_having_matches.push([tile1, matching_tiles])
      }
    }
    return {
      tiles_on_board: tiles_on_board,
      unblocked_tiles: unblocked_tiles,
      tiles_having_matches: tiles_having_matches,
      visible_tiles: visible_tiles
    }
  },
  getAllPositionedTiles: function(board_array) {
    var tiles = [];
    for (var depth = 0; depth < board_array.length; ++depth) {
      var board_layer = board_array[depth];
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
  isPreviousMatch: function(tile, previous_matching_sets) {
    for (var t = 0; t < previous_matching_sets.length; ++t) {
      var previous_matches = previous_matching_sets[t][1];
      for (var tt = 0; tt < previous_matches.length; ++tt) {
        if (previous_matches[tt] == tile) {
          return true;
        }
      }
    }
    return false;
  },
});
