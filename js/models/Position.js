app.models.Position = Backbone.Model.extend({
  defaults: {
    layer: null,
    row: null,
    column: null,
    position: 0,           // 8, 4, 2, 1
  }
});
