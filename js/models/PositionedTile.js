app.models.PositionedTile = Backbone.Model.extend({
  defaults: {
    position: null,
    xyz: null,
    tile: null,
    view: null,                 // ick
  },
  isMatching: function(other_positioned_tile) {
    return this.get('tile').isMatching(other_positioned_tile.get('tile'));
  }
});
