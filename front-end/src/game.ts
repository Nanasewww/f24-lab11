interface GameState {
  cells: Cell[];
  player: number;
  winner: number;
  positionX: number;
  positionY: number;
  stateText: string;
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