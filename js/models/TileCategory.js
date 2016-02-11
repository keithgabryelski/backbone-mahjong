app.models.Deck = Backbone.Model.extend({
  MATCHES: [
    'none'
    'exact',
    'category',
    'all'
  ],
  defaults: {
    name: null,
    matches: null,
  }
});
