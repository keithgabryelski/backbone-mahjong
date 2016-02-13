app.tileCategories = new app.models.TileCategories();

app.tileCategories.set(
  [
    { ID: 1,  name: 'Wind',      short_name: 'wind',           tile_category_group: app.tileCategoryGroups.honor, tile_matching_style: app.tileMatchingStyles.category },
    { ID: 2,  name: 'Dragon',    short_name: 'dragon',         tile_category_group: app.tileCategoryGroups.honor, tile_matching_style: app.tileMatchingStyles.exact },
    { ID: 3,  name: 'Character', short_name: 'character_suit', tile_category_group: app.tileCategoryGroups.suit, tile_matching_style: app.tileMatchingStyles.exact },
    { ID: 4,  name: 'Bamboo',    short_name: 'bamboo_suit',    tile_category_group: app.tileCategoryGroups.suit, tile_matching_style: app.tileMatchingStyles.exact },
    { ID: 5,  name: 'Circle',    short_name: 'circle_suit',    tile_category_group: app.tileCategoryGroups.suit, tile_matching_style: app.tileMatchingStyles.exact },
    { ID: 6,  name: 'Flower',    short_name: 'flower',         tile_category_group: app.tileCategoryGroups.flower, tile_matching_style: app.tileMatchingStyles.category },
    { ID: 7,  name: 'Season',    short_name: 'season',         tile_category_group: app.tileCategoryGroups.flower, tile_matching_style: app.tileMatchingStyles.category },
    { ID: 8,  name: 'Animal',    short_name: 'animal',         tile_category_group: app.tileCategoryGroups.flower, tile_matching_style: app.tileMatchingStyles.category },
    { ID: 9,  name: 'Joker',     short_name: 'joker',          tile_category_group: app.tileCategoryGroups.joker, tile_matching_style: app.tileMatchingStyles.all },
    { ID: 10, name: 'Back',      short_name: 'back',           tile_category_group: app.tileCategoryGroups.back, tile_matching_style: app.tileMatchingStyles.none },
  ]
);
