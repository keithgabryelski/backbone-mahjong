app.models.BoardLayout = Backbone.Model.extend({
  defaults: {
    name: null,
    image_url: null,
    difficulty: null,
    layout: null,
  },
  getTilePositions: function() {
    var positions = [];
    var layout = this.get('layout');
    for (var depth = 0; depth < layout.length; ++depth) {
      for (var row = 0; row < layout[depth].length; ++row) {
        for (var column = 0; column < layout[depth][row].length; ++column) {
          var position = layout[depth][row][column];
          if (position !== 0) {
            positions.push(new app.models.Position({
              layer: depth,
              row: row,
              column: column,
              position: position
            }))
          }
        }
      }
    }
    return positions;
  },
});
