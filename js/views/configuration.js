app.views.configuration = Backbone.View.extend({
  template: _.template($("#tpl-configuration").html()),
  events: {
    'submit': 'play',
    'change #background_selector': 'changeBackground',
    'change #layout_selector': 'changeLayout',
    'change #tile_renderer_selector': 'changeTileRenderer',
    'change #dealing_style_selector': 'changeDealingStyle',
  },
  changeBackground: function(e) {
    $("#background_img")[0].src = app.backgrounds.findWhere({ID: parseInt(e.target.value)}).get('image_url');
  },
  changeLayout: function(e) {
    $("#layout_img")[0].src = app.boardLayouts.findWhere({ID: parseInt(e.target.value)}).get('image_url');
  },
  changeTileRenderer: function(e) {
    $("#tile_renderer_description").text(app.tileRenderers.findWhere({ID: parseInt(e.target.value)}).get('description'));
  },
  changeDealingStyle: function(e) {
    $("#dealing_style_description").text(app.dealingStyles.findWhere({ID: parseInt(e.target.value)}).get('description'));
  },
  initialize: function() {
    this.render();
  },
  render: function(index) {
    this.$el.html(this.template(this.model.toJSON()));
    $("#audio_volume_slider").slider();
    this.delegateEvents();
    return this;
  },
  play: function(e) {
    e.preventDefault();

    var board_layout_id = parseInt(this.$('#layout_selector').val());
    this.model.set({ board_layout_id: board_layout_id})

    var background_id = parseInt(this.$('#background_selector').val());
    this.model.set({ background_id: background_id})

    var tile_renderer_id = parseInt(this.$('#tile_renderer_selector').val());
    this.model.set({ tile_renderer_id: tile_renderer_id})

    var dealing_style_id = parseInt(this.$('#dealing_style_selector').val());
    this.model.set({ dealing_style_id: dealing_style_id })

    var audio_volume = parseInt(this.$('#audio_volume_slider').data('slider').getValue()) / 100.0;
    this.model.set({ audio_volume: audio_volume})

    var the_cookie = new Cookie({id: 'mahjong'});
    the_cookie.set('data', this.model.attributes);
    the_cookie.save();

    app.audioBoard.set_volume(audio_volume);
    this.trigger("play");
  }
});
