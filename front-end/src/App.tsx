import React from 'react';
import './App.css'; // import the css file to enable your styles.
import { GameState, Cell } from './game';
import BoardCell from './Cell';

/**
 * Define the type of the props field for a React component
 */
interface Props { }

class Vector2D {
  private x: number;
  private y: number;
  constructor(x0: number, y0: number) {
    this.x = x0;
    this.y = y0;
  }
  public getX(): number {
    return this.x;
  }
  public getY(): number {
    return this.y;
  }
  public equal(ax: number, ay: number): boolean {
    return ax === this.x && ay === this.y;
  }
}

enum State {
  Initialize = 0,
  Move = 1,
  Build = 2
}

let selectedCell: Vector2D[] = [];

class App extends React.Component<Props, GameState> {
  private initialized: boolean = false
  private gameEnd: boolean = false

  static INSTRUCTIONS = [
    'Select two empty spaces to initialize your workers',
    'Choose a worker and select where it will move to',
    'Select an available space to build a block',
  ]

  symbols: string[] = ['A', 'B']

  /**
   * @param props has type Props
   */
  constructor(props: Props) {
    super(props)
    this.state = { cells: [], player: 0, winner: -1, positionX: 0, positionY: 0, stateText: "Initialize" };
  }

  updateState(json: any) {
    this.setState({cells: json['cells'], player: json['player'], winner: json['winner'], positionX: json['positionX'], positionY: json['positionY'], stateText: json['stateText']});
  }

  makeApiCall = async (url: string) => {
    let json
    try {
      const response = await fetch(url)
      json = await response.json()
    } catch (error) {
      return null
    }
    return json
  }

  /**
   * Use arrow function, i.e., () => {} to create an async function,
   * otherwise, 'this' would become undefined in runtime. This is
   * just an issue of Javascript.
   */
  newGame = async () => {
    this.gameEnd = false
    const json = await this.makeApiCall('/newgame')
    this.updateState(json);
  }

  select(x: number, y: number): React.MouseEventHandler {
    return async (e) => {
      e.preventDefault()
      if (this.gameEnd) return
      selectedCell = [new Vector2D(x, y)];
      const json = await this.makeApiCall(`/select?x=${x}&y=${y}`)
      this.updateState(json)
    }
  }

  /**
   * play will generate an anonymous function that the component
   * can bind with.
   * @param x 
   * @param y 
   * @returns 
   */
  confirm = async () => {
    try {
      if (selectedCell.length === 1) {
        const url = `action?x=${selectedCell[0].getX()}&y=${selectedCell[0].getY()}`
        const json = await this.makeApiCall(url)
        selectedCell = []
        if (json) this.updateState(json)
      } else throw new Error("Please select a space!")
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }
  
  chooseWorker(index: number): React.MouseEventHandler {
    return async (e) => {
      e.preventDefault();
      const json = await this.makeApiCall(`/chooseworker?index=${index - 1}`)
      selectedCell = []
      this.updateState(json)
    }
  }

  createCell(cell: Cell, index: number): React.ReactNode {
    if (cell.playerId === this.state.player) {
      return (
        <div key={index} id="grid">
          <a href='/' onClick={this.chooseWorker(cell.workerId)}>
            <BoardCell cell={cell} player = {this.state.player} positionX={this.state.positionX} positionY={this.state.positionY}></BoardCell>
          </a>
        </div>
      )
    } else if (cell.available && cell.playerId < 0) {
      return (
        <div key={index} id="grid">
          <a href='/' onClick={this.select(cell.x, cell.y)}>
            <BoardCell cell={cell} player = {this.state.player} positionX={this.state.positionX} positionY={this.state.positionY}></BoardCell>
          </a>
        </div>
      )
    } else {
      return (
        <div key={index} id="grid">
          <a>
            <BoardCell cell={cell} player={this.state.player} positionX={this.state.positionX} positionY={this.state.positionY}></BoardCell>
          </a>
        </div>
      )
    }
  }

  /**
   * This function will call after the HTML is rendered.
   * We update the initial state by creating a new game.
   * @see https://reactjs.org/docs/react-component.html#componentdidmount
   */
  componentDidMount(): void {
    /**
     * setState in DidMount() will cause it to render twice which may cause
     * this function to be invoked twice. Use initialized to avoid that.
     */
    if (!this.initialized) {
      this.newGame();
      this.initialized = true;
    }
  }
  getInstruction(): string {
    switch (this.state.stateText) {
      case "Initialize":
        return App.INSTRUCTIONS[0];
      case "Move":
        return App.INSTRUCTIONS[1];
      case "Build":
        return App.INSTRUCTIONS[2];
    }
    return ""
  }

  /**
   * The only method you must define in a React.Component subclass.
   * @returns the React element via JSX.
   * @see https://reactjs.org/docs/react-component.html
   */
  render(): React.ReactNode {
    /**
     * We use JSX to define the template. An advantage of JSX is that you
     * can treat HTML elements as code.
     * @see https://reactjs.org/docs/introducing-jsx.html
     */
    return (
      <div id="game-container">
        <div id="instructions">
          <div>
            <text className={`player${this.state.player}-text`}>
              {`Player ${this.symbols[this.state.player-1]}`}
            </text>
            <text>{this.state.winner > 0 ? " WINS !!!" : ""}</text>
          </div>
          <div>
            {this.state.winner > 0 ? "" : this.getInstruction()}
          </div>
        </div>
        <div id="board-buttons-container">
          <div id="board">
            {this.state.cells.map((cell, i) => this.createCell(cell, i))}
          </div>
          <div id="buttons-container">
            <button className="select" onClick={this.newGame}>New Game</button>
            <button className="select" onClick={this.confirm}>{this.state.stateText}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
