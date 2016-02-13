app.decks = new app.models.Decks();

app.decks.set(
  [
    {
      ID: 1,
      name: 'Standard',
      short_name: 'standard',
      tiles: app.decks.generate_tiles([
        [ app.tiles.where({tile_category: app.tileCategories.wind}),           2, ],
        [ app.tiles.where({tile_category: app.tileCategories.dragon}),         4, ],
        [ app.tiles.where({tile_category: app.tileCategories.character_suit}), 4, ],
        [ app.tiles.where({tile_category: app.tileCategories.bamboo_suit}),    4, ],
        [ app.tiles.where({tile_category: app.tileCategories.circle_suit}),    4, ],
        [ app.tiles.where({tile_category: app.tileCategories.flower}),         2, ],
        [ app.tiles.where({tile_category: app.tileCategories.season}),         2, ],
      ])
    },
  ]
);
