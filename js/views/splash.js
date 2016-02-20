app.views.splash = Backbone.View.extend({
  template: _.template($("#tpl-splash").html()),

  events: {
    'click': 'splash',
  },
  initialize: function() {
    this.mainTimer = null;
    this.countDownInstance = 3;
    this.render();
    //this.start_timer();
  },

  render: function() {
    // XXX this is almost correct
    this.$el.html(this.template());
    var width = $('body').innerWidth() / 3;
    var height = width * 4 / 3;
    var depth = width * 0.10;
    var bottom_icon = $('<div>').
        addClass('splash_icon_bottom').
        css({
          left: 0,
          top: 0 + depth,
          zIndex: 1,
          position: 'absolute',
        }).
        css({
          width: width + depth,
          height: height + depth,
        }).css({
          fontSize: width * 1.1,
          lineHeight: 1.1
        }).css({
          borderStyle: "solid",
          borderWidth: "1px 1px " + depth + "px " + depth + "px",
          borderRadius: ((width + (depth * 5)) / 5) + "px",
        }).html("&#x1F000;").appendTo($('#splash_icon'))[0];
    var top_icon = $('<div>').
        addClass('splash_icon_top').
        css({
          left: depth,
          top: depth,
          zIndex: 2,
          position: 'absolute',
        }).
        css({
          width: width,
          height: height,
        }).css({
          fontSize: width * 1.1,
          lineHeight: 1.1
        }).css({
          borderStyle: "solid",
          borderWidth: "1px 1px " + depth + "px " + depth + "px",
          borderRadius: (width / 5) + "px",
        }).html("&#x1F000;").appendTo($('#splash_icon'))[0];

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
