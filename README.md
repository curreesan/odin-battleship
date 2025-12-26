# Battleship Game

A classic Battleship game built with vanilla JavaScript, HTML, and CSS as part of The Odin Project curriculum.

Play against the computer: place your fleet manually or randomly, then take turns attacking the enemy's waters until one fleet is completely sunk.

Live Demo: https://curreesan.github.io/odin-battleship/

## Features

- **10x10 grid** for both player and computer
- **Manual ship placement** via a clean modal (with validation)
- **Random placement** option
- Visual feedback:
  - Gray ships on your board
  - Red hits, white misses
  - Enemy ships hidden (fog of war)
- Turn-based gameplay with computer AI (random but smart — no repeated attacks)
- Responsive messages and game flow
- Win/lose detection with end-game message
- Clean, modular code using classes and separation of concerns

## How to Play

1. Open `index.html` in your browser (preferably with Live Server for module support).
2. Click **"New Game"**.
3. A modal opens — place your 5 ships:
   - Enter **Row** and **Column** (1–10)
   - Choose **Horizontal** or **Vertical**
   - All fields required and validated
4. Click **"Place All Ships"** → game validates no overlaps/out-of-bounds
   - Invalid? Red borders + error message
   - Valid? Modal closes, game begins!
5. Or click **"Random Placement"** to skip manual setup.
6. Click any cell on the **enemy board** (right side) to attack.
7. Computer attacks back after your turn.
8. First to sink all enemy ships wins!
