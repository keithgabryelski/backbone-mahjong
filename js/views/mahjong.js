app.views.mahjong = Backbone.View.extend({
  template: _.template($("#tpl-mahjong").html()),
  events: {
    'click button .quit': 'quit',
    'click button .tile': 'tile'
  },
  initialize: function() {
    this.timer = 0;
    this.delegateEvents();
    this.tileHandler = null;

    this.intervalId = null;     // 
    this.startTime = null;
  },
  render: function(index) {
    this.$el.html(this.template({status: 'ok', timer: '00:00'}));
    this.generate_board();
  },
  tile: function(e) {
  },
  quit: function(e) {
    e.preventDefault();
    this.trigger("quit");
  },
  generate_board: function() {
    // the dragon board
    var mahjongBoard = $("#mahjongBoard");
    mahjongBoard.attr({
      margin: 8,
      padding: 8,
    }).css({
      border: "3px solid #F86600",
      minHeight: 64 + ( 8 * (43 + 6)),
      minWidth:  64 + (15 * (33 + 6)),
      maxHeight: 64 + (8 * (43 + 6)),
      maxWidth:  64 + (15 * (33 + 6))
    });

    // XXX configuration
    var deck = app.decks.standard;
    deck.shuffle();
    var board_layout = app.boardLayouts.findWhere({ID: 1})
    var board = deck.deal(board_layout);
    this.tileHandler = new app.models.TileHandler(board);
    this.generate_background(mahjongBoard[0]);
    this.show_board(mahjongBoard[0], board);
    this.tileHandler.assess_clickability();
  },
  generate_background: function(view) {
    $("<div>").attr({
      id: "background",
      margin: 8,
      padding: 8,
    }).css({
      background: '#8ec252',    // background color
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: 0,
      minHeight: 64 + ( 8 * (43 + 6)),
      minWidth:  64 + (15 * (33 + 6)),
      maxHeight: 64 + (8 * (43 + 6)),
      maxWidth:  64 + (15 * (33 + 6))
    }).appendTo(view);
  },
  show_board: function(view, board) {
    var initial_offset = 32;
    var border = 6;
    var width = 33 + border;
    var height = 44 + border;

    var positioned_tiles = board.get_all_positioned_tiles()
    for (var i = 0; i < positioned_tiles.length; ++i) {
      var positioned_tile = positioned_tiles[i];
      var position = positioned_tile.get('position');
      var tile = positioned_tile.get('tile');
      var left = initial_offset + (position.get('column') * width) - (border * position.get('layer'));
      var top = initial_offset + (position.get('row') * height) - (border * position.get('layer'));
      switch (position.get('position')) {
      case 1:
        left += (width/2)
        top += (height/2)
        break;
      case 2:
        top += (height/2)
        break;
      case 4:
        left += (width/2)
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
