app.models.ReverseDealer = app.models.Dealer.extend({
  deal: function(deck) {
    var board_layout = this.configuration.board_layout();
    var tile_pairs = deck.getShuffledTilePairs();
    var positioned_tiles = [];

    // get all tile positions on board
    // var positions_array = board_layout.getTilePositionArray();
    var starting_state = this.createBlankLayoutAndLayerMask(board_layout.get('layout'));
    var layer_mask_board_array = starting_state.layer_mask_board_array;
    var current_available_positions = starting_state.current_available_positions;
    
    while (tile_pairs.length > 0) {
      var tile_pair = tile_pairs.pop();
      var positions = this.findWinnablePositionPair(current_available_positions, layer_mask_board_array);

      if (positions.length == 1) {
        console.log("broken layout: tile_pairs: " + tile_pairs.length);
        throw "broken layout";
      }
      var layer = positions[0].get('layer');
      var row = positions[0].get('row');
      var column = positions[0].get('column');

      var positioned_tile = current_available_positions[layer][row][column];
      positioned_tile.set({tile: tile_pair.get('tile1')})
      layer_mask_board_array[layer][row][column] = positioned_tile;
      positioned_tiles.push(positioned_tile)
      current_available_positions[layer][row][column] = null;

      layer = positions[1].get('layer');
      row = positions[1].get('row');
      column = positions[1].get('column');

      positioned_tile = current_available_positions[layer][row][column];
      positioned_tile.set({tile: tile_pair.get('tile2')})
      layer_mask_board_array[layer][row][column] = positioned_tile;
      positioned_tiles.push(positioned_tile);
      current_available_positions[layer][row][column] = null;
    }
    return this.dealBoard(positioned_tiles);
  },
  createBlankLayoutAndLayerMask: function(board_layout) {
    // for each layer
    //   use lower layer as above (all ones for bottom layer)
    //   find all the tiles that are fully covered
    var current_available_positions = [ ]
    var layer_masks = [ ];

    var num_rows = board_layout[0].length;
    var num_columns = board_layout[0][0].length;
    var layer = [], blank_layer = [];

    for (var layer_num = 0; layer_num < board_layout.length; ++layer_num) {
      var layer = []
      var full_layer = []
      for (var row_num = 0; row_num < num_rows; ++row_num) {
        var row = [];
        var full_row = [];
        for (var column_num = 0; column_num < num_columns; ++column_num) {
          row.push(null);
          if (board_layout[layer_num][row_num][column_num] == 0) {
            full_row.push(null);
          } else {
            full_row.push(new app.models.PositionedTile({
              position: new app.models.Position({
                layer: layer_num,
                row: row_num,
                column: column_num,
                position: board_layout[layer_num][row_num][column_num]
              })
            }))
          }
        }
        layer.push(row);
        full_layer.push(full_row)
      }
      layer_masks.push(layer)
      if (layer_num == 0) {
        layer_masks[-1] = full_layer;
      }
      current_available_positions.push(full_layer)
    }

    return {
      layer_mask_board_array: layer_masks,
      current_available_positions: current_available_positions
    }
  },

  // a winnable position is a pair of positions that can be immediately removed.
  // this is basically random except you can't make unfilled circles
  // proposal, pick two spots:
  //  check that both tiles are removeable
  //  check that there are no empty spots surrounded completely by tiles
  //
  // is is possible to get into a position where you can only put two tiles down
  // that are immediately blocked?  this means starting over or unwinding the knot

  findWinnablePositionPair: function(current_available_positions, layer_mask_board_array) {
    var hit_master = new app.models.HitMaster(layer_mask_board_array);
    var positions = [];
    var num_layers = current_available_positions.length;
    var num_rows = current_available_positions[0].length;
    var num_columns = current_available_positions[0][0].length;
    //console.log("searching:")
    for (var layer_num = 0; layer_num < num_layers; ++layer_num) {
      for (var row_num = 0; row_num < num_rows; ++row_num) {
        for (var column_num = 0; column_num < num_columns; ++column_num) {
          if (current_available_positions[layer_num][row_num][column_num] !== null) {
            var positioned_tile = current_available_positions[layer_num][row_num][column_num];
            var position = positioned_tile.get('position');
            if (hit_master.isPositionUsable(position)) {
              positions.push(position)
              /*
              console.log("found: l: " + position.get('layer') +
                          ", r: " + position.get('row') +
                          ", c: " + position.get('column') +
                          ", p: " + position.get('position'));
              */
            }
          }
        }
      }
    }
    var choices = positions.shuffle().slice(0, 2);
    /*
    console.log("chosen 1: l: " + choices[0].get('layer') +
                ", r: " + choices[0].get('row') +
                ", c: " + choices[0].get('column') +
                ", p: " + choices[0].get('position'));
    console.log("chosen 2: l: " + choices[1].get('layer') +
                ", r: " + choices[1].get('row') +
                ", c: " + choices[1].get('column') +
                ", p: " + choices[1].get('position'));
    */
    return choices
  },
});
