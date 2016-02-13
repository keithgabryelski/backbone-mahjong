app.tiles = new app.models.Tiles();

app.tiles.set(
  [
    // honor tiles
    // winds
    { ID: 1, name: 'East Wind',  short_name: 'east_wind',  tile_category: app.tileCategories.wind, value: "&#x1F000;" },
    { ID: 2, name: 'South Wind', short_name: 'south_wind', tile_category: app.tileCategories.wind, value: "&#x1F001;" },
    { ID: 3, name: 'West Wind',  short_name: 'west_wind',  tile_category: app.tileCategories.wind, value: "&#x1F002;" },
    { ID: 4, name: 'North Wind', short_name: 'north_wind', tile_category: app.tileCategories.wind, value: "&#x1F003;" },

    // dragon (or arrow) tiles
    { ID: 5, name: 'Red Dragon',   short_name: 'red_dragon',   tile_category: app.tileCategories.dragon, value: "&#x1F004;" },
    { ID: 6, name: 'Green Dragon', short_name: 'green_dragon', tile_category: app.tileCategories.dragon, value: "&#x1F005;" },
    { ID: 7, name: 'White Dragon', short_name: 'white_dragon', tile_category: app.tileCategories.dragon, value: "&#x1F006;" },

    // suited tiles
    // character tiles
    { ID: 8,  name: 'One of Characters',   short_name: 'one_of_characters',   tile_category: app.tileCategories.character_suit, value: "&#x1F007;" },
    { ID: 9,  name: 'Two of Characters',   short_name: 'two_of_characters',   tile_category: app.tileCategories.character_suit, value: "&#x1F008;" },
    { ID: 10, name: 'Three of Characters', short_name: 'three_of_characters', tile_category: app.tileCategories.character_suit, value: "&#x1F009;" },
    { ID: 11, name: 'Four of Characters',  short_name: 'four_of_characters',  tile_category: app.tileCategories.character_suit, value: "&#x1F00A;" },
    { ID: 12, name: 'Five of Characters',  short_name: 'five_of_characters',  tile_category: app.tileCategories.character_suit, value: "&#x1F00B;" },
    { ID: 13, name: 'Six of Characters',   short_name: 'six_of_characters',   tile_category: app.tileCategories.character_suit, value: "&#x1F00C;" },
    { ID: 14, name: 'Seven of Characters', short_name: 'seven_of_characters', tile_category: app.tileCategories.character_suit, value: "&#x1F00D;" },
    { ID: 15, name: 'Eight of Characters', short_name: 'eight_of_characters', tile_category: app.tileCategories.character_suit, value: "&#x1F00E;" },
    { ID: 16, name: 'Nine of Characters',  short_name: 'nine_of_characters',  tile_category: app.tileCategories.character_suit, value: "&#x1F00F;" },

    // bamboo tiles
    { ID: 17, name: 'One of Bamboos',   short_name: 'one_of_bamboos',   tile_category: app.tileCategories.bamboo_suit, value: "&#x1F010;" },
    { ID: 18, name: 'Two of Bamboos',   short_name: 'two_of_bamboos',   tile_category: app.tileCategories.bamboo_suit, value: "&#x1F011;" },
    { ID: 19, name: 'Three of Bamboos', short_name: 'three_of_bamboos', tile_category: app.tileCategories.bamboo_suit, value: "&#x1F012;" },
    { ID: 20, name: 'Four of Bamboos',  short_name: 'four_of_bamboos',  tile_category: app.tileCategories.bamboo_suit, value: "&#x1F013;" },
    { ID: 21, name: 'Five of Bamboos',  short_name: 'five_of_bamboos',  tile_category: app.tileCategories.bamboo_suit, value: "&#x1F014;" },
    { ID: 22, name: 'Six of Bamboos',   short_name: 'six_of_bamboos',   tile_category: app.tileCategories.bamboo_suit, value: "&#x1F015;" },
    { ID: 23, name: 'Seven of Bamboos', short_name: 'seven_of_bamboos', tile_category: app.tileCategories.bamboo_suit, value: "&#x1F016;" },
    { ID: 24, name: 'Eight of Bamboos', short_name: 'eight_of_bamboos', tile_category: app.tileCategories.bamboo_suit, value: "&#x1F017;" },
    { ID: 25, name: 'Nine of Bamboos',  short_name: 'nine_of_bamboos',  tile_category: app.tileCategories.bamboo_suit, value: "&#x1F018;" },

    // circle tiles
    { ID: 17, name: 'One of Circles',   short_name: 'one_of_circles',   tile_category: app.tileCategories.circle_suit, value: "&#x1F019;" },
    { ID: 18, name: 'Two of Circles',   short_name: 'two_of_circles',   tile_category: app.tileCategories.circle_suit, value: "&#x1F01A;" },
    { ID: 19, name: 'Three of Circles', short_name: 'three_of_circles', tile_category: app.tileCategories.circle_suit, value: "&#x1F01B;" },
    { ID: 20, name: 'Four of Circles',  short_name: 'four_of_circles',  tile_category: app.tileCategories.circle_suit, value: "&#x1F01C;" },
    { ID: 21, name: 'Five of Circles',  short_name: 'five_of_circles',  tile_category: app.tileCategories.circle_suit, value: "&#x1F01D;" },
    { ID: 22, name: 'Six of Circles',   short_name: 'six_of_circles',   tile_category: app.tileCategories.circle_suit, value: "&#x1F01E;" },
    { ID: 23, name: 'Seven of Circles', short_name: 'seven_of_circles', tile_category: app.tileCategories.circle_suit, value: "&#x1F01F;" },
    { ID: 24, name: 'Eight of Circles', short_name: 'eight_of_circles', tile_category: app.tileCategories.circle_suit, value: "&#x1F020;" },
    { ID: 25, name: 'Nine of Circles',  short_name: 'nine_of_circles',  tile_category: app.tileCategories.circle_suit, value: "&#x1F021;" },

    // flowers
    { ID: 26, name: 'Plum',           short_name: 'plum_flower',          tile_category: app.tileCategories.flower, value: "&#x1F022;" },
    { ID: 27, name: 'Orchid',         short_name: 'orchid_flower',        tile_category: app.tileCategories.flower, value: "&#x1F023;" },
    { ID: 28, name: 'Bamboo',         short_name: 'bamboo_flower',        tile_category: app.tileCategories.flower, value: "&#x1F024;" },
    { ID: 29, name: 'Chrysanthemum',  short_name: 'chrysanthemum_flower', tile_category: app.tileCategories.flower, value: "&#x1F025;" },

    // seasons
    { ID: 30, name: 'Spring', short_name: 'spring_season', tile_category: app.tileCategories.season, value: "&#x1F026;" },
    { ID: 31, name: 'Summer', short_name: 'summer_season', tile_category: app.tileCategories.season, value: "&#x1F027;" },
    { ID: 32, name: 'Autumn', short_name: 'autumn_season', tile_category: app.tileCategories.season, value: "&#x1F028;" },
    { ID: 33, name: 'Winter', short_name: 'winter_season', tile_category: app.tileCategories.season, value: "&#x1F029;" },

    // joker
    { ID: 34, name: 'Joker', short_name: 'joker', tile_category: app.tileCategories.joker, value: "&#x1F02A;" },

    // back
    { ID: 35, name: 'Back', short_name: 'back', tile_category: app.tileCategories.back, value: "&#x1F02B;" },
  ]
);
