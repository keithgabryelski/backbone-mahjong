Array.prototype.shuffle = function() {
  var m = this.length, t, i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = this[m];
    this[m] = this[i];
    this[i] = t;
  }

  return this;
}
