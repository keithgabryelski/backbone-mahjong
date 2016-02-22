app.models.AudioBoard = Backbone.Model.extend({
  defaults: {
    first_tile_selected: null,
    tile_pair_selected: null,
    bonk: null,
    game_over_fail: null,
    game_over_success: null,
    start_game: null,
    undo: null,
    undo_selection: null
  },
  set_volume: function(volume) {
    var audios = app.audioBoard.values();
    for (var i = 0; i < audios.length; ++i) {
      audios[i].volume = volume;
    }
  },
  play: function(audio) {
    audio.play();
  },
  play_first_tile_selected: function() {
    this.play(this.get('first_tile_selected'));
  },
  play_tile_pair_selected: function() {
    this.play(this.get('tile_pair_selected'));
  },
  play_bonk: function() {
    this.play(this.get('bonk'));
  },
  play_game_over_fail: function() {
    this.play(this.get('game_over_fail'));
  },
  play_undo: function() {
    this.play(this.get('undo'));
  },
  play_undo_selection: function() {
    this.play(this.get('undo_selection'));
  },
  play_start_game: function() {
    this.play(this.get('start_game'));
  },
});
