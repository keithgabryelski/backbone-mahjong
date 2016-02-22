app.models.TileAdapter = Backbone.Model.extend({
  initialize: function(board_div, configuration) {
    this.boardDiv = board_div;
    this.configuration = configuration;
    klass = configuration.tile_rendering_plug_class();
    this.plug = new klass(this.boardDiv, configuration);
  },
  prepareToStartGame: function() {
    this.plug.prepareToStartGame();
  },
  get_positioned_tile: function(event) {
    return this.plug.get_positioned_tile(event);
  },
  prepare_for_board_update: function(board_dimensions) {
    this.dimensions = board_dimensions;

    this.tileDimensions = {
      divWidth: this.boardDiv.innerWidth(),
      divHeight: this.boardDiv.innerHeight(),
      horizontalMarginInColumns: 2,
      verticalMarginInColumns: 2,
      boardWidth: this.boardDiv.innerWidth(),
      boardHeight: this.boardDiv.innerHeight(),
    }

    var tileWidth = this.tileDimensions.boardWidth / (this.dimensions.numColumns + this.tileDimensions.horizontalMarginInColumns);
    var tileHeight = tileWidth * 4 / 3; // this seems about right

    // do the tiles vertically?
    if ((tileHeight * (this.dimensions.numRows + this.tileDimensions.verticalMarginInColumns)) > this.tileDimensions.boardHeight) {
      // fit to vertical size then
      tileHeight = this.tileDimensions.boardHeight / (this.dimensions.numRows + this.tileDimensions.verticalMarginInColumns);
      tileWidth = tileHeight * 3 / 4;
    }

    this.tileDimensions.tileHeight = tileHeight;
    this.tileDimensions.tileWidth = tileWidth;
    
    this.tileDimensions.boardSideMargin = tileWidth * this.tileDimensions.horizontalMarginInColumns / 2;
    this.tileDimensions.boardTopBottomMargin = tileHeight * this.tileDimensions.verticalMarginInColumns / 2;

    this.tileDimensions.left = (this.tileDimensions.boardWidth - (this.tileDimensions.boardSideMargin + (tileWidth * this.dimensions.numColumns) + this.tileDimensions.boardSideMargin)) / 2;
    this.tileDimensions.top = (this.tileDimensions.boardHeight - (this.tileDimensions.boardTopBottomMargin + (tileHeight * this.dimensions.numRows) + this.tileDimensions.boardTopBottomMargin)) / 2;
    this.plug.prepare_for_board_update(board_dimensions, this.tileDimensions)
  },
  disable_tooltip_for_tile: function(positioned_tile) {
    this.plug.disable_tooltip_for_tile(positioned_tile);
  },
  enable_tooltip_for_tile: function(positioned_tile) {
    this.plug.enable_tooltip_for_tile(positioned_tile);
  },
  erase_tile: function(positioned_tile) {
    this.plug.erase_tile(positioned_tile);
  },
  draw_tile: function(mahjong_div, positioned_tile) {
    this.plug.draw_tile(positioned_tile);
  },
  move_tile_to_history: function(positioned_tile)  {
    this.plug.move_tile_to_history(positioned_tile);
  },
  realize_tile_as_clickable: function(positioned_tile) {
    this.plug.realize_tile_as_clickable(positioned_tile);
  },
  realize_tile_as_unclickable: function(positioned_tile) {
    this.plug.realize_tile_as_unclickable(positioned_tile);
  },
  realize_tile_as_highlighted: function(positioned_tile) {
    this.plug.realize_tile_as_highlighted(positioned_tile);
  },
  realize_tile_as_unhighlighted: function(positioned_tile) {
    this.plug.realize_tile_as_unhighlighted(positioned_tile);
  },
  sortForSpriteRendering: function(a, b) {
    if (a.get('position').get('layer') == b.get('position').get('layer')) {
      return a.get('xyz').order - b.get('xyz').order;
    }
    return a.get('position').get('layer') - b.get('position').get('layer');
  },
  getSortedPositionedTiles: function(positioned_tiles) {
    for (var i = 0; i < positioned_tiles.length; ++i) {
      var positioned_tile = positioned_tiles[i];
      var position = positioned_tile.get('position');
      var xyz = this.translatePositionToXYOrder(position, this.tileDimensions.tileWidth, this.tileDimensions.tileHeight, this.tileDimensions.tileDepth);
      positioned_tile.set({xyz: xyz});
    }
    positioned_tiles.sort(this.sortForSpriteRendering)
    return positioned_tiles;
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
      x: this.tileDimensions.left + (column + column_increment) * (tile_width - (tile_depth * 0.5)),
      y: this.tileDimensions.top + (row + row_increment) * (tile_height - (tile_depth * 0.5)),
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
