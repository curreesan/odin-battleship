class GameUI {
  constructor() {
    this.playerGrid = document.getElementById("player-grid");
    this.computerGrid = document.getElementById("computer-grid");
    this.messageArea = document.getElementById("message-area");
    this.newGameBtn = document.getElementById("new-game-btn");

    this.attackHandler = null;
  }

  initGrids() {
    this.createGrid(this.playerGrid, false);
    this.createGrid(this.computerGrid, true);
  }

  createGrid(gridElement, isClickable) {
    gridElement.innerHTML = "";

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.col = col;

        if (isClickable) {
          cell.addEventListener("click", () => {
            if (this.attackHandler) {
              this.attackHandler(row, col);
            }
          });
        }
        gridElement.appendChild(cell);
      }
    }
  }

  setAttackHandler(handler) {
    this.attackHandler = handler;
  }

  showMessage(text) {
    this.messageArea.textContent = text;
  }

  setComputerGridClickable(enabled) {
    const cells = this.computerGrid.querySelectorAll(".cell");
    console.log(cells);
    if (cells.length === 0) return;

    cells.forEach((cell) => {
      cell.style.pointerEvents = enabled ? "auto" : "none";
      cell.style.opacity = enabled ? "1" : "0.7";
    });
  }

  renderBothBoards(player, computer) {
    this.renderPlayerBoard(player.gameboard);
    this.renderComputerBoard(computer.gameboard);
  }

  renderPlayerBoard(gameboard) {
    const cells = this.playerGrid.querySelectorAll(".cell");
    cells.forEach((cell) => {
      this.updateCell(cell, gameboard, true); // true = show ships
    });
  }

  renderComputerBoard(gameboard) {
    const cells = this.computerGrid.querySelectorAll(".cell");
    cells.forEach((cell) => {
      this.updateCell(cell, gameboard, false); // false = hide ships
    });
  }

  updateCell(cell, gameboard, showShips) {
    // Reset classes
    cell.className = "cell";

    // Get coordinates from data attributes
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    // Check if this spot was attacked
    const attackResult = gameboard.trackAttacks[row][col];

    if (attackResult === "hit") {
      cell.classList.add("hit");
    } else if (attackResult === "miss") {
      cell.classList.add("miss");
    }

    // Show ship only on player board, and only if not already hit
    if (
      showShips &&
      gameboard.board[row][col] !== null &&
      attackResult !== "hit"
    ) {
      cell.classList.add("ship");
    }
  }

  startNewGame() {
    this.showMessage("New game started! Ships placing...");
  }
}

export { GameUI };
