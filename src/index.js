import { GameUI } from "./dom.js";
import { Player } from "./player.js";
import { Ship } from "./ship.js";

class GameController {
  constructor() {
    this.ui = new GameUI();
    this.ui.initGrids();
    this.ui.setComputerGridClickable(false);
    this.ui.showMessage("Click 'New Game' to start the battle!");

    // Bind methods
    this.startNewGame = this.startNewGame.bind(this);
    this.handlePlayerAttack = this.handlePlayerAttack.bind(this);
    this.computerTurn = this.computerTurn.bind(this);
    this.handleManualPlacement = this.handleManualPlacement.bind(this);
    this.handleRandomPlacement = this.handleRandomPlacement.bind(this);

    // Set attack handler
    this.ui.setAttackHandler(this.handlePlayerAttack);

    // Connect New Game button ONCE
    this.ui.newGameBtn.addEventListener("click", this.startNewGame);
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

    //render empty boards
    this.ui.renderBothBoards(this.player, this.computer);

    //open placement model
    this.ui.openPlacementModal();

    document
      .getElementById("place-ships-btn")
      .addEventListener("click", this.handleManualPlacement);
    document
      .getElementById("random-placement-btn")
      .addEventListener("click", this.handleRandomPlacement);

    //place fleets
    // this.placeShipsRandomly(this.player.gameboard);
    // this.placeShipsRandomly(this.computer.gameboard);

    //render boards, enable attack
    // this.ui.renderBothBoards(this.player, this.computer);
    // this.ui.setComputerGridClickable(true);

    //display message
    // this.ui.showMessage("Your fleet is ready! Click enemy water to attack");

    //set turn
    // this.currentTurn = "player";
  }

  handleRandomPlacement(e) {
    e.preventDefault();
    this.placeShipsRandomly(this.player.gameboard);
    this.startBattle();
  }

  handleManualPlacement(e) {
    e.preventDefault();

    const shipsContainer = document.getElementById("ships-container");
    const entries = shipsContainer.querySelectorAll(".ship-entry");
    const lengths = [5, 4, 3, 3, 2]; // order must match form

    let allValid = true;
    const placements = [];

    entries.forEach((entry, index) => {
      const rowInput = entry.querySelector(".row");
      const colInput = entry.querySelector(".col");
      const directionSelect = entry.querySelector(".direction");

      const row = parseInt(rowInput.value);
      const col = parseInt(colInput.value);
      const direction = directionSelect.value;

      // Validate input
      if (
        !rowInput.value ||
        !colInput.value ||
        isNaN(row) ||
        isNaN(col) ||
        row < 1 ||
        row > 10 ||
        col < 1 ||
        col > 10
      ) {
        allValid = false;
        entry.style.border = "2px solid red";
        return;
      }

      entry.style.border = "2px solid green";

      placements.push({
        ship: new Ship(lengths[index]),
        row: row - 1, // convert 1-10 to 0-9
        col: col - 1,
        direction,
      });
    });

    if (!allValid) {
      this.ui.showPlacementError(
        "Please fix invalid entries (Row/Col must be 1-10)"
      );
      return;
    }

    // Try to place all ships
    for (const p of placements) {
      if (!this.player.gameboard.placeShip(p.ship, p.row, p.col, p.direction)) {
        this.ui.showPlacementError(
          "Invalid placement — ships overlap or out of bounds!"
        );
        return;
      }
    }

    // Success!
    this.startBattle();
  }
  handleRandomPlacement(e) {
    e.preventDefault();
    this.placeShipsRandomly(this.player.gameboard);
    this.startBattle();
  }

  handleManualPlacement(e) {
    e.preventDefault();

    const shipsContainer = document.getElementById("ships-container");
    const entries = shipsContainer.querySelectorAll(".ship-entry");
    const lengths = [5, 4, 3, 3, 2]; // order must match form

    let allValid = true;
    const placements = [];

    entries.forEach((entry, index) => {
      const rowInput = entry.querySelector(".row");
      const colInput = entry.querySelector(".col");
      const directionSelect = entry.querySelector(".direction");

      const row = parseInt(rowInput.value);
      const col = parseInt(colInput.value);
      const direction = directionSelect.value;

      // Validate input
      if (
        !rowInput.value ||
        !colInput.value ||
        isNaN(row) ||
        isNaN(col) ||
        row < 1 ||
        row > 10 ||
        col < 1 ||
        col > 10
      ) {
        allValid = false;
        entry.style.border = "2px solid red";
        return;
      }

      entry.style.border = "2px solid green";

      placements.push({
        ship: new Ship(lengths[index]),
        row: row - 1, // convert 1-10 to 0-9
        col: col - 1,
        direction,
      });
    });

    if (!allValid) {
      this.ui.showPlacementError(
        "Please fix invalid entries (Row/Col must be 1-10)"
      );
      return;
    }

    // Try to place all ships
    for (const p of placements) {
      if (!this.player.gameboard.placeShip(p.ship, p.row, p.col, p.direction)) {
        this.ui.showPlacementError(
          "Invalid placement — ships overlap or out of bounds!"
        );
        return;
      }
    }

    // Success!
    this.startBattle();
  }

  startBattle() {
    this.ui.closePlacementModal();

    // Place computer's ships randomly
    this.placeShipsRandomly(this.computer.gameboard);

    // Render both boards
    this.ui.renderBothBoards(this.player, this.computer);

    // Enable attacks
    this.ui.setComputerGridClickable(true);
    this.currentTurn = "player";
    this.ui.showMessage("Fleet ready! Your turn — attack the enemy!");
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
