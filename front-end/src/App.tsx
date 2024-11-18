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

let selectedCells: Vector2D[] = [];

class App extends React.Component<Props, GameState> {
  private initialized: boolean = false
  private gameEnd: boolean = false
  private gameState: State = State.Initialize
  private initializeCount: number = 0

  static API_ENDPOINTS = ['/initialize', '/move', '/build']
  
  static ALERT_MESSAGES = [
    'Need two positions to initialize workers!',
    'Need a position to move selected worker!',
    'Need a position to build a tower!',
  ]
  static SELECT_LEN = [2, 1, 1]
  static INSTRUCTIONS = [
    'Select two empty spaces to initialize your workers',
    'Choose a worker and select where it will move to',
    'Select an available space to build a block',
  ]

  /**
   * @param props has type Props
   */
  constructor(props: Props) {
    super(props)
    /**
     * state has type GameState as specified in the class inheritance.
     */
    this.state = { cells: [], player: 0, winner: -1, positionX: 0, positionY: 0 };
  }

  updateState(json: any) {
    this.setState({cells: json['cells'], player: json['player'], winner: json['winner'], positionX: json['positionX'], positionY: json['positionY']});
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
    this.gameState = State.Initialize
    this.initializeCount = 0
    const json = await this.makeApiCall('/newgame')
    this.updateState(json);
  }

  select(x: number, y: number): React.MouseEventHandler {
    return async (e) => {
      e.preventDefault()
      if (this.gameEnd) return
      const maxSelected = this.gameState === State.Initialize ? 2 : 1;
      if (maxSelected === 1) {
        selectedCells = [new Vector2D(x, y)];
      } else {
        const index = selectedCells.findIndex(item => item.equal(x, y));
        if (index !== -1) 
          selectedCells.splice(index, 1)
        else if (selectedCells.length < maxSelected)
          selectedCells.push(new Vector2D(x, y))
      }
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

  handleAction = async (currentState: State): Promise<boolean> => {
    const length = App.SELECT_LEN[currentState]
    if (selectedCells.length === length) {
      var url = `${App.API_ENDPOINTS[currentState]}?`
      for (var i = 0; i < length; ++i) {
        if (i !== 0) url += '&'
        url += `x${i}=${selectedCells[i].getX()}&y${i}=${selectedCells[i].getY()}`
      }
      const json = await this.makeApiCall(url)
      selectedCells = []
      if (json) this.updateState(json)
      else return false
      return true
    } else {
      alert(App.ALERT_MESSAGES[currentState])
      return false
    }
  };
  
  confirm = async () => {
    try {
      switch (this.gameState) {
        case State.Initialize:
          if (await this.handleAction(State.Initialize)) {
            ++this.initializeCount
            if (this.initializeCount >= 2) this.gameState = State.Move
          } else {
            throw new Error("Failed to initialize workers!")
          }
          break
        case State.Move:
          if (await this.handleAction(State.Move))
            this.gameState = State.Build
          else throw new Error("Failed to move worker! Please select valid space.")
          break
        case State.Build:
          if (await this.handleAction(State.Build))
            this.gameState = State.Move
          else throw new Error("Failed to build new block! Please select valid space.")
          break
        default:
          throw new Error('Unknown game state:', this.gameState)
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }
  

  chooseWorker(index: number): React.MouseEventHandler {
    return async (e) => {
      e.preventDefault();
      if (this.gameState !== State.Move) return
      const json = await this.makeApiCall(`/chooseworker?index=${index - 1}`)
      selectedCells = []
      this.updateState(json)
    }
  }

  isAdjacent(x: number, y: number): boolean {
    return Math.abs(x - this.state.positionX) <= 1 
        && Math.abs(y - this.state.positionY) <= 1
  }

  createCell(cell: Cell, index: number): React.ReactNode {
    cell.available = this.gameState === State.Initialize || this.isAdjacent(cell.x, cell.y)
    cell.selected = selectedCells.some(item => item.equal(cell.x, cell.y))
    if (cell.playerId === this.state.player && this.gameState === State.Move) {
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
        <div key={index} id="grid"><a><BoardCell cell={cell} player={this.state.player} positionX={this.state.positionX} positionY={this.state.positionY}></BoardCell></a></div>
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
          <div><text className={`player${this.state.player}-text`}>{`Player ${this.state.player}`}</text><text>{this.state.winner > 0 ? " WINS !!!" : ""}</text></div>
          <div>{this.state.winner > 0 ? "" : App.INSTRUCTIONS[this.gameState]}</div>
        </div>
        <div id="board-buttons-container">
          <div id="board">
            {this.state.cells.map((cell, i) => this.createCell(cell, i))}
          </div>
          <div id="buttons-container">
            <button className="select" onClick={this.newGame}>New Game</button>
            <button className="select" onClick={this.confirm}>Confirm</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
