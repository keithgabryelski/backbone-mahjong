app.tileRenderers = new app.models.TileRenderers();

app.tileRenderers.set(
  [
    {
      ID: 1,
      name: 'Basic Tiles',
      short_name: 'unicode',
      description: "Original tiles using default font",
      rendering_plug_class: app.models.UnicodeTilePlug
    },
    {
      ID: 2,
      name: 'Basic Tiles with Orange Backing',
      short_name: 'unicode_with_colored_back',
      description: "Original tiles with colored backing",
      rendering_plug_class: app.models.UnicodeWithColoredBackTilePlug
    },
    {
      ID: 3,
      name: 'China Sage',
      short_name: 'chinasage',
      description: "Stolen from somewhere on the net, sprite tiles (not fully working)",
      rendering_plug_class: app.models.CssSpriteTilePlug
    },
    {
      ID: 4,
      name: 'Gnome Tiles',
      short_name: 'gnome',
      description: "Individual tiles stolen from Gnome Mahjong game.",
      rendering_plug_class: app.models.ImageTilePlug
    },
    {
      ID: 5,
      name: 'Enc (not fully working)',
      short_name: 'enc',
      description: "Stolen from somewhere on the net, sprite tiles (not fully working)",
      rendering_plug_class: app.models.EncCssSpriteTilePlug
    },
  ]
);
