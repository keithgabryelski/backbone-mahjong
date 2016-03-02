app.dealingStyles = new app.models.DealingStyles();

app.dealingStyles.set(
  [
    {
      ID: 1,
      name: 'Random',
      short_name: 'random',
      description: "Tiles are dealt randoming, some small percentage of boards have no solution",
      dealer_class: app.models.RandomDealer,
    },
    {
      ID: 2,
      name: 'Reverse',
      short_name: 'reverse',
      description: "Tiles are placed on the board in reverse guaranteeing a winnable board but may be derivative (not fully implmented, but working).",
      dealer_class: app.models.ReverseDealer,
    },
    {
      ID: 3,
      name: 'Blind Forward',
      short_name: 'blind-forward',
      description: 'Blank tiles are pulled from the board at random and assign tile pairs, guaranteeing a winnable board.',
      dealer_class: app.models.BlindForwardDealer
    },
    {
      ID: 4,
      name: 'Checked Random',
      short_name: 'checked-random',
      description: 'Tiles are dealt randomly but checked aftwards for winnability (not working).',
      dealer_class: app.models.RandomButCheckedDealer
    },
  ]
);
