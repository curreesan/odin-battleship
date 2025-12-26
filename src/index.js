import { GameUI } from "./dom.js";
import { Player } from "./player.js";
import { Ship } from "./ship.js";

class GameController {
  constructor() {
    this.ui = new GameUI();
    this.ui.initGrids();
    this.ui.setComputerGridClickable(false);

    this.ui.showMessage("Click 'New Game' to start the battle!");

    this.ui.newGameBtn.addEventListener("click", () => {
      this.ui.startNewGame();

      this.startNewGame = this.startNewGame.bind(this);
      this.ui.newGameBtn.addEventListener("click", this.startNewGame);

      this.handlePlayerAttack = this.handlePlayerAttack.bind(this);
      this.ui.setAttackHandler(this.handlePlayerAttack);

      this.computerTurn = this.computerTurn.bind(this);
    });
  }

  generateFleet() {
    return [
      new Ship(5), // Carrier
      new Ship(4), // Battleship
      new Ship(3), // Cruiser
      new Ship(3), // Submarine
      new Ship(2), // Destroyer
    ];
  }
  placeShipsRandomly(gameboard) {
    const fleet = this.generateFleet();

    fleet.forEach((ship) => {
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const direction = Math.random() < 0.5 ? "horizontal" : "vertical";

        // placeShip returns true/false — use that
        if (gameboard.placeShip(ship, row, col, direction)) {
          placed = true;
        }
        // If false, loop tries again
      }
    });
  }

  startNewGame() {
    //create players
    this.player = new Player("You", "human");
    this.computer = new Player("AI", "computer");

    //place fleets
    this.placeShipsRandomly(this.player.gameboard);
    this.placeShipsRandomly(this.computer.gameboard);

    //render boards, enable attack
    this.ui.renderBothBoards(this.player, this.computer);
    this.ui.setComputerGridClickable(true);

    //display message
    this.ui.showMessage("Your fleet is ready! Click enemy water to attack");

    //set turn
    this.currentTurn = "player";
  }

  handlePlayerAttack(row, col) {
    //check
    if (!this.player || !this.computer) return;
    if (this.currentTurn !== "player") return;

    if (this.computer.gameboard.trackAttacks[row][col] !== null) {
      this.ui.showMessage("Already attacked there!");
      return;
    }

    const result = this.player.attack(this.computer, row, col);
    this.ui.renderBothBoards(this.player, this.computer);

    if (result === "hit") {
      this.ui.showMessage("HIT!");
    } else {
      this.ui.showMessage("MISS!");
    }

    if (this.computer.gameboard.areAllShipsSunk()) {
      this.ui.showMessage("YOU WIN - ALL SHIPS SUNK!");
      this.ui.setComputerGridClickable(false);
      return;
    }

    //switch computer turn
    this.currentTurn = "computer";
    this.ui.setComputerGridClickable(false);

    setTimeout(() => {
      this.ui.showMessage("Computer's turn");

      setTimeout(() => {
        this.computerTurn();
      }, 1000);
    }, 1500);
  }

  computerTurn() {
    if (this.currentTurn !== "computer") return;

    const result = this.computer.randomAttack(this.player);
    this.ui.renderBothBoards(this.player, this.computer);

    if (result === "hit") {
      this.ui.showMessage("COMPUTER HIT YOUR SHIP");
    } else {
      this.ui.showMessage("COMPUTER MISSED");
    }

    if (this.player.gameboard.areAllShipsSunk()) {
      this.ui.showMessage("GAME OVER - COMPUTER WINS");
      this.ui.setComputerGridClickable(false);
      return;
    }
    //switch player turn

    setTimeout(() => {
      this.currentTurn = "player";
      this.ui.setComputerGridClickable(true);
      this.ui.showMessage("Your turn!");
    }, 2000);
  }
}

new GameController();
