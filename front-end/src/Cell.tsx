import React from 'react';
import { Cell } from './game';

interface Props {
  cell: Cell
  player: number
  positionX: number
  positionY: number
}

class BoardCell extends React.Component<Props> {
  symbols: string[] = ['A', 'B']
  
  render(): React.ReactNode {
    let style = ''
    const id = this.props.cell.playerId
    if (id > 0) {
      style = 'player' + this.props.cell.playerId
      if (this.props.positionX === this.props.cell.x && this.props.positionY === this.props.cell.y) {
        style += ' chosen'
      }
    } else {
      style = this.props.cell.available? 'avalaible': 'unavailable'
      style = this.props.cell.selected? 'selected player' + this.props.player : style
    }
    return (
      //<div className={`cell ${style}`}>{this.props.cell.text}</div>
      <div className={`cell ${style}`}>
        <div className={`tower tower-${this.props.cell.height}`}></div>
        <div className="player">{this.props.cell.workerId > 0 ? this.symbols[this.props.cell.playerId-1] + this.props.cell.workerId : ""}</div>
        <div className="tower-label">{this.props.cell.height > 0 ? this.props.cell.height : ""}</div>
      </div>
    )
  }
}

export default BoardCell;