app.decks = new app.models.Decks();

app.decks.set(
  [
    {
      ID: 1,
      name: 'Standard',
      short_name: 'standard',
      tile_sets: new app.models.TileSets([
        {tile_category: app.tileCategories.wind,           num_sets: 4, },
        {tile_category: app.tileCategories.dragon,         num_sets: 4, },
        {tile_category: app.tileCategories.character_suit, num_sets: 4, },
        {tile_category: app.tileCategories.bamboo_suit,    num_sets: 4, },
        {tile_category: app.tileCategories.circle_suit,    num_sets: 4, },
        {tile_category: app.tileCategories.flower,         num_sets: 1, },
        {tile_category: app.tileCategories.season,         num_sets: 1, },
      ])
    },
  ]
);
