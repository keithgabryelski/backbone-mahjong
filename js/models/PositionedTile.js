app.models.PositionedTile = Backbone.Model.extend({
  defaults: {
    position: null,
    xyz: null,
    tile: null,
    view: null,                 // ick
  },
  is_matching: function(other_positioned_tile) {
    return this.get('tile').is_matching(other_positioned_tile.get('tile'));
  }
});
