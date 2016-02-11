app.views.mahjong = Backbone.View.extend({
  template: _.template($("#tpl-mahjong").html()),
  events: {
    'click button .quit': 'quit',
    'click button .tile': 'tile'
  },
  initialize: function() {
    this.timer = 0;
    this.delegateEvents();
    this.boardLayout = new app.models.BoardLayout().attributes;
    this.deck = new app.models.Deck().attributes;
    this.dealer = new app.models.Dealer();
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

    var deck = this.dealer.shuffle_deck();
    var board = this.dealer.deal_deck(deck);
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
    for (var boardLayer = 0; boardLayer < board.length; ++boardLayer) {
      var layer = board[boardLayer];
      for (var y = 0; y < layer.length; ++y) {
        var row = layer[y];
        for (var x = 0; x < row.length; ++x) {
          var tile = row[x];
          var left = initial_offset + (x * width) - (border * boardLayer);
          var top = initial_offset + (y * height) - (border * boardLayer);
          if (tile != null) {
            switch (tile['position']) {
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
                addClass("category_" + tile['category']).
                addClass("tile_" + tile['name'].replace(' ', '_')).
                css({
                  left: left,
                  top: top,
                  zIndex: boardLayer + 1,
                  position: 'absolute',
                }).
                html(tile['value']).
                appendTo(view)[0];
            if (tile['category'] == 'dragon' && tile['name'] == 'red') {
              $(tile_image).addClass("tilereddragon")
            }
            tile['view'] = tile_image;
            jQuery.data(tile_image, 'tile', tile)
          }
        }
      }
    }
  },
});
