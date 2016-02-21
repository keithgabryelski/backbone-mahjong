app.models.TileManager = Backbone.Model.extend({
  initialize: function(board, configuration, tile_click_handler) {
    this.configuration = configuration;
    this.board = board;
    this.tileClickHandler = tile_click_handler;
  },
  remove_tile: function(positioned_tile) {
    var tile = this.remove_tile_from_board(positioned_tile);
    tile.css({position: "static"}).css({zIndex: 1, boxShadow: ""})
    this.board.remove_tile(positioned_tile.get('position'))
  },
  remove_tile_from_board: function(positioned_tile) {
    this.make_tile_unclickable(positioned_tile);
    $(positioned_tile.get('view')).
      addClass('highlighted').
      removeClass('on_board').
      removeClass('hinted').
      addClass('off_board');
    this.disable_tooltip_for_tile(positioned_tile);
    var tile = $(positioned_tile.get('view')).remove();
    return tile;
  },
  make_tile_clickable: function(positioned_tile) {
    var self = this;
    $(positioned_tile.get('view')).
      addClass("clickable").
      on("click", this.tileClickHandler);
  },
  make_tile_unclickable: function(positioned_tile) {
    $(positioned_tile.get('view')).
      removeClass("clickable").
      off("click")
  },
  disable_tooltip_for_tile: function(tile) {
    $(tile.get('view')).tooltip('hide');
    $(tile.get('view')).tooltip('disable');
  },
  enable_tooltip_for_tile: function(tile) {
    $(tile.get('view')).tooltip('enable');
  },
  highlight_tile: function(tile) {
  },
  unhighlight_tile: function(tile) {
  },
  compute_sizings: function() {
    this.divWidth = $('div#mahjongBoard').innerWidth();
    this.divHeight = $('div#mahjongBoard').innerHeight();

    this.dimensions = this.board.current_dimensions();

    this.horizontalMarginInColumns = 2;
    this.verticalMarginInColumns = 2;

    this.boardWidth = this.divWidth;
    this.boardHeight = this.divHeight;

    this.tileWidth = this.boardWidth / (this.dimensions.numColumns + this.horizontalMarginInColumns);
    this.tileHeight = this.tileWidth * 4 / 3; // this seems about right

    // do the tiles vertically?
    if ((this.tileHeight * (this.dimensions.numRows + this.verticalMarginInColumns)) > this.boardHeight) {
      // fit to vertical size then
      this.tileHeight = this.boardHeight / (this.dimensions.numRows + this.verticalMarginInColumns);
      this.tileWidth = this.tileHeight * 3 / 4;
    }

    this.boardSideMargin = this.tileWidth * this.horizontalMarginInColumns / 2;
    this.boardTopBottomMargin = this.tileHeight * this.verticalMarginInColumns / 2;

    this.fontSize = this.tileWidth * 1.10; // this seems correct except for &#x1f004;
    this.lineHeight = 1.1;                 // this seems correct

    this.tileDepth = this.tileWidth * 0.10;

    this.left = (this.boardWidth - (this.boardSideMargin + (this.tileWidth * this.dimensions.numColumns) + this.boardSideMargin)) / 2;
    this.top = (this.boardHeight - (this.boardTopBottomMargin + (this.tileHeight * this.dimensions.numRows) + this.boardTopBottomMargin)) / 2;
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
      backgroundImage: "url('" + this.configuration.background_image_url() + "')",
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
        tooltip({
          title: tile.get('name'),
          delay: {
            show: 2000,
          }
        }).
        appendTo(mahjong_div)[0];

    positioned_tile.set({view: tile_image});
    jQuery.data(tile_image, 'tile', positioned_tile);
  },
  translatePositionToXYOrder: function(position, tile_width, tile_height, tile_depth) {
    var row = position.get('row') - this.dimensions.top;
    var column = position.get('column') - this.dimensions.left;
    var layer = position.get('layer') - this.dimensions.back;

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
});
