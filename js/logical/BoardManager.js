app.models.BoardManager = Backbone.Model.extend({
  initialize: function(board_div, configuration, tile_click_handler) {
    this.boardDiv = board_div;
    this.configuration = configuration;
    this.board = null;
    this.hitMaster = null;
    this.tileManager = null;
    this.tileClickHandler = tile_click_handler;
  },
  setup_game: function(board_status) {
    this.boardStatus = board_status;
    this.dealer = new app.models.Dealer(this.configuration);
    this.board = this.dealer.build_board();
    this.hitMaster = new app.models.HitMaster(this.board);
    this.tileManager = new app.models.TileManager(this.board, this.configuration, this.tileClickHandler);
  },
  current_dimensions: function() {
    return this.board.current_dimensions();
  },
  remove_tiles: function(positioned_tile1, positioned_tile2) {
    this.tileManager.remove_tile(positioned_tile2);
    this.tileManager.remove_tile(positioned_tile1);
    this.boardStatus.get('history').unshift(
      new app.models.TilePair({tile1: positioned_tile1, tile2: positioned_tile2})
    );
  },
  set_status: function() {
    var tiles_on_board = this.boardStatus.get('tiles_on_board')
    var unblocked_tiles = this.boardStatus.get('unblocked_tiles')
    var tiles_having_matches = this.boardStatus.get('tiles_having_matches')
    if (tiles_on_board.length == 0) {
      this.boardStatus.set({status: "WINNER!"});
      this.boardStatus.stopGame();
    } else if (tiles_having_matches.length == 0) {
      this.boardStatus.set({status: "LOSER!"});
      this.boardStatus.stopGame();
    } else {
      this.boardStatus.set({status: "Playing..."});
    }
  },
  is_previous_match: function(tile, previous_matching_sets) {
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
  assess_clickability: function() {
    var total_tiles = this.board.get_all_positioned_tiles();
    this.boardStatus.set({tiles_on_board: total_tiles})
    var total_unblocked_tiles = [];

    for (var i = 0; i < total_tiles.length; ++i) {
      var tile = total_tiles[i];
      this.tileManager.make_tile_unclickable(tile);
      if (!this.hitMaster.is_tile_blocked(tile)) {
        this.tileManager.make_tile_clickable(tile);
        total_unblocked_tiles.push(tile);
      }
      this.tileManager.disable_tooltip_for_tile(tile);
      if (this.hitMaster.is_tile_visible(tile)) {
        this.tileManager.enable_tooltip_for_tile(tile);
      }
    }
    
    var tiles_having_matches = [];
    for (var i = 0; i < total_unblocked_tiles.length; ++i) {
      var tile1 = total_unblocked_tiles[i];
      var matching_tiles = [];
      for (var n = i+1; n < total_unblocked_tiles.length; ++n) {
        var tile2 = total_unblocked_tiles[n];
        if (tile1.is_matching(tile2)) {
          if (!this.is_previous_match(tile2, tiles_having_matches)) {
            matching_tiles.push(tile2)
          }
        }
      }
      if (matching_tiles.length > 0) {
        tiles_having_matches.push([tile1, matching_tiles])
      }
    }

    this.boardStatus.set({unblocked_tiles: total_unblocked_tiles})
    this.boardStatus.set({tiles_having_matches: tiles_having_matches})
    this.set_status();
  },
  generate_board: function() {
    // XXX refactor, this should be one function on tilemanager i guess
    this.tileManager.compute_sizings();
    this.tileManager.generate_background(this.boardDiv[0]);
    this.tileManager.displayBoard(this.boardDiv[0], this.board);
  },
  refreshBoard: function() {
    this.clearBoard();
    this.generate_board();
    this.assess_clickability();
  },
  clearBoard: function() {
    // XXX refactor onto tilemanager i guess
    var positioned_tiles = this.tileManager.getSortedPositionedTiles(this.board);

    for (var i = 0; i < positioned_tiles.length; ++i) {
      this.tileManager.remove_tile_from_board(positioned_tiles[i]);
    }
  },
  addTilePairBackToBoard: function(tile_pair) {
    this.board.add_tile(tile_pair.get('tile1'));
    this.board.add_tile(tile_pair.get('tile2'));
  }
});
