app.models.Deck = Backbone.Model.extend({
  defaults: {
    honorTiles: {
      category_name: 'honor',
      matches: 'category',
      tiles: [
        {
          name: 'east',
          unicode: "&#x1F000;",
        },
        {
          name: 'south',
          unicode: "&#x1F001;",
        },
        {
          name: 'west',
          unicode: "&#x1F002;",
        },
        {
          name: 'north',
          unicode: "&#x1F003;",
        }
      ]
    },
    dragonTiles: {
      category_name: 'dragon', // arrow
      matches: 'exact',
      tiles: [
        {
          name: 'red',
          unicode: "&#x1F004;",
        },
        {
          name: 'green',
          unicode: "&#x1F005;",
        },
        {
          name: 'white',
          unicode: "&#x1F006;",
        }
      ]
    },
    characterTiles: {
      category_name: 'character',
      matches: 'exact',
      tiles: [
        {
          name: 'one of characters',
          unicode: "&#x1F007;"
        },
        {
          name: 'two of characters',
          unicode: "&#x1F008;"
        },
        {
          name: 'three of characters',
          unicode: "&#x1F009;"
        },
        {
          name: 'four of characters',
          unicode: "&#x1F00A;"
        },
        {
          name: 'five of characters',
          unicode: "&#x1F00B;"
        },
        {
          name: 'six of characters',
          unicode: "&#x1F00C;"
        },
        {
          name: 'seven of characters',
          unicode: "&#x1F00D;"
        },
        {
          name: 'eight of characters',
          unicode: "&#x1F00E;"
        },
        {
          name: 'nine of characters',
          unicode: "&#x1F00F;"
        },
      ]
    },
    bambooTiles: {
      category_name: 'bamboo',
      matches: 'exact',
      tiles: [
        {
          name: 'one of bamboos',
          unicode: "&#x1F010;"
        },
        {
          name: 'two of bamboos',
          unicode: "&#x1F011;"
        },
        {
          name: 'three of bamboos',
          unicode: "&#x1F012;"
        },
        {
          name: 'four of bamboos',
          unicode: "&#x1F013;"
        },
        {
          name: 'five of bamboos',
          unicode: "&#x1F014;"
        },
        {
          name: 'six of bamboos',
          unicode: "&#x1F015;"
        },
        {
          name: 'seven of bamboos',
          unicode: "&#x1F016;"
        },
        {
          name: 'eight of bamboos',
          unicode: "&#x1F017;"
        },
        {
          name: 'nine of bamboos',
          unicode: "&#x1F018;"
        },
      ],
    },
    circleTiles: {
      category_name: 'circle',
      matches: 'exact',
      tiles: [
        {
          name: 'one of bamboos',
          unicode: "&#x1F019;"
        },
        {
          name: 'two of bamboos',
          unicode: "&#x1F01A;"
        },
        {
          name: 'three of bamboos',
          unicode: "&#x1F01B;"
        },
        {
          name: 'four of bamboos',
          unicode: "&#x1F01C;"
        },
        {
          name: 'five of bamboos',
          unicode: "&#x1F01D;"
        },
        {
          name: 'six of bamboos',
          unicode: "&#x1F01E;"
        },
        {
          name: 'seven of bamboos',
          unicode: "&#x1F01F;"
        },
        {
          name: 'eight of bamboos',
          unicode: "&#x1F020;"
        },
        {
          name: 'nine of bamboos',
          unicode: "&#x1F021;"
        },
      ]
    },
    flowerTiles: {
      category_name: 'flower',
      matches: 'category',
      tiles: [
        {
          name: 'plum',
          unicode: "&#x1F022;"
        },
        {
          name: 'orchid',
          unicode: "&#x1F023;"
        },
        {
          name: 'bamboo',
          unicode: "&#x1F024;"
        },
        {
          name: 'chrysanthemum',
          unicode: "&#x1F025;"
        },
      ]

    },
    seasonTiles: {
      category_name: 'season',
      matches: 'category',
      tiles: [
        {
          name: 'spring',
          unicode: "&#x1F026;"
        },
        {
          name: 'summer',
          unicode: "&#x1F027;"
        },
        {
          name: 'autumn',
          unicode: "&#x1F028;"
        },
        {
          name: 'winter',
          unicode: "&#x1F029;"
        },
      ]
    },
    jokerTiles: {
      category_name: 'joker',
      matches: 'all',
      tiles: [
        {
          name: 'joker',
          unicode: "&#x1F02A;"
        },
      ]
    },
    backTiles: {
      category_name: 'back',
      matches: 'none',
      tiles: [
        {
          name: 'back',
          unicode: "&#x1F02B;"
        },
      ]
    },
  }
});
