app.models.ImageTilePlug = Backbone.Model.extend({
  GnomeImages: {
    'white_dragon': 'images/gnome/_dragon_white.png',
    'bamboo_flower': 'images/gnome/_flower_bamboo.png',
    'chrysanthemum_flower': 'images/gnome/_flower_chrysanthemum.png',
    'orchid_flower': 'images/gnome/_flower_orchid.png',
    'plum_flower': 'images/gnome/_flower_plum.png',
    'autumn_season': 'images/gnome/_season_autumn.png',
    'spring_season': 'images/gnome/_season_spring.png',
    'summer_season': 'images/gnome/_season_summer.png',
    'winter_season': 'images/gnome/_season_winter.png',
    'one_of_bamboos': 'images/gnome/bamboo_1.png',
    'two_of_bamboos': 'images/gnome/bamboo_2.png',
    'three_of_bamboos': 'images/gnome/bamboo_3.png',
    'four_of_bamboos': 'images/gnome/bamboo_4.png',
    'five_of_bamboos': 'images/gnome/bamboo_5.png',
    'six_of_bamboos': 'images/gnome/bamboo_6.png',
    'seven_of_bamboos': 'images/gnome/bamboo_7.png',
    'eight_of_bamboos': 'images/gnome/bamboo_8.png',
    'nine_of_bamboos': 'images/gnome/bamboo_9.png',
    'blank': 'images/gnome/blank.png',
    'one_of_characters': 'images/gnome/character_1.png',
    'two_of_characters': 'images/gnome/character_2.png',
    'three_of_characters': 'images/gnome/character_3.png',
    'four_of_characters': 'images/gnome/character_4.png',
    'five_of_characters': 'images/gnome/character_5.png',
    'six_of_characters': 'images/gnome/character_6.png',
    'seven_of_characters': 'images/gnome/character_7.png',
    'eight_of_characters': 'images/gnome/character_8.png',
    'nine_of_characters': 'images/gnome/character_9.png',
    'one_of_circles': 'images/gnome/circle_1.png',
    'two_of_circles': 'images/gnome/circle_2.png',
    'three_of_circles': 'images/gnome/circle_3.png',
    'four_of_circles': 'images/gnome/circle_4.png',
    'five_of_circles': 'images/gnome/circle_5.png',
    'six_of_circles': 'images/gnome/circle_6.png',
    'seven_of_circles': 'images/gnome/circle_7.png',
    'eight_of_circles': 'images/gnome/circle_8.png',
    'nine_of_circles': 'images/gnome/circle_9.png',
    'green_dragon': 'images/gnome/dragon_green.png',
    'red_dragon': 'images/gnome/dragon_red.png',
    'east_wind': 'images/gnome/honor_east.png',
    'north_wind': 'images/gnome/honor_north.png',
    'south_wind': 'images/gnome/honor_south.png',
    'west_wind': 'images/gnome/honor_west.png',
  },
  initialize: function(board_div, configuration) {
    this.boardDiv = board_div;
    this.configuration = configuration;
    this.preGame = true;
  },
  prepareToStartGame: function() {
    this.preGame = false;
  },
  prepare_for_board_update: function(board_dimensions, tile_dimensions) {
    this.boardDimensions = board_dimensions;
    this.tileDimensions = tile_dimensions;
    tile_dimensions.tileDepth = tile_dimensions.tileWidth * 0.10;
  },
  disable_tooltip_for_tile: function(tile) {
    $(tile.get('view')).tooltip('hide');
    $(tile.get('view')).tooltip('disable');
  },
  enable_tooltip_for_tile: function(tile) {
    $(tile.get('view')).tooltip('enable');
  },
  erase_tile: function(positioned_tile) {
    this.realize_tile_as_unclickable(positioned_tile);
    $(positioned_tile.get('view')).
      addClass('highlighted').
      removeClass('on_board').
      removeClass('hinted').
      addClass('off_board');
    this.disable_tooltip_for_tile(positioned_tile);
    $(positioned_tile.get('view')).remove();
  },
  get_tile_image: function(tile) {
    var tile_image_path = this.GnomeImages[tile.get('short_name')]
    if (!tile_image_path) {
      tile_image_path = this.GnomeImages['blank']
    }
    var tile_image = $('<img src="' + tile_image_path + '">').
        addClass("tile").
        addClass("category_" + tile.get('tile_category').get('short_name')).
        addClass("tile_" + tile.get('short_name')).
        tooltip({
          title: tile.get('name'),
          delay: {
            show: 2000,
          }
        })
    return tile_image;
  },
  draw_tile: function(positioned_tile) {
    var tile = positioned_tile.get('tile');
    var tile_image = this.get_tile_image(tile);
    var xyz = positioned_tile.get('xyz');
    tile_image.
      addClass("on_board").
      css({
        left: xyz.x + this.tileDimensions.boardSideMargin + (positioned_tile.get('position').get('layer') * this.tileDimensions.tileDepth),
        top: -100, //xyz.y + this.tileDimensions.boardTopBottomMargin - (positioned_tile.get('position').get('layer') * this.tileDimensions.tileDepth),
        zIndex: (-1 * xyz.x) + xyz.y + (xyz.z * 1000), // 1000 := sloppy
        position: 'absolute'
      })

    var outer_image = $("<span>").
        css({
          backgroundSize: "100% 100%",
          width: "25%",
          height: "64px",
        }).appendTo(this.boardDiv);
    tile_image.appendTo(outer_image)
    tile_image = outer_image
    
    this.set_positioned_tile_position(tile_image, positioned_tile);
    this.set_positioned_tile(tile_image[0], positioned_tile);
  },
  set_positioned_tile_position: function(tile_image, positioned_tile) {
    var xyz = positioned_tile.get('xyz');
    if (this.preGame) {
      tile_image.animate({
        top: xyz.y + this.tileDimensions.boardTopBottomMargin - (positioned_tile.get('position').get('layer') * this.tileDimensions.tileDepth),
      }, (Math.random() * 1000) + 1000);
    } else {
      tile_image.css({
        top: xyz.y + this.tileDimensions.boardTopBottomMargin - (positioned_tile.get('position').get('layer') * this.tileDimensions.tileDepth)
      })
    }
  },
  set_positioned_tile: function(tile_image, positioned_tile) {
    positioned_tile.set({view: tile_image});
    jQuery.data(tile_image, 'tile', positioned_tile);
  },
  get_positioned_tile: function(event) {
    return jQuery.data(event.target, 'tile');
  },
  move_tile_to_history: function(positioned_tile)  {
    $(positioned_tile.get('view')).
      css({position: "static"}).css({zIndex: 1, boxShadow: ""})
  },
  realize_tile_as_clickable: function(positioned_tile) {
    $(positioned_tile.get('view')).
      addClass("clickable")
  },
  realize_tile_as_unclickable: function(positioned_tile) {
    $(positioned_tile.get('view')).
      removeClass("clickable")
  },
  realize_tile_as_highlighted: function(positioned_tile) {
    $(positioned_tile.get('view')).
      addClass("highlighted")
  },
  realize_tile_as_unhighlighted: function(positioned_tile) {
    $(positioned_tile.get('view')).
      removeClass("highlighted")
  },
});
