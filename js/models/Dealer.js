app.models.Dealer = Backbone.Model.extend({
  boardLayout: null,
  deck: null,
  initialize: function() {
    this.boardLayout = new app.models.BoardLayout().attributes;
    this.deck = new app.models.Deck().attributes;
  },
  shuffle_deck: function() {
    var deck = [];
    // 144
    var deck_spread = {
      honorTiles: 2, // 8
      dragonTiles: 4, // 12
      characterTiles: 4, // 36
      bambooTiles: 4, // 36
      circleTiles: 4, // 36
      flowerTiles: 2, // 8
      seasonTiles: 2, // 8
    }
    for (tile_name in deck_spread) {
      var m = deck_spread[tile_name];
      var tiles = [];
      for (index in this.deck[tile_name]['tiles']) {
        var tile = this.deck[tile_name]['tiles'][index]
        var tile_data = {
          name: tile['name'],
          value: tile['unicode'],
          category: this.deck[tile_name]['category_name'],
          matches: this.deck[tile_name]['matches']
        }
        tiles = tiles.concat(tile_data)
      }
      for (var n = 0; n < m; ++n) {
        deck = deck.concat(tiles)
      }
    }
    return this.shuffle(deck);
  },
  shuffle: function(array) {
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
  deal_deck: function(deck) {
    var board = $.extend(true, [], this.boardLayout.boardLayout)
    var m = 0;
    for (var depth = 0; depth < board.length; ++depth) {
      var board_layer = board[depth];
      for (var y = 0; y < board_layer.length; ++y) {
        var board_row = board_layer[y];
        for (var x = 0; x < board_row.length; ++x) {
          if (board_row[x] != 0) {
            board_row[x] = {
              name: deck[m]['name'],
              value: deck[m]['value'],
              matches: deck[m]['matches'],
              category: deck[m]['category'],
              position: board_row[x],
              column: x,
              row: y,
              layer: depth
            }
            ++m;
          } else {
            board_row[x] = null;
          }
        }
      }
    }
    // XXX make sure the deck is large enough to use in this board
    return board;
  },
});
