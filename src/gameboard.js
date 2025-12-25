import { Ship } from "../src/ship.js";

class Gameboard {
  constructor() {
    this.board = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
  }
  //place ships at specific coordinates by calling the ship factory or class.
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
    }
  }
  //receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
  receiveAttack() {}
  //keep track of missed attacks so they can display them properly.
  //should be able to report whether or not all of their ships have been sunk.
}

export { Gameboard };

const board = new Gameboard();
// console.log(board);
const ship = new Ship(4);
console.log(ship);
board.placeShip(ship, 0, 0, "horizontal");
