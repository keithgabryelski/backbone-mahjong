app.views.splash = Backbone.View.extend({
  template: _.template($("#tpl-splash").html()),

  events: {
    'click': 'splash',
  },
  initialize: function() {
    this.mainTimer = null;
    this.countDownInstance = 3;
    //this.start_timer();
  },

  render: function() {
    var tile = app.decks.standard.getShuffledTiles()[0]
    this.$el.html(this.template());
    var width = $('body').innerWidth() / 3;
    var fontSize = width;
    var depth = fontSize * 0.10;
    var radius = fontSize / 5;
    $('#splash_icon_bottom').
      css({
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 1
      }).
      css({
        fontSize: fontSize,
        borderStyle: "solid",
        borderWidth: "1px 1px " + depth + "px " + depth + "px",
        borderRadius: radius + "px",
      }).
      html(tile.get('value'))
    $('#splash_icon_top').
      addClass("category_" + tile.get('tile_category').get('short_name')).
      addClass("tile_" + tile.get('short_name')).
      css({
        position: "absolute",
        left: $('#splash_icon_bottom')[0].offsetLeft + 14,
        top: $('#splash_icon_bottom')[0].offsetTop - 14,
        zIndex: 2
      }).
      css({
        fontSize: fontSize,
        borderStyle: "solid",
        borderWidth: "1px 1px " + depth + "px " + depth + "px",
        borderRadius: radius + "px",
      }).
      html(tile.get('value'))
    this.delegateEvents();
    return this;
  },

  start_timer: function() {
    var self = this;
    self.mainTimer = setInterval(function() {
      if (--self.countDownInstance <= 0) {
        self.splash();
      }
    }, 1*1000);
  },

  splash: function() {
    //    clearInterval(this.mainTimer);
    this.trigger("splashed");
  }
});
