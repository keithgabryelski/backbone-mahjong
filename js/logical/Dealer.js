app.models.Dealer = Backbone.Model.extend({
  initialize: function(configuration) {
    this.configuration = configuration;
  },
  getBoardLayoutPositions: function() {
    return this.configuration.board_layout().getTilePositions();
  },
  dealBoard: function(positioned_tiles) {
    var board = new app.models.Board({
      board_layout: this.configuration.board_layout(),
      positioned_tiles: []
    })
    var layout_positioned_tiles = board.get('positioned_tiles')
    for (var depth = 0; depth < board.get('board_layout').get('layout').length; ++depth) {
      var board_layer = board.get('board_layout').get('layout')[depth];
      var layer = []
      for (var y = 0; y < board_layer.length; ++y) {
        var board_row = board_layer[y];
        var row = []
        for (var x = 0; x < board_row.length; ++x) {
          row.push(null);
        }
        layer.push(row)
      }
      layout_positioned_tiles.push(layer)
    }

    for (var i = 0; i < positioned_tiles.length; ++i) {
      var positioned_tile = positioned_tiles[i];
      var position = positioned_tile.get('position');
      var layer = position.get('layer');
      var row = position.get('row');
      var column = position.get('column');
      layout_positioned_tiles[layer][row][column] = positioned_tile;
    }
    return board;
  },
});
