app.models.Types = Backbone.Collection.extend({
  constructor: function () {
    app.models.Types.__super__.constructor.apply(this, arguments);
    this.on("add", function(a_type, collection, options) {
      collection[a_type.get('short_name')] = a_type;
    });
  },
});
