app.models.UnicodeWithColoredBackTilePlug = app.models.UnicodeTilePlug.extend({
  draw_tile: function(positioned_tile) {
    var tile = positioned_tile.get('tile');
    var xyz = positioned_tile.get('xyz');

    var tile_image = $("<span>").
        css({
          left: xyz.x + this.tileDimensions.boardSideMargin + (positioned_tile.get('position').get('layer') * this.tileDimensions.tileDepth),
          top: -100, //xyz.y + this.tileDimensions.boardTopBottomMargin - (positioned_tile.get('position').get('layer') * this.tileDimensions.tileDepth),
          zIndex: (-1 * xyz.x) + xyz.y + (xyz.z * 1000), // 1000 := sloppy
          position: 'absolute',
        }).
        addClass("tile").
        addClass("on_board").
        tooltip({
          title: tile.get('name'),
          delay: {
            show: 2000,
          }
        });

    var bottom_tile_image = $("<span>").
        addClass("tile_bottom").
        css({
          left: 0,
          top: 0,
          position: 'absolute',
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
        css({
          backgroundColor: "#ff6600",
          boarderColor: "#FF6600 #FF6600 #DD4400 #FF6600",
          color: "#ff6600"
        }).
        html(tile.get('value')).
        appendTo(tile_image);

    var top_tile_image = $("<span>").
        addClass("tile_top").
        addClass("category_" + tile.get('tile_category').get('short_name')).
        addClass("tile_" + tile.get('short_name')).
        css({
          left: 2,
          top: -2,
          position: 'absolute',
        }).
        css({
          fontSize: this.tileDimensions.fontSize,
          lineHeight: this.tileDimensions.lineHeight
        }).
        css({
          borderStyle: "solid",
          borderWidth: "1px 1px " + this.tileDimensions.tileDepth + "px " + this.tileDimensions.tileDepth + "px",
          borderRadius: (this.tileDimensions.tileWidth / 5) + "px",
          boxShadow: "",
        }).
        html(tile.get('value')).
        appendTo(tile_image);
    tile_image.
      appendTo(this.boardDiv);

    this.set_positioned_tile_position(tile_image, positioned_tile);
    this.set_positioned_tile(tile_image[0], positioned_tile);
  },
  set_positioned_tile: function(tile_image, positioned_tile) {
    positioned_tile.set({view: tile_image});
    jQuery.data(tile_image, 'tile', positioned_tile);
  },
  get_positioned_tile: function(event) {
    return (jQuery.data($(event.target).parent()[0], 'tile') || jQuery.data(event.target, 'tile'));
  },
  move_tile_to_history: function(positioned_tile)  {
    $(positioned_tile.get('view')).
      css({position: "static"}).css({zIndex: 1, boxShadow: ""})
  },
});
