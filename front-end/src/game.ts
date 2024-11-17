interface GameState {
  cells: Cell[];
  player: number;
  winner: number;
}

interface Cell {
  x: number;
  y: number;
  playerId: number;
  selected: boolean;
  text: string;
}

export type { GameState, Cell }