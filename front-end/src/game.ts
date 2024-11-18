interface GameState {
  cells: Cell[];
  player: number;
  winner: number;
  positionX: number;
  positionY: number;
}

interface Cell {
  x: number;
  y: number;
  playerId: number;
  workerId: number;
  height: number;
  selected: boolean;
  available: boolean;
  text: string;
}

export type { GameState, Cell }