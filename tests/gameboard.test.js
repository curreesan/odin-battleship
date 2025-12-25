import { Gameboard } from "../src/gameboard.js";
import { Ship } from "../src/ship.js";

test("creates a 10x10 board", () => {
  const board = new Gameboard();

  expect(board.board.length).toBe(10); // 10 rows
  expect(board.board[0].length).toBe(10); // each row has 10 columns
  expect(board.board.every((row) => row.length === 10)).toBe(true); // all rows are size 10
});

test("rejects placement out of bounds", () => {
  const gb = new Gameboard();
  const ship = new Ship(4);
  gb.placeShip(ship, 0, 8, "horizontal"); // 8+3=11 → out of bounds
  expect(gb.board[0][8]).toBe(null); // nothing placed
});

test("rejects placement that overlaps with existing ship", () => {
  const gb = new Gameboard();
  const ship1 = new Ship(4);
  const ship2 = new Ship(3);

  gb.placeShip(ship1, 5, 2, "horizontal");
  // Occupies: [5][2], [5][3], [5][4], [5][5]

  // [5][4] and [5][5] are already taken → should be rejected
  gb.placeShip(ship2, 5, 4, "horizontal");

  // Check that the overlapping cells still belong to the FIRST ship
  expect(gb.board[5][4]).toBe(ship1);
  expect(gb.board[5][5]).toBe(ship1);

  // And the new part (that didn't overlap) should NOT be placed
  expect(gb.board[5][6]).toBe(null);
});

test("receiveAttack records a miss", () => {
  const gb = new Gameboard();
  const result = gb.receiveAttack(5, 5);
  expect(result).toBe("miss");
  expect(gb.trackAttacks[5][5]).toBe("miss");
});

test("receiveAttack records a hit and calls ship.hit()", () => {
  const gb = new Gameboard();
  const ship = new Ship(3);
  gb.placeShip(ship, 2, 2, "horizontal");

  const result = gb.receiveAttack(2, 3); // hits second segment
  expect(result).toBe("hit");
  expect(gb.trackAttacks[2][3]).toBe("hit");
  expect(ship.hitCount).toBe(1);
});

test("areAllShipsSunk returns false when no ships placed", () => {
  const gb = new Gameboard();
  expect(gb.areAllShipsSunk()).toBe(false);
});

test("areAllShipsSunk returns false when some ships floating", () => {
  const gb = new Gameboard();
  const ship = new Ship(2);
  gb.placeShip(ship, 0, 0, "horizontal");

  gb.receiveAttack(0, 0); // one hit
  expect(gb.areAllShipsSunk()).toBe(false);
});

test("areAllShipsSunk returns true when all ships sunk", () => {
  const gb = new Gameboard();
  const ship1 = new Ship(2);
  const ship2 = new Ship(1);

  gb.placeShip(ship1, 3, 3, "horizontal");
  gb.placeShip(ship2, 7, 7, "horizontal");

  // Sink ship1
  gb.receiveAttack(3, 3);
  gb.receiveAttack(3, 4);

  // Sink ship2
  gb.receiveAttack(7, 7);

  expect(gb.areAllShipsSunk()).toBe(true);
});
