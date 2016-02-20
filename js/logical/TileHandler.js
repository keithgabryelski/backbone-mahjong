app.models.TileHandler = Backbone.Model.extend({
  initialize: function(board, board_status) {
    this.board = board;
    this.boardStatus = board_status;
    this.hint_index = null;
    this.hitMaster = new app.models.HitMaster(board);
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
      on("click", function(e) { self.tile_click($(e.target)) })
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
          // FLASH
          this.remove_tiles(highlighted_data, target_data);
          this.highlighted = null;
          // BLIP
          this.clear_hint();
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
});
