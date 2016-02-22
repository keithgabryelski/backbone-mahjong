app.tileRenderers = new app.models.TileRenderers();

app.tileRenderers.set(
  [
    {
      ID: 1,
      name: 'Basic Unicode',
      short_name: 'basic_unicode',
      rendering_plug_class: app.models.BasicUnicodeTilePlug
    },
    {
      ID: 2,
      name: 'Unicode',
      short_name: 'unicode',
      rendering_plug_class: app.models.UnicodeTilePlug
    },
    {
      ID: 3,
      name: 'Unicode with Colored Back',
      short_name: 'unicode_with_colored_back',
      rendering_plug_class: app.models.UnicodeWithColoredBackTilePlug
    },
  ]
);
