// original name: HitMasterMcDragonTile

app.models.HitMaster = Backbone.Model.extend({
  initialize: function(board_array) {
    this.boardArray = board_array;
  },
  tilePositionOffsetMatrix: [
    [1,1], [0,1], [1,0], [0,0]
  ],
  hitMatrixOriginX: 3,
  hitMatrixOriginY: 3,
  aboveLayerHitMask: [
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 1, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  ],
  sameLayerLeftHitMask: [
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1,-1,-1, 0, 0, 0 ],
    [ 0, 0, 1,-1,-1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  ],
  sameLayerRightHitMask: [
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
    [-1,-1],[ 0,-1],[ 1,-1],
    [-1, 0],        [ 1, 0],
    [-1, 1],[ 0, 1],[ 1, 1],
  ],
  layerAboveHitAreaMatrix: [
    [-1,-1],[ 0,-1],[ 1,-1],
    [-1, 0],[ 0, 0],[ 1, 0],
    [-1, 1],[ 0, 1],[ 1, 1],
  ],
  isPositionUsable: function(position) {
    var l = position.get('layer')
    var r = position.get('row')
    var c = position.get('column')
    var p = position.get('position')

    var translate_x = this.tilePositionOffsetMatrix[Math.log2(p)][0];
    var translate_y = this.tilePositionOffsetMatrix[Math.log2(p)][1];

    // XXX this should check if holes are made
    var fully_covered = this.isTileFullyCovered(this.boardArray, l-2, r, c, translate_y, translate_x)
    return fully_covered;
  },
  isTileVisible: function(positioned_tile) {
    var l = positioned_tile.get('position').get('layer')
    var r = positioned_tile.get('position').get('row')
    var c = positioned_tile.get('position').get('column')
    var p = positioned_tile.get('position').get('position')

    var translate_x = this.tilePositionOffsetMatrix[Math.log2(p)][0];
    var translate_y = this.tilePositionOffsetMatrix[Math.log2(p)][1];

    return !this.isTileFullyCovered(this.boardArray, l, r, c, translate_y, translate_x);
  },
  isTileBlocked: function(positioned_tile) {
    var l = positioned_tile.get('position').get('layer')
    var r = positioned_tile.get('position').get('row')
    var c = positioned_tile.get('position').get('column')
    var p = positioned_tile.get('position').get('position')

    var translate_x = this.tilePositionOffsetMatrix[Math.log2(p)][0];
    var translate_y = this.tilePositionOffsetMatrix[Math.log2(p)][1];

    var positioned_tiles = this.boardArray;

    if (this.isTileBlockedFromAbove(positioned_tiles, l, r, c, translate_y, translate_x)) {
      return true;              // blocked from above and you are blocked
    }

    if (!this.isTileBlockedFromTheLeft(positioned_tiles, l, r, c, translate_y, translate_x)) {
      return false;             // not blocked on the left?  great! winner!
    }

    return this.isTileBlockedFromTheRight(positioned_tiles, l, r, c, translate_y, translate_x);
  },
  isTileBlockedFromAbove: function(positioned_tiles, l, r, c, translate_y, translate_x) {
    return this.isTileBlockedAtLayer(positioned_tiles, this.aboveLayerHitMask, l+1, r, c, translate_y, translate_x, this.layerAboveHitAreaMatrix);
  },
  isTileBlockedFromTheLeft: function(positioned_tiles, l, r, c, translate_y, translate_x) {
    return this.isTileBlockedAtLayer(positioned_tiles, this.sameLayerLeftHitMask, l, r, c, translate_y, translate_x, this.sameLayerHitAreaMatrix);
  },
  isTileBlockedFromTheRight: function(positioned_tiles, l, r, c, translate_y, translate_x) {
    return this.isTileBlockedAtLayer(positioned_tiles, this.sameLayerRightHitMask, l, r, c, translate_y, translate_x, this.sameLayerHitAreaMatrix);
  },
  isTileBlockedAtLayer: function(positioned_tiles, hit_matrix, l, r, c, translate_y, translate_x, hit_area_matrix) {
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
  isTileFullyCovered: function(positioned_tiles, l, r, c, translate_y, translate_x) {
    var hit_matrix = this.aboveLayerHitMask
    var hit_area_matrix = this.layerAboveHitAreaMatrix
    l += 1
    var hits = 0;
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

        hits += hit_matrix[p_translate_y][p_translate_x]
        hits += hit_matrix[p_translate_y][p_translate_x+1]
        hits += hit_matrix[p_translate_y+1][p_translate_x]
        hits += hit_matrix[p_translate_y+1][p_translate_x+1]
      }
    }
    return hits == 4;
  },
});
