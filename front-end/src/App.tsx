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

/**
 * Using generics to specify the type of props and state.
 * props and state is a special field in a React component.
 * React will keep track of the value of props and state.
 * Any time there's a change to their values, React will
 * automatically update (not fully re-render) the HTML needed.
 * 
 * props and state are similar in the sense that they manage
 * the data of this component. A change to their values will
 * cause the view (HTML) to change accordingly.
 * 
 * Usually, props is passed and changed by the parent component;
 * state is the internal value of the component and managed by
 * the component itself.
 */
class App extends React.Component<Props, GameState> {
  private initialized: boolean = false;
  private gameState: State = State.Initialize;
  private initializeCount: number = 0;

  static API_ENDPOINTS = ['/initialize', '/move', '/build']
  
  static ALERT_MESSAGES = [
    'Need two positions to initialize workers!',
    'Need a position to move selected worker!',
    'Need a position to build a tower!',
  ]
  static SELECT_LEN = [2, 1, 1]

  /**
   * @param props has type Props
   */
  constructor(props: Props) {
    super(props)
    /**
     * state has type GameState as specified in the class inheritance.
     */
    this.state = { cells: [], player: 0, winner: -1 };
  }

  updateState(json: any) {
    this.setState({cells: json['cells'], player: json['player'], winner: json['winner']});
  }

  makeApiCall = async (url: string) => {
    const response = await fetch(url)
    return await response.json()
  }

  /**
   * Use arrow function, i.e., () => {} to create an async function,
   * otherwise, 'this' would become undefined in runtime. This is
   * just an issue of Javascript.
   */
  newGame = async () => {
    const json = await this.makeApiCall('/newgame')
    this.updateState(json);
  }

  select(x: number, y: number): React.MouseEventHandler {
    return async (e) => {
      e.preventDefault();
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
      if (json) this.updateState(json)
      selectedCells = []
      return true
    } else {
      alert(App.ALERT_MESSAGES[currentState])
      return false
    }
  };
  
  confirm = async () => {
    switch (this.gameState) {
      case State.Initialize:
        if (await this.handleAction(State.Initialize)) {
          if (++this.initializeCount >= 2) this.gameState = State.Move;
        }
        break
  
      case State.Move:
        if (await this.handleAction(State.Move)) {
          this.gameState = State.Build
        }
        break
  
      case State.Build:
        if (await this.handleAction(State.Build)) {
          this.gameState = State.Move
        }
        break
  
      default:
        console.warn('Unknown game state:', this.gameState);
        break
    }
  };
  

  chooseWorker(index: number): React.MouseEventHandler {
    return async (e) => {
      // prevent the default behavior on clicking a link; otherwise, it will jump to a new page.
      e.preventDefault();
      const response = await fetch(`/chooseworker?index=${index}`)
      const json = await response.json();
      this.updateState(json);
    }
  }

  createCell(cell: Cell, index: number): React.ReactNode {
    selectedCells.forEach( (item) => {
      if(item.equal(cell.x, cell.y)) {
        cell.selected = true
      }
    })
    return (
      <div key={index}>
        <a href='/' onClick={this.select(cell.x, cell.y)}>
          <BoardCell cell={cell}></BoardCell>
        </a>
      </div>
    )
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

  checkPlayer(): string {
    if (this.state.winner >= 0) {
      return "Player " + this.state.winner.toString() + " wins!!!";
    }
    else {
      return "Current Player: player " + this.state.player.toString();
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
      <div>
        <div id="board">
          {this.state.cells.map((cell, i) => this.createCell(cell, i))}
        </div>
        <div id="bottombar">
          <button onClick={this.newGame}>New Game</button>
          <button onClick={this.confirm}>Confirm</button>
        </div>
        <div id="bottombar">
          <button onClick={this.chooseWorker(0)}>Worker1</button>
          <button onClick={this.chooseWorker(1)}>Worker2</button>
        </div>
        <div id="instructions">
          <div>=== Instructions ===</div>
          <div>{this.checkPlayer()}</div>
        </div>
      </div>
    );
  }
}

export default App;
