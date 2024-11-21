import React from 'react';
import './App.css'; 
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

let selectedCell: Vector2D[] = [];

class App extends React.Component<Props, GameState> {
  private initialized: boolean = false
  private gameEnd: boolean = false

  static INSTRUCTIONS = [
    'Select an empty space to initialize your worker.',
    'Choose a worker and select moving destination.',
    'Select an available space to build a block.',
  ]

  symbols: string[] = ['A', 'B']

  /**
   * Constructor to initialize the component with props and initial state.
   * @param props Props passed to the component.
   */
  constructor(props: Props) {
    super(props)
    this.state = { cells: [], player: 0, winner: -1, positionX: 0, positionY: 0, stateText: "Initialize" };
  }

  /**
   * Updates the component state with data returned from the API call.
   * @param json The JSON data returned from the API.
   */
  updateState(json: any) {
    this.setState({cells: json['cells'], player: json['player'], winner: json['winner'], positionX: json['positionX'], positionY: json['positionY'], stateText: json['stateText']});
  }

  /**
   * Makes an API call to the specified URL and returns the JSON response.
   * @param url The API endpoint URL.
   * @returns The JSON response or null if an error occurs.
   */
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
   * Starts a new game by calling the `/newgame` API and updating the state.
   */
  newGame = async () => {
    this.gameEnd = false
    const json = await this.makeApiCall('/newgame')
    this.updateState(json);
  }

  /**
   * Handles the selection of a cell and updates the game state accordingly.
   * @param x The x-coordinate of the selected cell.
   * @param y The y-coordinate of the selected cell.
   * @returns A React MouseEventHandler to handle the click event.
   */
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
   * Confirms the action for the selected cell, making an API call to execute it.
   * Resets the selected cell after the action.
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
  
  /**
   * Handles the selection of a worker by its index and updates the state.
   * @param index The index of the selected worker.
   * @returns A React MouseEventHandler to handle the click event.
   */
  chooseWorker(index: number): React.MouseEventHandler {
    return async (e) => {
      e.preventDefault();
      const json = await this.makeApiCall(`/chooseworker?index=${index - 1}`)
      selectedCell = []
      this.updateState(json)
    }
  }

  /**
   * Creates a cell element to render on the board based on its properties.
   * @param cell The cell data.
   * @param index The index of the cell in the grid.
   * @returns A ReactNode representing the cell.
   */
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
   * Called after the component is mounted. Initializes a new game.
   * Ensures this logic runs only once by using the `initialized` flag.
   */
  componentDidMount(): void {
    if (!this.initialized) {
      this.newGame();
      this.initialized = true;
    }
  }

  /**
   * Returns the instruction string based on the current game state.
   * @returns The appropriate instruction string.
   */
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
   * Renders the game UI, including the board, instructions, and buttons.
   * @returns A ReactNode representing the game UI.
   */
  render(): React.ReactNode {
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
