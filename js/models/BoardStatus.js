app.models.BoardStatus = Backbone.Model.extend({
  defaults: {
    status: "unknown",
    tiles_on_board: [],
    unblocked_tiles: [],
    tiles_having_matches: [],
    timer: 0,
    gameTimer: null
  },
  startGame: function() {
    var self = this;
    this.set({gameTimer: setInterval(function() {
      self.set({timer: self.get('timer') + 1})
    }, 1000)});
  },
  stopGame: function() {
    clearInterval(this.get('gameTimer'));
  }
});
