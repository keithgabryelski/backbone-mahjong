app.models.TileHandler = Backbone.Model.extend({
  initialize: function(board) {
    this.board = board;
    this.hilighted = null;
    this.total_tiles = 0;
    this.total_matches = 0;
  },
  is_blocked_from_above: function(tile) {
    var l = tile['layer']
    var r = tile['row']
    var c = tile['column']
    var p = tile['position']

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
    return this.do_these_tiles_exist(search)
  },
  do_these_tiles_exist: function(search) {
    var board_depth = this.board.length
    var board_height = this.board[0].length
    var board_width = this.board[0][0].length
    for (var n = 0; n < search.length; ++n) {
      var l = search[n][0]
      var r = search[n][1]
      var c = search[n][2]
      var mask = search[n][3]
      if (l < board_depth && r >= 0 && r < board_height && c >= 0 && c < board_width) {
        if (this.board[l][r][c]) {
          if (this.board[l][r][c]['position'] & mask) {
            return true;
          }
        }
      }
    }
    return false;
  },
  is_blocked_from_the_left: function(tile) {
    var l = tile['layer']
    var r = tile['row']
    var c = tile['column']
    var p = tile['position']

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

    return this.do_these_tiles_exist(search)
  },
  is_blocked_from_the_right: function(tile) {
    var l = tile['layer']
    var r = tile['row']
    var c = tile['column']
    var p = tile['position']

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

    return this.do_these_tiles_exist(search)
  },
  is_tile_unblocked: function(tile) {
    // can't be blocked from above (half overlay or full overlay)
    // must be unblocked from left or right
    return !this.is_blocked_from_above(tile) &&
      (!this.is_blocked_from_the_left(tile) || !this.is_blocked_from_the_right(tile))
  },
  remove_tile: function(tile) {
    $(tile['view']).remove();
    this.board[tile['layer']][tile['row']][tile['column']] = null;
  },
  make_tile_clickable: function(tile) {
    var self = this;
    $(tile['view']).
      addClass("clickable").
      on("click", function(e) { self.tile_click($(e.target)) })
  },
  make_tile_unclickable: function(tile) {
    $(tile['view']).
      removeClass("clickable").
      off("click")
  },
  assess_clickability: function() {
    this.total_tiles = [];
    this.total_unblocked_tiles = [];
    for (var nlayer = 0; nlayer < this.board.length; ++nlayer) {
      var layer = this.board[nlayer];
      for (var nrow = 0; nrow < layer.length; ++nrow) {
        var row = layer[nrow];
        for (var ncolumn = 0; ncolumn < row.length; ++ncolumn) {
          var tile = row[ncolumn];
          if (tile) {
            this.total_tiles.push(tile)
            this.make_tile_unclickable(tile);
            if (this.is_tile_unblocked(tile)) {
              this.make_tile_clickable(tile);
              this.total_unblocked_tiles.push(tile);
            }
          }
        }
      }
    }
    
    this.tiles_having_matches = [];
    for (var i = 0; i < this.total_unblocked_tiles.length; ++i) {
      var tile1 = this.total_unblocked_tiles[i];
      var matching_tiles = []
      for (var n = i+1; n < this.total_unblocked_tiles.length; ++n) {
        var tile2 = this.total_unblocked_tiles[n];
        if (this.are_tiles_matching(tile1, tile2)) {
          matching_tiles.push(tile2)
        }
      }
      if (matching_tiles.length > 0) {
        this.tiles_having_matches.push([tile1, matching_tiles])
      }
    }

    this.set_status();
  },
  set_status: function() {
    $("#tiles_left").text("" + this.total_tiles.length)
    if (this.total_tiles.length == 0) {
      $("#status").text("WINNER!")
    } else if (this.tiles_having_matches.length == 0) {
      $("#status").text("LOSER!")
    } else {
      $("#status").text("Playing... (" + this.tiles_having_matches.length + ")")
    }
  },
  highlight_tile: function(tile) {
  },
  unhighlight_tile: function(tile) {
  },
  are_tiles_matching: function(tile1, tile2) {
    if (tile1['matches'] == 'all' || tile2['matches'] == 'all') {
      return true;
    }
    if (tile1['matches'] == 'none' || tile2['matches'] == 'none') {
      return false;
    }
    if (tile1['matches'] != tile2['matches']) {
      return false;
    }
    if (tile1['matches'] == 'exact') {
      return tile1['value'] == tile2['value'];
    }
    if (tile1['matches'] == 'category') {
      return tile1['category'] == tile2['category'];
    }
    return false;
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
        if (this.are_tiles_matching(highlighted_data, target_data)) {
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
