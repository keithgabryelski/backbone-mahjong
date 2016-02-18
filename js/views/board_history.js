app.views.boardHistory = Backbone.View.extend({
  template: _.template($("#tpl-board-history").html()),
  
  initialize: function() {
    this.collection.on("add", this.collectionChanged, this);
    this.collection.on("remove", this.collectionChanged, this);
  },
  collectionChanged: function (collection, changes) {
    this.render();
  },
  render: function() {
    this.$el.html(this.template({collection: this.collection}));
    return this;
  },
  processTilePair: function(tile_pair) {
    var tilePairView = new app.views.boardHistoryTilePair({ model: tile_pair });
    tilePairView.render();
    return tilePairView.el;
  }
});
