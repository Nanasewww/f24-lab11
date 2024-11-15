import React from 'react';
import { Cell } from './game';

interface Props {
  cell: Cell
}

class BoardCell extends React.Component<Props> {
  render(): React.ReactNode {
    let playable;
    if (this.props.cell.playable) {
      playable = 'playable';
    } else if (this.props.cell.text === 'X') {
      playable = 'player1';
    } else {
      playable = 'player2';
    }
    return (
      <div className={`cell ${playable}`}>{this.props.cell.text}</div>
    )
  }
}

export default BoardCell;