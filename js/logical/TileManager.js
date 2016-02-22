app.models.TileManager = Backbone.Model.extend({
  initialize: function(board, configuration, board_div, tile_click_handler) {
    this.boardDiv = board_div;
    this.configuration = configuration;
    this.board = board;
    this.tileClickHandler = tile_click_handler;
    this.tileAdapter = new app.models.TileAdapter(board_div, configuration);
  },
  erase_all_tiles: function() {
    var positioned_tiles = this.board.get_all_positioned_tiles()
    var sorted_positioned_tiles = this.tileAdapter.getSortedPositionedTiles(positioned_tiles);
    for (var i = 0; i < sorted_positioned_tiles.length; ++i) {
      this.tileAdapter.erase_tile(sorted_positioned_tiles[i]);
    }
  },
  draw_all_tiles: function() {
    var positioned_tiles = this.board.get_all_positioned_tiles()
    var sorted_positioned_tiles = this.tileAdapter.getSortedPositionedTiles(positioned_tiles);
    for (var i = 0; i < sorted_positioned_tiles.length; ++i) {
      this.tileAdapter.draw_tile(this.boardDiv, sorted_positioned_tiles[i]);
    }
  },
  remove_tile_from_board: function(positioned_tile) {
    this.tileAdapter.erase_tile(positioned_tile);
    this.tileAdapter.move_tile_to_history(positioned_tile);
    this.board.remove_tile(positioned_tile.get('position'))
  },
  make_tile_clickable: function(positioned_tile) {
    this.tileAdapter.realize_tile_as_clickable(positioned_tile);
    var handler = $.proxy(this.click_handler, this)
    $(positioned_tile.get('view')).
      on("click", handler);
  },
  click_handler: function(event) {
    var positioned_tile = this.tileAdapter.get_positioned_tile(event);
    this.tileClickHandler(positioned_tile);
  },
  make_tile_unclickable: function(positioned_tile) {
    this.tileAdapter.realize_tile_as_unclickable(positioned_tile);
    $(positioned_tile.get('view')).
      off("click")
  },
  set_tiles_state: function(tiles_on_board, movable_tiles, visible_tiles) {
    // XXX manage state of tile through positioned_tile and do less work here
    for (var i = 0; i < tiles_on_board.length; ++i) {
      var tile = tiles_on_board[i];
      this.make_tile_unclickable(tile);
      this.tileAdapter.disable_tooltip_for_tile(tile);
    }
    for (var i = 0; i < movable_tiles.length; ++i) {
      var tile = movable_tiles[i];
      this.make_tile_clickable(tile);
    }
    for (var i = 0; i < visible_tiles.length; ++i) {
      var tile = visible_tiles[i];
      this.tileAdapter.enable_tooltip_for_tile(tile);
    }
  },
  highlight_tile: function(positioned_tile) {
    this.tileAdapter.realize_tile_as_highlighted(positioned_tile);
  },
  unhighlight_tile: function(positioned_tile) {
    this.tileAdapter.realize_tile_as_unhighlighted(positioned_tile);
  },
  prepareToStartGame: function() {
    this.tileAdapter.prepareToStartGame();
  },
  prepare_for_board_update: function(dimensions) {
    this.dimensions = dimensions;
    this.tileAdapter.prepare_for_board_update(dimensions)
  },
  generate_background: function() {
    var div = $('div#background')
    if (div.length == 0) {
      div = $("<div>").attr({
        id: "background",
        margin: 0,
        padding: 0,
      }).appendTo(this.boardDiv[0]);
    }
    div.css({
      backgroundImage: "url('" + this.configuration.background_image_url() + "')",
      backgroundRepeat: this.configuration.background_repeat(),
      backgroundSize: "cover",
      zIndex: 0,
      minHeight: this.boardDiv.innerHeight(),
      minWidth:  this.boardDiv.innerWidth(),
      maxHeight: this.boardDiv.innerHeight(),
      maxWidth:  this.boardDiv.innerWidth()
    })
  },
});
