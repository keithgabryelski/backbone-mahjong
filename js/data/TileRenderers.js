app.tileRenderers = new app.models.TileRenderers();

app.tileRenderers.set(
  [
    {
      ID: 1,
      name: 'Basic Tiles',
      short_name: 'unicode',
      rendering_plug_class: app.models.UnicodeTilePlug
    },
    {
      ID: 2,
      name: 'Basic Tiles with Orange Backing',
      short_name: 'unicode_with_colored_back',
      rendering_plug_class: app.models.UnicodeWithColoredBackTilePlug
    },
    {
      ID: 3,
      name: 'China Sage (not fully working)',
      short_name: 'chinasage',
      rendering_plug_class: app.models.CssSpriteTilePlug
    },
    {
      ID: 4,
      name: 'Gnome Tiles',
      short_name: 'gnome',
      rendering_plug_class: app.models.ImageTilePlug
    },
    {
      ID: 5,
      name: 'Enc (not fully working)',
      short_name: 'enc',
      rendering_plug_class: app.models.EncCssSpriteTilePlug
    },
  ]
);
