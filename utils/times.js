Object.assign(Number.prototype, {
  times(f) {
    let x = 0;
    while (x < this) {
      f(x);
      x += 1;
    }
  },
});
