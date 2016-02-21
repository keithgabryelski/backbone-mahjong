app.models.MahjongGame = Backbone.Model.extend({
  initialize: function() {
    this.boardDiv = null;
    this.configuration = null;
    this.boardStatus = null;
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
    this.boardManager.setupGame(this.boardStatus);
    this.boardManager.displayTilesOnBoard();
  },
  startGame: function() {
    this.boardManager.setBoardStatusAndTileState();
    this.boardStatus.startGame();
  },
  refreshBoard: function() {
    this.boardManager.refreshBoard();
  },
  tileClickHandler: function(event) {
    var target = $(event.target);
    var positioned_tile = jQuery.data(target[0], 'tile')
    this.boardManager.selectTile(positioned_tile);
  },
  show_hint: function() {
    this.boardManager.showNextHint();
  },
  undo: function() {
    if (this.boardStatus.get('history').length == 0) {
      // BONK -- nothing to undo
      return;
    }

    this.boardManager.resetHints();

    // remove tile from historical area
    var tile_pair = this.boardStatus.get('history').shift();

    // add historical tile pair to board
    this.boardManager.addTilePairBackToBoard(tile_pair);

    // re-write the board
    this.boardManager.refreshBoard();
  },
  clear_hint: function() {
    this.boardManager.resetHints();
  },
});
