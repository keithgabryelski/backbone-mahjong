app.models.Dealer = Backbone.Model.extend({
  initialize: function(board_div, configuration, board_status, board_history) {
    this.boardDiv = board_div;
    this.configuration = configuration;
    this.deck = this.get_shuffled_deck();
    this.board = this.build_board();
    this.board.set({history: board_history});
    this.boardStatus = board_status;
    this.tileHandler = null;
  },
  get_shuffled_deck: function() {
    var deck = app.decks.standard;
    deck.shuffle();
    return deck;
  },
  build_board: function() {
    return this.deck.deal(this.configuration.board_layout());
  },
  compute_sizings: function() {
    this.divWidth = $('div#mahjongBoard').innerWidth();
    this.divHeight = $('div#mahjongBoard').innerHeight();

    this.numRows = this.board.num_rows();
    this.numLayers = this.board.num_layers();
    this.numColumns = this.board.num_columns();

    this.horizontalMarginInColumns = 2;
    this.verticalMarginInColumns = 2;

    this.boardWidth = this.divWidth;
    this.boardHeight = this.divHeight;

    this.tileWidth = this.boardWidth / (this.numColumns + this.horizontalMarginInColumns);
    this.tileHeight = this.tileWidth * 4 / 3; // this seems about right

    // do the tiles vertically?
    if ((this.tileHeight * this.numRows) > this.boardHeight) {
      // fit to vertical size then
      this.tileHeight = this.boardHeight / (this.numRows + this.verticalMarginInColumns);
      this.tileWidth = this.tileHeight * 3 / 4;
    }

    this.boardSideMargin = this.tileWidth * this.horizontalMarginInColumns / 2;
    this.boardTopBottomMargin = this.tileHeight * this.verticalMarginInColumns / 2;

    this.fontSize = this.tileWidth * 1.10; // this seems correct except for &#x1f004;
    this.lineHeight = 1.2;                 // this seems correct

    this.tileDepth = this.tileWidth * 0.10;

    this.left = (this.boardWidth - (this.boardSideMargin + (this.tileWidth * this.numColumns) + this.boardSideMargin)) / 2;
    this.top = (this.boardHeight - (this.boardTopBottomMargin + (this.tileHeight * this.numRows) + this.boardTopBottomMargin)) / 2;
  },
  position_tile: function(positioned_tile) {
    // Position, Tile? returns PositionedTile?
  },
  generate_board: function() {
    // the dragon board
    var mahjongBoard = $("#mahjongBoard");

    this.compute_sizings();

    this.tileHandler = new app.models.TileHandler(this.board, this.boardStatus);
    this.generate_background(mahjongBoard[0]);
    this.displayBoard(mahjongBoard[0], this.board);
  },
  startGame: function() {
    this.tileHandler.assess_clickability();
    this.boardStatus.startGame();
  },
  refreshBoard: function() {
    this.clearBoard();
    this.generate_board();
    this.tileHandler.assess_clickability();
  },
  generate_background: function(view) {
    var div = $('div#background')
    if (div.length == 0) {
      div = $("<div>").attr({
        id: "background",
        margin: 0,
        padding: 0,
      }).appendTo(view);
    }
    div.css({
      backgroundImage: this.configuration.background_image_url(),
      backgroundRepeat: this.configuration.background_repeat(),
      backgroundSize: "cover",
      zIndex: 0,
      minHeight: this.boardHeight,
      minWidth:  this.boardWidth,
      maxHeight: this.boardHeight,
      maxWidth:  this.boardWidth
    })
  },
  sortForSpriteRendering: function(a, b) {
    if (a.get('position').get('layer') == b.get('position').get('layer')) {
      return a.get('xyz').order - b.get('xyz').order;
    }
    return a.get('position').get('layer') - b.get('position').get('layer');
  },
  getSortedPositionedTiles: function(board) {
    var positioned_tiles = board.get_all_positioned_tiles()
    for (var i = 0; i < positioned_tiles.length; ++i) {
      var positioned_tile = positioned_tiles[i];
      var position = positioned_tile.get('position');
      var xyz = this.translatePositionToXYOrder(position, this.tileWidth, this.tileHeight, this.tileDepth);
      positioned_tile.set({xyz: xyz});
    }
    positioned_tiles.sort(this.sortForSpriteRendering)
    return positioned_tiles;
  },
  displayBoard: function(mahjong_div, board) {
    var positioned_tiles = this.getSortedPositionedTiles(board);

    for (var i = 0; i < positioned_tiles.length; ++i) {
      this.displayTile(mahjong_div, positioned_tiles[i]);
    }
  },
  clearBoard: function() {
    var positioned_tiles = this.getSortedPositionedTiles(this.board);

    for (var i = 0; i < positioned_tiles.length; ++i) {
      this.tileHandler.remove_tile_from_board(positioned_tiles[i]);
    }
  },
  displayTile: function(mahjong_div, positioned_tile) {
    var tile = positioned_tile.get('tile');
    var xyz = positioned_tile.get('xyz');
    var tile_image = $("<div>").
        addClass("tile").
        addClass("category_" + tile.get('tile_category').get('short_name')).
        addClass("tile_" + tile.get('short_name')).
        addClass("on_board").
        css({
          left: xyz.x + this.boardSideMargin + (positioned_tile.get('position').get('layer') * this.tileDepth),
          top: xyz.y + this.boardTopBottomMargin - (positioned_tile.get('position').get('layer') * this.tileDepth),
          zIndex: (-1 * xyz.x) + xyz.y + (xyz.z * 1000), // 1000 := sloppy
          position: 'absolute',
        }).
        css({
          width: this.tileWidth,
          height: this.tileHeight,
        }).
        css({
          fontSize: this.fontSize,
          lineHeight: this.lineHeight
        }).
        css({
          borderStyle: "solid",
          borderWidth: "1px 1px " + this.tileDepth + "px " + this.tileDepth + "px",
          borderRadius: (this.tileWidth / 5) + "px",
        }).
        html(tile.get('value')).
        appendTo(mahjong_div)[0];

    if (tile.get('short_name') == 'red_dragon') {
      $(tile_image).
        css({
          fontSize: this.fontSize * 0.80, // hack, why is this codepoint different
          lineHeight: 1.5                 // hack, why is this codepoint different
        })
    }
    positioned_tile.set({view: tile_image});
    jQuery.data(tile_image, 'tile', positioned_tile);
  },
  translatePositionToXYOrder: function(position, tile_width, tile_height, tile_depth) {
    var row = position.get('row');
    var column = position.get('column');
    var layer = position.get('layer');

    var row_increment = 0;
    var column_increment = 0;
    switch (position.get('position')) {
    case 8:
      row_increment = 0;
      column_increment = 0;
      break;
    case 4:
      row_increment = 0;
      column_increment = 0.5;
      break;
    case 2:
      row_increment = 0.5;
      column_increment = 0;
      break;
    case 1:
      row_increment = 0.5;
      column_increment = 0.5;
      break;
    default:
      break;
    }
    var projectedXY = {
      x: (column + column_increment) * (tile_width - (tile_depth * 0.5)),
      y: (row + row_increment) * (tile_height - (tile_depth * 0.5)),
      z: layer * tile_depth
    }
    return {
      x: projectedXY.x,
      y: projectedXY.y,
      order: this.compute_order(
        projectedXY.x,
        projectedXY.y,
        projectedXY.z
      )
    }
  },
  compute_order: function(x, y, z) {
    return (-1 * x) +  y + z;
  },
  show_hint: function() {
    this.tileHandler.show_hint();
  },
  undo: function() {
    if (this.boardStatus.get('history').length == 0) {
      // BONK -- nothing to undo
      return;
    }

    // remove everything from the board and from the view
    this.clearBoard();
    this.tileHandler.clear_hint();

    // remove tile from historical area
    var tile_pair = this.boardStatus.get('history').shift();

    // add historical tile pair to board
    this.board.add_tile(tile_pair.get('tile1'));
    this.board.add_tile(tile_pair.get('tile2'));

    // re-write the board
    var mahjongBoard = $("#mahjongBoard");
    this.displayBoard(mahjongBoard[0], this.board);

    this.tileHandler.assess_clickability();
  }
});
