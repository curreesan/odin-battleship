class Ship {
  constructor(length) {
    this.length = length;
    this.hitCount = 0;
    this._isSunk = false;
  }

  hit() {
    this.hitCount++;
  }

  isSunk() {
    if (this.hitCount >= this.length) {
      this._isSunk = true;
    }
    return this._isSunk;
  }
}

export { Ship };
