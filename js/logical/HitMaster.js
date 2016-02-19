// original name: HitMasterMcDragonTile

app.models.HitMaster = Backbone.Model.extend({
  initialize: function(board) {
    this.board = board;
  },
  tilePositionOffsetMatrix: [
    [1,1], [0,1], [1,0], [0,0]
  ],
  hitMatrixOriginX: 3,
  hitMatrixOriginY: 3,
  layerAboveHitMatrix: [
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 1, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  ],
  sameLayerLeftHitMatrix: [
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1,-1,-1, 0, 0, 0 ],
    [ 0, 0, 1,-1,-1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  ],
  sameLayerRightHitMatrix: [
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0,-1,-1, 1, 0, 0 ],
    [ 0, 0, 0,-1,-1, 1, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  ],
  sameLayerHitAreaMatrix: [
    [-1,-1],[ 0,-1],[ 1 -1],
    [-1, 0],        [ 1, 0],
    [-1, 1],[ 0, 1],[ 1, 1],
  ],
  layerAboveHitAreaMatrix: [
    [-1,-1],[ 0,-1],[ 1 -1],
    [-1, 0],[ 0, 0],[ 1, 0],
    [-1, 1],[ 0, 1],[ 1, 1],
  ],
  is_tile_blocked: function(positioned_tile) {
    var l = positioned_tile.get('position').get('layer')
    var r = positioned_tile.get('position').get('row')
    var c = positioned_tile.get('position').get('column')
    var p = positioned_tile.get('position').get('position')

    var translate_x = this.tilePositionOffsetMatrix[Math.log2(p)][0];
    var translate_y = this.tilePositionOffsetMatrix[Math.log2(p)][1];

    var positioned_tiles = this.board.get('positioned_tiles')

    if (this.is_tile_blocked_from_above(positioned_tiles, l, r, c, translate_y, translate_x)) {
      return true;              // blocked from above and you are blocked
    }

    if (!this.is_tile_blocked_from_the_left(positioned_tiles, l, r, c, translate_y, translate_x)) {
      return false;             // not blocked on the left?  great! winner!
    }

    if (!this.is_tile_blocked_from_the_right(positioned_tiles, l, r, c, translate_y, translate_x)) {
      return false;             // not blocked from the right? great! winner!
    }

    return true;                // blocked!
  },
  is_tile_blocked_from_above: function(positioned_tiles, l, r, c, translate_y, translate_x) {
    return this.is_tile_blocked_at_layer(positioned_tiles, this.layerAboveHitMatrix, l+1, r, c, translate_y, translate_x, this.layerAboveHitAreaMatrix);
  },
  is_tile_blocked_from_the_left: function(positioned_tiles, l, r, c, translate_y, translate_x) {
    return this.is_tile_blocked_at_layer(positioned_tiles, this.sameLayerLeftHitMatrix, l, r, c, translate_y, translate_x, this.sameLayerHitAreaMatrix);
  },
  is_tile_blocked_from_the_right: function(positioned_tiles, l, r, c, translate_y, translate_x) {
    return this.is_tile_blocked_at_layer(positioned_tiles, this.sameLayerRightHitMatrix, l, r, c, translate_y, translate_x, this.sameLayerHitAreaMatrix);
  },
  is_tile_blocked_at_layer: function(positioned_tiles, hit_matrix, l, r, c, translate_y, translate_x, hit_area_matrix) {
    for (var i = 0; i < hit_area_matrix.length; ++i) {
      var x = hit_area_matrix[i][0];
      var y = hit_area_matrix[i][1];
      var possible_blocking_tile = undefined;
      try {
        possible_blocking_tile = positioned_tiles[l][r+y][c+x];
      } catch (e) {
        // caught here means we went off the board layout (which is like no tile)
        possible_blocking_tile = undefined;
      }
      if (possible_blocking_tile) {
        var p_l = possible_blocking_tile.get('position').get('layer')
        var p_r = possible_blocking_tile.get('position').get('row')
        var p_c = possible_blocking_tile.get('position').get('column')
        var p_p = possible_blocking_tile.get('position').get('position')
        
        var p_translate_x = this.hitMatrixOriginX - translate_x + (x * 2) + this.tilePositionOffsetMatrix[Math.log2(p_p)][0];
        var p_translate_y = this.hitMatrixOriginY - translate_y + (y * 2) + this.tilePositionOffsetMatrix[Math.log2(p_p)][1];

        if (hit_matrix[p_translate_y][p_translate_x] == 1 ||
            hit_matrix[p_translate_y][p_translate_x+1] == 1 ||
            hit_matrix[p_translate_y+1][p_translate_x] == 1 ||
            hit_matrix[p_translate_y+1][p_translate_x+1] == 1) {
          return true
        }
      }
    }
    return false;
  },
});
