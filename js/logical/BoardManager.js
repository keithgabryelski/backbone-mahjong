app.models.BoardManager = Backbone.Model.extend({
  initialize: function(board_div, configuration, tile_click_handler) {
    this.boardDiv = board_div;
    this.configuration = configuration;
    this.board = null;
    this.hitMaster = null;
    this.tileManager = null;
    this.hintIndex = null;
    this.tileClickHandler = tile_click_handler;
    this.selectedTile = null;
  },
  setupGame: function(board_status) {
    this.boardStatus = board_status;
    this.dealer = new app.models.Dealer(this.configuration);
    this.board = this.dealer.build_board();
    this.hitMaster = new app.models.HitMaster(this.board);
    this.tileManager = new app.models.TileManager(this.board, this.configuration, this.boardDiv, this.tileClickHandler);
  },
  current_dimensions: function() {
    return this.board.current_dimensions();
  },
  remove_tiles: function(positioned_tile1, positioned_tile2) { // XXX select tiles
    this.tileManager.remove_tile_from_board(positioned_tile2);
    this.tileManager.remove_tile_from_board(positioned_tile1);
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
  setBoardStatusAndTileState: function() {
    var tiles_on_board = this.board.get_all_positioned_tiles();
    this.boardStatus.set({tiles_on_board: tiles_on_board})
    var movable_tiles = [];
    var visible_tiles = [];

    for (var i = 0; i < tiles_on_board.length; ++i) {
      var tile = tiles_on_board[i];
      if (!this.hitMaster.is_tile_blocked(tile)) {
        movable_tiles.push(tile);
      }
      if (this.hitMaster.is_tile_visible(tile)) {
        visible_tiles.push(tile);
      }
    }

    this.tileManager.set_tiles_state(tiles_on_board, movable_tiles, visible_tiles);
    
    var tiles_having_matches = [];
    for (var i = 0; i < movable_tiles.length; ++i) {
      var tile1 = movable_tiles[i];
      var matching_tiles = [];
      for (var n = i+1; n < movable_tiles.length; ++n) {
        var tile2 = movable_tiles[n];
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

    this.boardStatus.set({unblocked_tiles: movable_tiles})
    this.boardStatus.set({tiles_having_matches: tiles_having_matches})
    this.set_status();
  },
  displayTilesOnBoard: function() {
    var dimensions = this.current_dimensions();
    this.tileManager.prepare_for_board_update(dimensions);
    this.tileManager.generate_background();
    this.tileManager.draw_all_tiles();
  },
  refreshBoard: function() {
    this.clearBoard();
    this.displayTilesOnBoard();
    this.setBoardStatusAndTileState();
  },
  clearBoard: function() {
    this.tileManager.erase_all_tiles();
  },
  addTilePairBackToBoard: function(tile_pair) {
    this.board.add_tile(tile_pair.get('tile1'));
    this.board.add_tile(tile_pair.get('tile2'));
  },
  selectTile: function(positioned_tile) {
    if (this.selectedTile) {
      if (this.selectedTile == positioned_tile) {
        this.tileManager.unhighlight_tile(positioned_tile);
        // BONKETY
      } else {
        if (this.selectedTile.is_matching(positioned_tile)) {
          var old_dimensions = this.current_dimensions();
          // FLASH
          this.remove_tiles(this.selectedTile, positioned_tile);
          this.selectedTile = null;
          // BLIP
          this.resetHints();
          var new_dimensions = this.current_dimensions();
          if (old_dimensions.numRows == new_dimensions.numRows &&
              old_dimensions.numColumns == new_dimensions.numColumns) {
            this.setBoardStatusAndTileState();
          } else {
            this.refreshBoard();
          }
        } else {
          this.tileManager.unhighlight_tile(this.selectedTile);
          this.selectedTile = positioned_tile;
          this.tileManager.highlight_tile(this.selectedTile);
          // BONK
        }
      }
    } else {
      this.selectedTile = positioned_tile;
      this.tileManager.highlight_tile(this.selectedTile);
    }
  },

  resetHints: function() {
    if (this.hintIndex == null) {
      return;
    }
    var tiles_having_matches = this.boardStatus.get('tiles_having_matches');
    if (this.hintIndex < tiles_having_matches.length) {
      var hintables = tiles_having_matches[this.hintIndex];
      // XXX move this to tilemanager
      $(hintables[0].get('view')).removeClass('hinted');
      for (var i = 0; i < hintables[1].length; i++) {
        $(hintables[1][i].get('view')).removeClass('hinted');
      }
    }
    this.hintIndex = null;
  },
  showNextHint: function() {
    var tiles_having_matches = this.boardStatus.get('tiles_having_matches');
    if (this.hintIndex != null) {
      var old_hintIndex = this.hintIndex;
      this.resetHints();
      this.hintIndex = (old_hintIndex + 1) % tiles_having_matches.length;
    } else {
      this.hintIndex = 0;
    }
    if (this.hintIndex >= tiles_having_matches.length) {
      // BONK
    } {
      var hintables = tiles_having_matches[this.hintIndex];
      // XXX this needs to be in tile manager
      if (hintables) {
        $(hintables[0].get('view')).addClass('hinted');
        for (var i = 0; i < hintables[1].length; i++) {
          $(hintables[1][i].get('view')).addClass('hinted');
        }
      }
    }
  }
});
