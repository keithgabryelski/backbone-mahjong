app.views.splash = Backbone.View.extend({
  template: _.template($("#tpl-splash").html()),

  events: {
    'click': 'splash',
  },
  
  initialize: function() {
    this.mainTimer = null;
    this.countDownInstance = 3;
    this.render();
    this.start_timer();
  },

  render: function() {
    this.$el.html(this.template());
    this.delegateEvents();
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
    clearInterval(this.mainTimer); 
    this.trigger("splashed");
  }
});
