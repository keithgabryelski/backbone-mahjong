app.models.RandomDealer = app.models.Dealer.extend({
  deal: function(deck) {
    var positions = this.getBoardLayoutPositions();
    var tiles = deck.getShuffledTiles();
    var positioned_tiles = [];
    for (var i = 0; i < positions.length; ++i) {
      positioned_tiles.push(new app.models.PositionedTile({
        tile: tiles[i],
        position: positions[i]
      }))
    }
    return this.dealBoard(positioned_tiles);
  },
});
