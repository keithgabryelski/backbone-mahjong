var app = (function() {
  var api = {
    views: {},
    models: {},
    collections: {},
    content: null,
    router: null,
    configuration: null,
    init: function() {
      this.content = $("#content");
      this.configuration = new api.models.Configuration();
      Backbone.history.start();
      return this;
    },
    changeContent: function(el) {
      this.content.empty().append(el);
      return this;
    },
    title: function(str) {
      $("h1").text(str);
      return this;
    }
  };

  var ViewsFactory = {
    splash: function() {
      if (!this.splashView) {
	this.splashView = new api.views.splash({
	  el: $("#content") 
	}).on("splashed", function() {
	  api.router.navigate("configuration", {trigger: true});
	})
      }
      return this.splashView;
    },
    configuration: function() {
      if (!this.configurationView) {
	this.configurationView = new api.views.configuration({
	  model: api.configuration
	}).on("play", function() {
	  api.router.navigate("mahjong", {trigger: true});
	})
      }
      return this.configurationView;
    },
    mahjong: function() {
      if (!this.mahjongView) {
	this.mahjongView = new api.views.mahjong({
	  model: api.configuration
	}).on("quit", function() {
	  api.router.navigate("configuration", {trigger: true});
	})
      }
      return this.mahjongView;
    },
  };

  var Router = Backbone.Router.extend({
    routes: {
      "splash": "splash",
      "configuration": "configuration",
      "mahjong": "mahjong",
      "": "splash"
    },
    splash: function() {
      var view = ViewsFactory.splash();
      api.title("Mahjong Splash").changeContent(view.$el);
      //XXX render is done in the initializer --- ooops
      view.render();
    },
    configuration: function() {
      var view = ViewsFactory.configuration();
      api.title("Mahjong Configuration").changeContent(view.$el);
      view.render();
    },
    mahjong: function() {
      var view = ViewsFactory.mahjong();
      api.title("Mahjong").changeContent(view.$el);
      view.render();
    },
  });
  api.router = new Router();

  return api;

})();
