app.models.PositionedTile = Backbone.Model.extend({
  defaults: {
    position: null,
    tile: null,
    view: null,                 // ick
  }
});
