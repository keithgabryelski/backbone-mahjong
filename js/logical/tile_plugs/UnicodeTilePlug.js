app.models.UnicodeTilePlug = Backbone.Model.extend({
  initialize: function(board_div, configuration) {
    this.boardDiv = board_div;
    this.configuration = configuration;
  },
  prepare_for_board_update: function(board_dimensions, tile_dimensions) {
    this.boardDimensions = board_dimensions;
    this.tileDimensions = tile_dimensions;
    tile_dimensions.fontSize = tile_dimensions.tileWidth * 1.10; // this seems correct except for &#x1f004;
    tile_dimensions.lineHeight = 1.1; // this seems correct
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
  draw_tile: function(positioned_tile) {
    var tile = positioned_tile.get('tile');
    var xyz = positioned_tile.get('xyz');
    var tile_image = $("<div>").
        addClass("tile").
        addClass("category_" + tile.get('tile_category').get('short_name')).
        addClass("tile_" + tile.get('short_name')).
        addClass("on_board").
        css({
          left: xyz.x + this.tileDimensions.boardSideMargin + (positioned_tile.get('position').get('layer') * this.tileDimensions.tileDepth),
          top: -100, //xyz.y + this.tileDimensions.boardTopBottomMargin - (positioned_tile.get('position').get('layer') * this.tileDimensions.tileDepth),
          zIndex: (-1 * xyz.x) + xyz.y + (xyz.z * 1000), // 1000 := sloppy
          position: 'absolute',
        }).
        css({
          width: this.tileDimensions.tileWidth,
          height: this.tileDimensions.tileHeight,
        }).
        css({
          fontSize: this.tileDimensions.fontSize,
          lineHeight: this.tileDimensions.lineHeight
        }).
        css({
          borderStyle: "solid",
          borderWidth: "1px 1px " + this.tileDimensions.tileDepth + "px " + this.tileDimensions.tileDepth + "px",
          borderRadius: (this.tileDimensions.tileWidth / 5) + "px",
        }).
        html(tile.get('value')).
        tooltip({
          title: tile.get('name'),
          delay: {
            show: 2000,
          }
        }).
        appendTo(this.boardDiv)[0];

    $(tile_image).animate({
      top: xyz.y + this.tileDimensions.boardTopBottomMargin - (positioned_tile.get('position').get('layer') * this.tileDimensions.tileDepth),
    }, (Math.random() * 1000) + 1000);

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
