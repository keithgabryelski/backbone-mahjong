var app = (function() {
  var api = {
    views: {},
    models: {},
    logical: {},
    collections: {},
    content: null,
    router: null,
    configuration: null,
    boardLayouts: {},
    tileMatchingStyles: {},
    tileCategories: {},
    tileCategoryGroups: {},
    tiles: {},
    decks: {},
    init: function() {
      this.content = $("#content");
      var the_cookie = new Cookie({id: 'mahjong'});
      if (the_cookie.isEmpty()) {
        this.configuration = new api.models.Configuration();
        the_cookie.set('data', this.configuration.attributes);
        the_cookie.save();
      }
      this.configuration = new api.models.Configuration(the_cookie.get('data'));
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
	  api.router.navigate("configuration");
          window.location.reload();
	})
      }
      return this.splashView;
    },
    configuration: function() {
      if (!this.configurationView) {
	this.configurationView = new api.views.configuration({
	  model: api.configuration
	}).on("play", function() {
	  api.router.navigate("mahjong", true);
	})
      }
      return this.configurationView;
    },
    mahjong: function() {
      if (!this.mahjongView) {
	this.mahjongView = new api.views.mahjong({
	  model: api.configuration
	}).on("quit", function() {
	  api.router.navigate("configuration");
          window.location.reload();
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
