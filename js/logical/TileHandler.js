app.models.TileHandler = Backbone.Model.extend({
  initialize: function(board, board_status) {
    this.board = board;
    this.boardStatus = board_status;
    this.total_tiles = [];
    this.total_unblocked_tiles = [];
    this.tiles_having_matches = [];
  },
  is_blocked_from_above: function(positioned_tile) {
    var l = positioned_tile.get('position').get('layer')
    var r = positioned_tile.get('position').get('row')
    var c = positioned_tile.get('position').get('column')
    var p = positioned_tile.get('position').get('position')

    var search = [
      [l+1, r, c, 8+4+2+1]
    ]

    switch (p) {
    case 8:
      search.push([l+1, r-1, c-1,    1])
      search.push([l+1, r-1, c,    2+1])
      search.push([l+1, r,   c-1,  4+1])
      break;
    case 4:
      search.push([l+1, r-1, c,    2+1])
      search.push([l+1, r-1, c+1,    2])
      search.push([l+1, r,   c+1,  8+2])
      break;
    case 2:
      search.push([l+1, r,   c-1,  4+1])
      search.push([l+1, r+1, c-1,    4])
      search.push([l+1, r+1, c+1,  8+4])
      break;
    case 1:
      search.push([l+1, r+1, c,    8+4])
      search.push([l+1, r+1, c+1,    8])
      search.push([l+1, r,   c+1,  8+2])
      break;
    }
    return this.are_tiles_at_these_positions(search)
  },
  are_tiles_at_these_positions: function(search) {
    var positioned_tiles = this.board.get('positioned_tiles')
    var board_depth = positioned_tiles.length
    var board_height = positioned_tiles[0].length
    var board_width = positioned_tiles[0][0].length
    for (var n = 0; n < search.length; ++n) {
      var l = search[n][0]
      var r = search[n][1]
      var c = search[n][2]
      var mask = search[n][3]
      if (l < board_depth && r >= 0 && r < board_height && c >= 0 && c < board_width) {
        if (positioned_tiles[l][r][c]) {
          if (positioned_tiles[l][r][c].get('position').get('position') & mask) {
            return true;
          }
        }
      }
    }
    return false;
  },
  is_blocked_from_the_left: function(positioned_tile) {
    var l = positioned_tile.get('position').get('layer')
    var r = positioned_tile.get('position').get('row')
    var c = positioned_tile.get('position').get('column')
    var p = positioned_tile.get('position').get('position')

    var search = [
    ]

    switch (p) {
    case 8:
      search.push([l, r-1, c-1,   2])
      search.push([l, r,   c-1, 8+2])
      break;
    case 4:
      search.push([l, r-1, c-1,   1])
      search.push([l, r,   c-1, 4+1])
      break;
    case 2:
      search.push([l, r,   c-1, 8+2])
      search.push([l, r+1, c-1,   8])
      break;
    case 1:
      search.push([l, r,   c-1, 4+1])
      search.push([l, r+1, c-1,   1])
      break;
    }

    return this.are_tiles_at_these_positions(search)
  },
  is_blocked_from_the_right: function(positioned_tile) {
    var l = positioned_tile.get('position').get('layer')
    var r = positioned_tile.get('position').get('row')
    var c = positioned_tile.get('position').get('column')
    var p = positioned_tile.get('position').get('position')

    var search = [
    ]

    switch (p) {
    case 8:
      search.push([l, r-1, c+1,   2])
      search.push([l, r,   c+1, 8+2])
      break;
    case 4:
      search.push([l, r-1, c+1,   1])
      search.push([l, r,   c+1, 4+1])
      break;
    case 2:
      search.push([l, r,   c+1, 8+2])
      search.push([l, r+1, c+1,   8])
      break;
    case 1:
      search.push([l, r,   c+1, 4+1])
      search.push([l, r+1, c+1,   1])
      break;
    }

    return this.are_tiles_at_these_positions(search)
  },
  is_tile_unblocked: function(positioned_tile) {
    // can't be blocked from above (half overlay or full overlay)
    // must be unblocked from left or right
    return !this.is_blocked_from_above(positioned_tile) &&
      (!this.is_blocked_from_the_left(positioned_tile) || !this.is_blocked_from_the_right(positioned_tile))
  },
  remove_tile: function(positioned_tile) {
    var tile = $(positioned_tile.get('view')).remove();
    tile.css({position: "static"})
    tile.appendTo($("<td>").prependTo($('tr#scroll')))
    this.board.remove_tile(positioned_tile.get('position'))
  },
  make_tile_clickable: function(positioned_tile) {
    var self = this;
    $(positioned_tile.get('view')).
      addClass("clickable").
      on("click", function(e) { self.tile_click($(e.target)) })
  },
  make_tile_unclickable: function(positioned_tile) {
    $(positioned_tile.get('view')).
      removeClass("clickable").
      off("click")
  },
  assess_clickability: function() {
    var total_tiles = this.board.get_all_positioned_tiles();
    this.boardStatus.set({tiles_on_board: total_tiles})
    var total_unblocked_tiles = [];

    for (var i = 0; i < total_tiles.length; ++i) {
      var tile = total_tiles[i];
      this.make_tile_unclickable(tile);
      if (this.is_tile_unblocked(tile)) {
        this.make_tile_clickable(tile);
        total_unblocked_tiles.push(tile);
      }
    }
    
    var tiles_having_matches = [];
    for (var i = 0; i < total_unblocked_tiles.length; ++i) {
      var tile1 = total_unblocked_tiles[i];
      var matching_tiles = [];
      for (var n = i+1; n < total_unblocked_tiles.length; ++n) {
        var tile2 = total_unblocked_tiles[n];
        if (tile1.is_matching(tile2)) {
          matching_tiles.push(tile2)
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
          // FLASH
          this.remove_tile(highlighted_data);
          this.remove_tile(target_data);
          this.highlighted = null;
          // BLIP
          this.assess_clickability();
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
});
