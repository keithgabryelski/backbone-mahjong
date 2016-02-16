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
    this.boardWidth = this.divWidth - (this.boardSideMargin * 2);
    this.tileWidth = (this.boardWidth / this.numColumns);
    this.fontSize = this.tileWidth * 1.10;
    this.lineHeight = 1.1

    this.tileHeight = this.tileWidth * 4 / 3;
    this.tileDepth = this.tileWidth * 0.10;
    this.borderSize = this.tileDepth;                      // in the css

    this.boardHeight = (this.boardTopBottomMargin * 2) + (this.numRows * this.tileHeight)
  },
  position_tile: function(positioned_tile) {
    // Position, Tile? returns PositionedTile?
  },
  generate_board: function() {
    // the dragon board
    var mahjongBoard = $("#mahjongBoard");
    mahjongBoard.attr({
      margin: 0,
      padding: 0,
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
      margin: 0,
      padding: 0,
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
    var positioned_tiles = board.get_all_positioned_tiles()
    var xyz_tiles = []
    for (var i = 0; i < positioned_tiles.length; ++i) {
      var positioned_tile = positioned_tiles[i];
      var position = positioned_tile.get('position');
      var xyz = this.translatePositionToXYOrder(position, this.tileWidth, this.tileHeight, this.tileDepth);
      xyz['positioned_tile'] = positioned_tile;
      xyz_tiles.push(xyz)
    }

    xyz_tiles.sort(function(a, b) {
      if (a.positioned_tile.get('position').get('layer') == b.positioned_tile.get('position').get('layer')) {
        return a.order - b.order;
      }
      return a.positioned_tile.get('position').get('layer') - b.positioned_tile.get('position').get('layer')
    })

    for (var i = 0; i < xyz_tiles.length; ++i) {
      var tile_xyz = xyz_tiles[i];
      var positioned_tile = tile_xyz.positioned_tile;
      var tile = positioned_tile.get('tile');
      var tile_image = $("<div>").
          addClass("tile").
          addClass("category_" + tile.get('tile_category').get('short_name')).
          addClass("tile_" + tile.get('short_name')).
          css({
            left: tile_xyz.x + ( positioned_tile.get('position').get('layer') * this.tileDepth),
            top: tile_xyz.y  - ( positioned_tile.get('position').get('layer') * this.tileDepth),
            zIndex: (-1 * tile_xyz.x) + tile_xyz.y + (tile_xyz.z * 1000), // 1000 := sloppy
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
          css({
            boxShadow: "-" + this.tileDepth + "px " + this.tileDepth + "px 10px rgba(0, 0, 0, .5)",
          }).
          html(tile.get('value')).
          appendTo(view)[0];
      if (tile.get('short_name') == 'red_dragon') {
        $(tile_image).
          css({
            fontSize: this.fontSize * 0.80, // hack, why is this codepoint different
            lineHeight: 1.5                 // hack, why is this codepoint different
          })
      }
      positioned_tile.set({view: tile_image});
      jQuery.data(tile_image, 'tile', positioned_tile)
    }
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
    var order = this.compute_order(
      projectedXY.x,
      projectedXY.y,
      projectedXY.z
    )
    return {
      x: projectedXY.x,
      y: projectedXY.y,
      order: order
    }
  },
  compute_order: function(x, y, z) {
    return (-1 * x) +  y + z;
  }
});
