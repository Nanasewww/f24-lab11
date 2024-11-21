interface GameState {
  cells: Cell[];      // The array of all cells on the game board
  player: number;     // The ID of the current player (0 for Player1, 1 for Player2)
  winner: number;     // The ID of the winning player, or -1 if there is no winner yet
  positionX: number;  // The x-coordinate of the current position (if applicable)
  positionY: number;  // The y-coordinate of the current position (if applicable)
  stateText: string;  // The current state of the game as text
}

interface Cell {
  x: number;
  y: number;
  playerId: number;
  workerId: number;
  height: number;
  selected: boolean;
  available: boolean;
}

export type { GameState, Cell }