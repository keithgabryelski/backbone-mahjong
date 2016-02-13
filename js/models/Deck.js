app.models.Deck = app.models.Type.extend({
  defaults: {
    tiles: []
  },
  shuffle: function() {
    var array = this.get('tiles')
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  },
  deal: function(board_layout) {
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
              tile: this.get('tiles')[m],
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
});
