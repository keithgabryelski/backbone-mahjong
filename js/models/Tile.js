app.models.Tile = Backbone.Model.extend({
  TYPES: [
    'honor',
    'dragon',
    'character',
    'bamboo',
    'circle',
    'flower',
    'season',
    'joker',
    'back'
  ],
  defaults: {
    tile_category: null,
    name: null,
    unicode: null,
  }
});
