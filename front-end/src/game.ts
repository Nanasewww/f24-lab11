interface GameState {
  cells: Cell[];
  player: number;
  winner: number;
}

interface Cell {
  text: string;
  playable: boolean;
  x: number;
  y: number;
}

export type { GameState, Cell }