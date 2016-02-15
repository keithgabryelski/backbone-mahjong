app.models.Dealer = Backbone.Model.extend({
  initialize: function(board_div, configuration) {
    this.boardDiv = board_div;
    this.configuration = configuration;
    this.deck = this.get_shuffled_deck();
    this.board = this.build_board();
  },
  get_shuffled_deck: function() {
    var deck = app.decks.standard;
    deck.shuffle();
    return deck;
  },
  build_board: function() {
    var board_layout = app.boardLayouts.findWhere({ID: 1})
    return this.deck.deal(board_layout);
  },
  compute_sizings: function() {
    this.divWidth = $('div#mahjongBoard').innerWidth();

    this.boardSideMargin = 0;
    this.boardTopBottomMargin = 0;

    this.numRows = this.board.num_rows();
    this.numLayers = this.board.num_layers();
    this.numColumns = this.board.num_columns();
    this.borderSize = 6;                      // in the css
    this.perspectiveOffset = this.borderSize;
    this.boardWidth = this.divWidth - (this.boardSideMargin * 2);
    this.tileWidth = (this.boardWidth / this.numColumns) - this.borderSize;
    this.fontSize = this.tileWidth * 1.10;

    this.tileHeight = this.tileWidth * 4 / 3;

    this.boardHeight = (this.boardTopBottomMargin * 2) + (this.numRows * this.tileHeight)
  },
  position_tile: function(positioned_tile) {
    // Position, Tile? returns PositionedTile?
  },
  generate_board: function() {
    // the dragon board
    var mahjongBoard = $("#mahjongBoard");
    mahjongBoard.attr({
      margin: 0, // XXX need to set each side and top individually
      padding: 0, // XXX this is wrong
    });

    this.compute_sizings();

    this.tileHandler = new app.models.TileHandler(this.board);
    this.generate_background(mahjongBoard[0]);
    this.show_board(mahjongBoard[0], this.board);
    this.tileHandler.assess_clickability();
  },
  generate_background: function(view) {
    $("<div>").attr({
      id: "background",
      margin: 0, // XXX need to set each side and top individually
      padding: 0, // XXX this is wrong
    }).css({
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: 0,
      minHeight: this.boardHeight,
      minWidth:  this.boardWidth,
      maxHeight: this.boardHeight,
      maxWidth:  this.boardWidth
    }).appendTo(view);
  },
  show_board: function(view, board) {
    var initial_offset = this.boardSideMargin + (this.numLayers * this.perspectiveOffset);

    var positioned_tiles = board.get_all_positioned_tiles()
    for (var i = 0; i < positioned_tiles.length; ++i) {
      var positioned_tile = positioned_tiles[i];
      var position = positioned_tile.get('position');
      var tile = positioned_tile.get('tile');
      var left = initial_offset + (position.get('column') * this.tileWidth) - (this.perspectiveOffset * position.get('layer'));
      var top = initial_offset + (position.get('row') * this.tileHeight) - (this.perspectiveOffset * position.get('layer'));
      switch (position.get('position')) {
      case 1:
        left += (this.tileWidth/2)
        top += (this.tileHeight/2)
        break;
      case 2:
        top += (this.tileHeight/2)
        break;
      case 4:
        left += (this.tileWidth/2)
        break;
      case 8:
        break;
      default:
        break;
      }
      var tile_image = $("<div>").
          addClass("tile40").
          addClass("category_" + tile.get('tile_category').get('short_name')).
          addClass("tile_" + tile.get('short_name')).
          css({
            left: left,
            top: top,
            zIndex: position.get('layer') + 1,
            position: 'absolute',
          }).
          css({
            width: this.tileWidth,
            height: this.tileHeight,
            fontSize: this.fontSize
          }).
          html(tile.get('value')).
          appendTo(view)[0];
      if (tile.get('short_name') == 'red_dragon') {
        $(tile_image).addClass("tilereddragon")
      }
      positioned_tile.set({view: tile_image});
      jQuery.data(tile_image, 'tile', positioned_tile)
    }
  },
});
