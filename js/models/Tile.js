app.models.Tile = Backbone.Model.extend({
  defaults: {
    tile_category: null,
    name: null,
    short_name: null,
    value: null,
  },
  isMatching: function(other_tile) {
    var this_matching_style = this.get('tile_category').get('tile_matching_style')
    var other_matching_style = other_tile.get('tile_category').get('tile_matching_style')
    if (this_matching_style === app.tileMatchingStyles.all ||
        other_matching_style === app.tileMatchingStyles.all) {
      return true;
    }
    if (this_matching_style === app.tileMatchingStyles.none ||
        other_matching_style === app.tileMatchingStyles.none) {
      return false;
    }
    if (this_matching_style !== other_matching_style) {
      return false;
    }
    if (this_matching_style === app.tileMatchingStyles.exact) {
      return this.get('value') == other_tile.get('value');
    }
    if (this_matching_style === app.tileMatchingStyles.category) {
      return this.get('tile_category') === other_tile.get('tile_category');
    }
    return false;
  }
});
