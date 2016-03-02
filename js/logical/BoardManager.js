app.models.BoardManager = Backbone.Model.extend({
  initialize: function(board_div, configuration, tile_click_handler) {
    this.boardDiv = board_div;
    this.configuration = configuration;
    this.board = null;
    this.tileManager = null;
    this.hintIndex = null;
    this.tileClickHandler = tile_click_handler;
    this.selectedTile = null;
  },
  setupGame: function(board_status) {
    this.boardStatus = board_status;
    this.dealer = this.configuration.getDealer();
    for (var i = 0; i < 10; ++i) {
      try {
        this.board = this.dealer.deal(app.decks.standard);
        this.tileManager = new app.models.TileManager(this.board, this.configuration, this.boardDiv, this.tileClickHandler);
      } catch (e) {
        console.log("failed to build board (retry): " + e);
        continue;
      }
      break;
    }
    //var examiner = new app.models.Examiner(this.board);
    //examiner.examine();
  },
  prepareToStartGame: function() {
    this.tileManager.prepareToStartGame()
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
      app.audioBoard.play_game_over_success();
    } else if (tiles_having_matches.length == 0) {
      this.boardStatus.set({status: "LOSER!"});
      this.boardStatus.stopGame();
      app.audioBoard.play_game_over_fail();
    } else {
      this.boardStatus.set({status: "Playing..."});
    }
  },
  setBoardStatusAndTileState: function() {
    var tile_oracle = new app.models.TileOracle();
    var tiles = tile_oracle.getTileStates(this.board.get('positioned_tiles'));
    this.tileManager.set_tiles_state(
      tiles.tiles_on_board,
      tiles.unblocked_tiles,
      tiles.visible_tiles
    );
    this.boardStatus.set({
      unblocked_tiles: tiles.unblocked_tiles,
      tiles_having_matches: tiles.tiles_having_matches,
      tiles_on_board: tiles.tiles_on_board
    })
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
        this.selectedTile = null;
        // BONKETY
        app.audioBoard.play_undo_selection();
      } else {
        if (this.selectedTile.isMatching(positioned_tile)) {
          app.audioBoard.play_tile_pair_selected();
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
          app.audioBoard.play_bonk();
          app.audioBoard.play_undo_selection();
        }
      }
    } else {
      app.audioBoard.play_first_tile_selected();
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
      app.audioBoard.play_bonk();
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
  },
  selectCurrentHint: function() {
    if (this.hintIndex == null) {
      // BONK
      app.audioBoard.play_bonk();
      return
    }
    app.audioBoard.play_tile_pair_selected();
    var tiles_having_matches = this.boardStatus.get('tiles_having_matches');
    var hint = tiles_having_matches[this.hintIndex];
    this.selectedTile = hint[0];
    this.selectTile(hint[1][0])
  }
});
