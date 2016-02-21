app.models.Dealer = Backbone.Model.extend({
  initialize: function(configuration) {
    this.configuration = configuration;
  },
  deal: function(deck, board_layout) {
    var board = new app.models.Board({
      deck: this,
      board_layout: board_layout,
      positioned_tiles: []
    })
    var positioned_tiles = board.get('positioned_tiles')
    var m = 0;
    for (var depth = 0; depth < board.get('board_layout').get('layout').length; ++depth) {
      var board_layer = board.get('board_layout').get('layout')[depth];
      var layer = []
      for (var y = 0; y < board_layer.length; ++y) {
        var board_row = board_layer[y];
        var row = []
        for (var x = 0; x < board_row.length; ++x) {
          if (board_row[x] != 0) {
            row.push(new app.models.PositionedTile({
              tile: deck.get('tiles')[m],
              position: new app.models.Position({
                position: board_row[x],
                column: x,
                row: y,
                layer: depth
              })
            }))
            ++m;
          } else {
            row.push(null);
          }
        }
        layer.push(row)
      }
      positioned_tiles.push(layer)
    }
    // XXX assert m == num tiles in board_layout
    // XXX make sure the deck is large enough to use in this board
    return board;
  },
  get_shuffled_deck: function() {
    var deck = app.decks.standard;
    deck.shuffle();
    return deck;
  },
  build_board: function() {
    return this.deal(this.get_shuffled_deck(), this.configuration.board_layout());
  },
});
