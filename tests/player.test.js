import { Player } from "../src/player.js";
import { Ship } from "../src/ship.js";

test("creates player with name, type, and own gameboard", () => {
  const player = new Player("TestPlayer", "computer");
  expect(player.name).toBe("TestPlayer");
  expect(player.type).toBe("computer");
  expect(player.gameboard).toBeDefined();
  expect(player.gameboard.board.length).toBe(10);
});

test("human player can attack opponent correctly", () => {
  const human = new Player("Human");
  const computer = new Player("AI");

  const ship = new Ship(2);
  computer.gameboard.placeShip(ship, 0, 0, "horizontal");

  const result = human.attack(computer, 0, 0);

  expect(result).toBe("hit");
  expect(ship.hitCount).toBe(1);
  expect(computer.gameboard.trackAttacks[0][0]).toBe("hit");
});

test("computer randomAttack hits untouched spots only", () => {
  const human = new Player("Human");
  const computer = new Player("AI", "computer");

  // Place a ship so there's a hit already
  const ship = new Ship(1);
  human.gameboard.placeShip(ship, 5, 5, "horizontal");
  human.gameboard.receiveAttack(5, 5); // Pre-hit this spot

  // Computer attacks
  const result = computer.randomAttack(human);

  // Should be a new attack somewhere else
  expect(["hit", "miss"]).toContain(result);

  const attackedCells = human.gameboard.trackAttacks
    .flat()
    .filter((cell) => cell !== null).length;
  expect(attackedCells).toBe(2);
});
