import { Ship } from "../src/ship.js";

// const testShip = new Ship()

test("creates a ship with the given length", () => {
  const ship = new Ship(4);
  expect(ship.length).toBe(4);
});

test("new ship has 0 hits and is not sunk", () => {
  const ship = new Ship(3);
  expect(ship.hitCount).toBe(0);
  expect(ship.isSunk()).toBe(false);
});

test("hit() increases hitCount", () => {
  const ship = new Ship(5);
  ship.hit();
  expect(ship.hitCount).toBe(1);
  ship.hit();
  expect(ship.hitCount).toBe(2);
});

test("ship is not sunk before enough hits", () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(false);
});

test("ship sinks when hits equal length", () => {
  const ship = new Ship(2);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test("ship stays sunk after extra hits", () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  ship.hit(); // now sunk
  ship.hit(); // extra hit
  expect(ship.isSunk()).toBe(true);
});

test("works correctly for length 1 ship", () => {
  const ship = new Ship(1);
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
