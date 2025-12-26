class Gameboard {
  constructor() {
    this.board = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));

    this.trackAttacks = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));

    this.ships = [];
  }

  placeShip(ship, startRow, startCol, direction) {
    const length = ship.length;

    // check if placement is valid (bounds + no overlap)
    let isValid = true;

    for (let i = 0; i < length; i++) {
      let row, col;

      if (direction === "horizontal") {
        row = startRow;
        col = startCol + i;
      } else if (direction === "vertical") {
        row = startRow + i;
        col = startCol;
      }

      // check bounds
      if (row < 0 || row >= 10 || col < 0 || col >= 10) {
        isValid = false;
        break;
      }

      // check overlap
      if (this.board[row][col] !== null) {
        isValid = false;
        break;
      }
    }

    // place if valid
    if (isValid) {
      for (let i = 0; i < length; i++) {
        let row, col;

        if (direction === "horizontal") {
          row = startRow;
          col = startCol + i;
        } else if (direction === "vertical") {
          row = startRow + i;
          col = startCol;
        }

        this.board[row][col] = ship; // Place ship reference
      }
      this.ships.push(ship);
      return true;
    }
    return false;
  }

  //takes a pair of coordinate
  receiveAttack(row, col) {
    //out of bounds check
    if (row < 0 || row >= 10 || col < 0 || col >= 10) {
      return "out of bounds";
    }

    //already attacked?
    if (this.trackAttacks[row][col] !== null) {
      return "already attacked";
    }

    //if ship present, hit, else track miss
    if (this.board[row][col] !== null) {
      const ship = this.board[row][col];
      ship.hit();
      this.trackAttacks[row][col] = "hit";
      if (ship.isSunk()) {
        return "sunk";
      }
      return "hit";
    } else {
      this.trackAttacks[row][col] = "miss";
      return "miss";
    }
  }

  areAllShipsSunk() {
    if (this.ships.length === 0) return false;

    return this.ships.every((ship) => ship.isSunk());
  }
}

export { Gameboard };
