app.models.Examiner = Backbone.Model.extend({
  initialize: function(starting_board) {
    this.tileOracle = new app.models.TileOracle();
    this.boardArray = this.copyBoard(starting_board.get('positioned_tiles'));
    this.playTree = null;
    this.boardCache = {};
    this.numMoves = starting_board.get_all_positioned_tiles().length / 2;
  },
  examine: function() {
    // get the board
    this.playTree = this.examinePlay(this.boardArray, 0)
  },
  examinePlay: function(board_array, level) {
    var hash = this.hashBoard(board_array);

    if (level >= this.numMoves) {
      throw "too many levels: " + level + ", board_array: " + hash;
    }

    var node = this.boardCache[hash];
    if (node) {
      return node;
    }

    var moves = new app.models.Moves()
    node = new app.models.Node({
      board: board_array,
      moves: moves
    });
    this.boardCache[hash] = node;

    var state = this.getValidMoveTilePairs(board_array);
    for (var i = 0; i < state.tile_pairs.length; ++i) {
      var tile_pair = state.tile_pairs[i];
      var new_board = this.adjustBoard(board_array, tile_pair);
      var move_node = this.examinePlay(new_board, level + 1)
      var move = new app.models.Move({
        tile_pair: tile_pair,
        result_node: move_node
      })
      moves.add(move)
    }
    if (state.tile_pairs.length == 0) {
      if (state.tiles_on_board.length == 0) {
        node.set({status: 'winner'});
      } else {
        node.set({status: 'loser'});
      }
    }
    return node;
  },
  getValidMoveTilePairs: function(board_array) {
    var tile_states = this.tileOracle.getTileStates(board_array);
    var legal_moves = tile_states.tiles_having_matches
    var legal_moves_as_tile_pairs = []
    for (var i = 0; i < legal_moves.length; ++i) {
      var tile1 = legal_moves[i][0];
      var matching_tiles = legal_moves[i][1];
      for (var m = 0; m < matching_tiles.length; ++m) {
        legal_moves_as_tile_pairs.push(new app.models.TilePair({
          tile1: tile1,
          tile2: matching_tiles[m]
        }))
      }
    }
    return {
      tile_pairs: legal_moves_as_tile_pairs,
      tiles_on_board: tile_states.tiles_on_board
    }
  },
  adjustBoard: function(board_array, tile_pair) {
    var new_board = this.copyBoard(board_array);

    var tile = tile_pair.get('tile1')
    var position = tile.get('position')
    new_board[position.get('layer')][position.get('row')][position.get('column')] = null;
    tile = tile_pair.get('tile2')
    new_board[position.get('layer')][position.get('row')][position.get('column')] = null;
    return new_board;
  },
  copyBoard: function(board_array) {
    var new_board = [];
    for (var l=0; l < board_array.length; ++l) {
      var layer = board_array[l];
      var new_layer = [];
      for (var r=0; r < layer.length; ++r) {
        var row = layer[r];
        var new_row = [];
        for (var c=0; c < row.length; ++c) {
          new_row.push(row[c]);
        }
        new_layer.push(new_row);
      }
      new_board.push(new_layer);
    }
    return new_board;
  },
  hashBoard: function(board_array) {
    var board_hash = []
    for (var l=0; l < board_array.length; ++l) {
      var layer = board_array[l];
      for (var r=0; r < layer.length; ++r) {
        var row = layer[r];
        for (var c=0; c < row.length; ++c) {
          board_hash.push(row[c] == null ? 0 : 1)
        }
      }
    }
    return board_hash.join('');
  },
});
