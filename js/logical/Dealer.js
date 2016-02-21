app.models.Dealer = Backbone.Model.extend({
  initialize: function(board_div, configuration, board_status, board_history) {
    this.boardDiv = board_div;
    this.configuration = configuration;
    this.deck = this.get_shuffled_deck();
    this.board = this.build_board();
    this.board.set({history: board_history});
    this.boardStatus = board_status;
    this.hint_index = null;
    this.hitMaster = new app.models.HitMaster(this.board);
  },
  remove_tiles: function(positioned_tile1, positioned_tile2) {
    this.remove_tile(positioned_tile2);
    this.remove_tile(positioned_tile1);
    this.boardStatus.get('history').unshift(
      new app.models.TilePair({tile1: positioned_tile1, tile2: positioned_tile2})
    );
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
  remove_tile: function(positioned_tile) {
    var tile = this.remove_tile_from_board(positioned_tile);
    tile.css({position: "static"}).css({zIndex: 1, boxShadow: ""})
    this.board.remove_tile(positioned_tile.get('position'))
  },
  make_tile_clickable: function(positioned_tile) {
    var self = this;
    $(positioned_tile.get('view')).
      addClass("clickable").
      on("click", function(e) {
        self.tile_click($(e.target));
      }).
      on('touchstart', function(event) {
        self.tile_click($(e.target));
      });
  },
  make_tile_unclickable: function(positioned_tile) {
    $(positioned_tile.get('view')).
      removeClass("clickable").
      off("click")
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
  disable_tooltip_for_tile: function(tile) {
    $(tile.get('view')).tooltip('hide');
    $(tile.get('view')).tooltip('disable');
  },
  enable_tooltip_for_tile: function(tile) {
    $(tile.get('view')).tooltip('enable');
  },
  assess_clickability: function() {
    var total_tiles = this.board.get_all_positioned_tiles();
    this.boardStatus.set({tiles_on_board: total_tiles})
    var total_unblocked_tiles = [];

    for (var i = 0; i < total_tiles.length; ++i) {
      var tile = total_tiles[i];
      this.make_tile_unclickable(tile);
      if (!this.hitMaster.is_tile_blocked(tile)) {
        this.make_tile_clickable(tile);
        total_unblocked_tiles.push(tile);
      }
      this.disable_tooltip_for_tile(tile);
      if (this.hitMaster.is_tile_visible(tile)) {
        this.enable_tooltip_for_tile(tile);
      }
    }
    
    var tiles_having_matches = [];
    for (var i = 0; i < total_unblocked_tiles.length; ++i) {
      var tile1 = total_unblocked_tiles[i];
      var matching_tiles = [];
      for (var n = i+1; n < total_unblocked_tiles.length; ++n) {
        var tile2 = total_unblocked_tiles[n];
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

    this.boardStatus.set({unblocked_tiles: total_unblocked_tiles})
    this.boardStatus.set({tiles_having_matches: tiles_having_matches})
    this.set_status();
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
  highlight_tile: function(tile) {
  },
  unhighlight_tile: function(tile) {
  },
  tile_click: function(target) {
    var target_data = jQuery.data(target[0], 'tile')
    if (this.highlighted) {
      var highlighted_data = jQuery.data(this.highlighted[0], 'tile')
      if (highlighted_data == target_data) {
        target.removeClass('highlighted');
        this.highlighted = null;
        // BONKETY
      } else {
        if (highlighted_data.is_matching(target_data)) {
          var old_dimensions = this.board.current_dimensions();
          // FLASH
          this.remove_tiles(highlighted_data, target_data);
          this.highlighted = null;
          // BLIP
          this.clear_hint();
          var new_dimensions = this.board.current_dimensions();
          if (old_dimensions.numRows == new_dimensions.numRows &&
              old_dimensions.numColumns == new_dimensions.numColumns) {
            this.assess_clickability();
          } else {
            this.refreshBoard();
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
    if (this.hint_index != null) {
      var old_hint_index = this.hint_index;
      this.clear_hint();
      this.hint_index = (old_hint_index + 1) % tiles_having_matches.length;
    } else {
      this.hint_index = 0;
    }
    if (this.hint_index >= tiles_having_matches.length) {
      // BONK
    } {
      var hintables = tiles_having_matches[this.hint_index];
      if (hintables) {
        $(hintables[0].get('view')).addClass('hinted');
        for (var i = 0; i < hintables[1].length; i++) {
          $(hintables[1][i].get('view')).addClass('hinted');
        }
      }
    }
  },
  clear_hint: function() {
    if (this.hint_index == null) {
      return;
    }
    var tiles_having_matches = this.boardStatus.get('tiles_having_matches');
    if (this.hint_index < tiles_having_matches.length) {
      var hintables = tiles_having_matches[this.hint_index];
      $(hintables[0].get('view')).removeClass('hinted');
      for (var i = 0; i < hintables[1].length; i++) {
        $(hintables[1][i].get('view')).removeClass('hinted');
      }
    }
    this.hint_index = null;
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
  position_tile: function(positioned_tile) {
    // Position, Tile? returns PositionedTile?
  },
  generate_board: function() {
    // the dragon board
    var mahjongBoard = $("#mahjongBoard");

    this.compute_sizings();

    this.generate_background(mahjongBoard[0]);
    this.displayBoard(mahjongBoard[0], this.board);
  },
  startGame: function() {
    this.assess_clickability();
    this.boardStatus.startGame();
  },
  refreshBoard: function() {
    this.clearBoard();
    this.generate_board();
    this.assess_clickability();
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
  clearBoard: function() {
    var positioned_tiles = this.getSortedPositionedTiles(this.board);

    for (var i = 0; i < positioned_tiles.length; ++i) {
      this.remove_tile_from_board(positioned_tiles[i]);
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
  undo: function() {
    if (this.boardStatus.get('history').length == 0) {
      // BONK -- nothing to undo
      return;
    }

    // remove everything from the board and from the view
    this.clearBoard();
    this.clear_hint();

    // remove tile from historical area
    var tile_pair = this.boardStatus.get('history').shift();

    // add historical tile pair to board
    this.board.add_tile(tile_pair.get('tile1'));
    this.board.add_tile(tile_pair.get('tile2'));

    // re-write the board
    var mahjongBoard = $("#mahjongBoard");
    this.displayBoard(mahjongBoard[0], this.board);

    this.assess_clickability();
  }
});
