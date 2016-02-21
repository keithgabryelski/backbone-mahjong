app.models.MahjongGame = Backbone.Model.extend({
  initialize: function() {
    this.boardDiv = null;
    this.configuration = null;
    this.boardStatus = null;
    this.highlighted = null;
    this.hintIndex = null;
    this.boardManager = null;
  },
  setupGame: function(board_div, configuration, board_status) {
    this.boardDiv = board_div;
    this.configuration = configuration;
    this.boardStatus = board_status;
    this.boardManager = new app.models.BoardManager(
      this.boardDiv,
      this.configuration,
      $.proxy(this.tileClickHandler, this)
    );
    this.boardManager.setup_game(this.boardStatus);
    this.boardManager.generate_board();
  },
  startGame: function() {
    this.boardManager.assess_clickability();
    this.boardStatus.startGame();
  },
  refreshBoard: function() {
    this.boardManager.refreshBoard();
  },
  tileClickHandler: function(event) {
    // XXX refactor this to use board manager for highlighting (game state)
    var target = $(event.target);
    var target_data = jQuery.data(target[0], 'tile')
    if (this.highlighted) {
      var highlighted_data = jQuery.data(this.highlighted[0], 'tile')
      if (highlighted_data == target_data) {
        target.removeClass('highlighted');
        this.highlighted = null;
        // BONKETY
      } else {
        if (highlighted_data.is_matching(target_data)) {
          var old_dimensions = this.boardManager.current_dimensions();
          // FLASH
          this.boardManager.remove_tiles(highlighted_data, target_data);
          this.highlighted = null;
          // BLIP
          this.clear_hint();
          var new_dimensions = this.boardManager.current_dimensions();
          if (old_dimensions.numRows == new_dimensions.numRows &&
              old_dimensions.numColumns == new_dimensions.numColumns) {
            this.boardManager.assess_clickability();
          } else {
            this.boardManager.refreshBoard();
          }
        } else {
          this.highlighted.removeClass('highlighted');
          this.highlighted = target;
          target.addClass('highlighted');
          // BONK
        }
      }
    } else {
      target.addClass('highlighted')
      this.highlighted = target;
    }
  },
  show_hint: function() {
    var tiles_having_matches = this.boardStatus.get('tiles_having_matches');
    if (this.hintIndex != null) {
      var old_hintIndex = this.hintIndex;
      this.clear_hint();
      this.hintIndex = (old_hintIndex + 1) % tiles_having_matches.length;
    } else {
      this.hintIndex = 0;
    }
    if (this.hintIndex >= tiles_having_matches.length) {
      // BONK
    } {
      var hintables = tiles_having_matches[this.hintIndex];
      if (hintables) {
        $(hintables[0].get('view')).addClass('hinted');
        for (var i = 0; i < hintables[1].length; i++) {
          $(hintables[1][i].get('view')).addClass('hinted');
        }
      }
    }
  },
  undo: function() {
    if (this.boardStatus.get('history').length == 0) {
      // BONK -- nothing to undo
      return;
    }

    this.clear_hint();          // XXX this should be on boardManger or TileManager

    // remove tile from historical area
    var tile_pair = this.boardStatus.get('history').shift();

    // add historical tile pair to board
    this.boardManager.addTilePairBackToBoard(tile_pair);

    // re-write the board
    this.boardManager.refreshBoard();
  },
  clear_hint: function() {
    // XXX refactor to lower level
    if (this.hintIndex == null) {
      return;
    }
    var tiles_having_matches = this.boardStatus.get('tiles_having_matches');
    if (this.hintIndex < tiles_having_matches.length) {
      var hintables = tiles_having_matches[this.hintIndex];
      $(hintables[0].get('view')).removeClass('hinted');
      for (var i = 0; i < hintables[1].length; i++) {
        $(hintables[1][i].get('view')).removeClass('hinted');
      }
    }
    this.hintIndex = null;
  },
});
