app.audioBoard = new app.models.AudioBoard();

app.audioBoard.set({
  first_tile_selected: new Audio('audio/select.wav'),
  tile_pair_selected: new Audio('audio/correct-selection.wav'),
  bonk: new Audio('audio/bonk.wav'),
  game_over_fail: new Audio('audio/game-over-fail.wav'),
  game_over_success: new Audio('audio/game-over-success.wav'),
  undo: new Audio('audio/undo.wav'),
  undo_selection: new Audio('audio/undo-selection.wav'),
  start_game: new Audio('audio/start-game.wav')
});
