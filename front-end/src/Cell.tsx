import React from 'react';
import { Cell } from './game';

interface Props {
  cell: Cell
}

class BoardCell extends React.Component<Props> {
  symbols: string[] = ['A', 'B']
  
  render(): React.ReactNode {
    let style = ''
    const id = this.props.cell.playerId
    if (id > 0) {
      style = 'player' + this.props.cell.playerId
    } else {
      style = this.props.cell.selected? 'selected': 'unselected'
    }
    return (
      <div className={`cell ${style}`}>{this.props.cell.text}</div>
    )
  }
}

export default BoardCell;