import { Gameboard } from "../src/gameboard.js";

class Player {
  constructor(name = "player", type = "human") {
    this.name = name;
    this.type = type;
    this.gameboard = new Gameboard();
  }

  attack(opponentPlayer, row, col) {
    return opponentPlayer.gameboard.receiveAttack(row, col);
  }

  randomAttack(opponentPlayer) {
    let row, col;
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    } while (opponentPlayer.gameboard.trackAttacks[row][col] !== null);
    return this.attack(opponentPlayer, row, col);
  }
}

export { Player };
