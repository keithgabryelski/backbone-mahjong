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
    instructions: function() {
      if (!this.instructionsView) {
	this.instructionsView = new api.views.instructions({
        }).on("back", function() {
	  api.router.navigate("configuration");
          window.location.reload();
	})
      }
      return this.instructionsView;
    },
    tile_set_gallery: function() {
      if (!this.tileSetGalleryView) {
	this.tileSetGalleryView = new api.views.tile_set_gallery({
        }).on("back", function() {
	  api.router.navigate("configuration");
          window.location.reload();
	})
      }
      return this.tileSetGalleryView;
    },
  };

  var Router = Backbone.Router.extend({
    routes: {
      "splash": "splash",
      "configuration": "configuration",
      "mahjong": "mahjong",
      "instructions": "instructions",
      "tile_set_gallery": "tile_set_gallery",
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
    instructions: function() {
      var view = ViewsFactory.instructions();
      api.title("Mahjong Solitaire Instructions").changeContent(view.$el);
      view.render();
    },
    tile_set_gallery: function() {
      var view = ViewsFactory.tile_set_gallery();
      api.title("Mahjong Solitaire Tile Set Gallery").changeContent(view.$el);
      view.render();
    },
  });
  api.router = new Router();

  return api;

})();
