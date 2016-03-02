app.models.BlindForwardDealer = app.models.Dealer.extend({
  deal: function(deck) {
    // http://stackoverflow.com/questions/159547/mahjong-arrange-tiles-to-ensure-at-least-one-path-to-victory-regardless-of-la
    var board_layout = this.configuration.board_layout();
    var blank_layout = this.createBlankLayout(board_layout.get('layout'));
    var tile_pairs = deck.getShuffledTilePairs();
    var positioned_tiles = [];
    while (tile_pairs.length > 0) {
      var tile_pair = tile_pairs.pop();
      var blank_positioned_tile_pair = this.getBlankPositionedTilePair(blank_layout);
      var positioned_tile = blank_positioned_tile_pair.get('tile1');
      positioned_tile.set({tile: tile_pair.get('tile1')});
      positioned_tiles.push(positioned_tile);
      var position = positioned_tile.get('position');
      var layer = position.get('layer');
      var row = position.get('row');
      var column = position.get('column');
      blank_layout[layer][row][column] = null;

      positioned_tile = blank_positioned_tile_pair.get('tile2');
      positioned_tile.set({tile: tile_pair.get('tile2')});
      positioned_tiles.push(positioned_tile);
      position = positioned_tile.get('position');
      layer = position.get('layer');
      row = position.get('row');
      column = position.get('column');
      blank_layout[layer][row][column] = null;
    }
    return this.dealBoard(positioned_tiles);
  },
  getBlankPositionedTilePair: function(blank_layout) {
    var tile_oracle = new app.models.TileOracle();
    var tile_pairs = tile_oracle.getValidMoveTilePairs(blank_layout).tile_pairs
    return tile_pairs.shuffle()[0]
  },
  createBlankLayout: function(board_layout) {
    var current_available_positions = [ ]
    var num_rows = board_layout[0].length;
    var num_columns = board_layout[0][0].length;

    for (var layer_num = 0; layer_num < board_layout.length; ++layer_num) {
      var layer = []
      for (var row_num = 0; row_num < num_rows; ++row_num) {
        var row = [];
        for (var column_num = 0; column_num < num_columns; ++column_num) {
          if (board_layout[layer_num][row_num][column_num] == 0) {
            row.push(null);
          } else {
            row.push(new app.models.PositionedTile({
              position: new app.models.Position({
                layer: layer_num,
                row: row_num,
                column: column_num,
                position: board_layout[layer_num][row_num][column_num]
              }),
              tile: app.tiles.joker // matches anything
            }))
          }
        }
        layer.push(row)
      }
      current_available_positions.push(layer)
    }

    return current_available_positions;
  },
});
