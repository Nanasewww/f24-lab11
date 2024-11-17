package santorini.game;

import santorini.datastructure.Vector2D;
import santorini.gamelogic.AdjacentChecker;
import santorini.gamelogic.AvailableChecker;
import santorini.gamelogic.HeightChecker;
import santorini.gamelogic.PositionValidChecker;
import santorini.gamelogic.ValidChecker;
import santorini.map.Map;
import santorini.map.Space;
import santorini.map.towerblock.DomeBlock;
import santorini.map.towerblock.NormalBlock;

public class GameManager {
    private final Player[] players;
    private final Map map;
    private ValidChecker availableChecker, moveChecker, buildChecker;
    private int currentPlayerId;
    private Player currentPlayer;

    public GameManager(int playerNum) {
        this.players = new Player[playerNum];
        for (int i = 0; i < playerNum; ++i) {
            this.players[i] = new Player(i);
        }
        this.map = new Map();
        initializeCheckers();
        this.currentPlayerId = 0;
        this.currentPlayer = this.players[0];
    }

    public int getCurrentPlayer() {
        return this.currentPlayerId;
    }

    /**
     * Start the chosen player's turn.
     * @param playerIndex The player to start turn.
     * @return {@code true} if the player index is valid
     */
    public void nextTurn() {
        this.currentPlayerId = (this.currentPlayerId + 1) % 2;
        this.currentPlayer = this.players[this.currentPlayerId];
    }

    /**
     * Choose a worker to take pending actions.
     * @param workerIndex The worker to take action.
     * @return {@code true} if the worker index is valid
     */
    public boolean chooseWorker(int workerIndex) {
        if (workerIndex < 0 || workerIndex >= Player.workerNum) {
            return false;
        }
        this.currentPlayer.setCurrentWorker(workerIndex);
        return true;
    }

    /**
     * Move current worker to the given position for initialization.
     * @param target The position to move to.
     * @return {@code true} if the worker successfully moves to target position.
     */
    public boolean initializeWorker(Vector2D target0, Vector2D target1) {
        if (!checkPosition(target0, null, this.availableChecker) || !checkPosition(target1, null, this.availableChecker)) {
            return false;
        }
        this.currentPlayer.moveWorker(0, map.getSpace(target0));
        this.currentPlayer.moveWorker(1, map.getSpace(target1));
        return true;
    }

    /**
     * Move current worker to the given position in a game turn.
     * @param target The position to move to.
     * @return {@code true} if the worker successfully moves to target position.
     */
    public boolean moveWorker(Vector2D target) {
        if (!checkPosition(target, this.currentPlayer.getCurrentWorker().getPosition(), this.moveChecker)) {
            return false;
        }
        this.currentPlayer.moveWorker(map.getSpace(target));
        return true;
    }

    /**
     * Use current worker to build a new block on the given position.
     * @param target The position to move to.
     * @return {@code true} if the worker successfully builds a block.
     */
    public boolean buildBlock(Vector2D target) {
        if (!checkPosition(target, this.currentPlayer.getCurrentWorker().getPosition(), this.buildChecker)) {
            return false;
        }
        Space buildTarget = map.getSpace(target);
        if (buildTarget.getTowerLevel() < 3) {
            buildTarget.buildBlock(new NormalBlock());
        } else {
            buildTarget.buildBlock(new DomeBlock());
        }
        return true;
    }

    /**
     * Check whether the current player wins the game.
     * @return {@code true} if the current player wins.
     */
    public int checkWinCondition() {
        for (int i = 0; i < this.players.length; ++i) {
            if (this.players[i].checkWinCondition()) return i;
        }
        return -1;
    }

    public Map getMap() {
        return this.map;
    }

    private boolean checkPosition(Vector2D target, Space source, ValidChecker checker) {
        return target.checkValid() && 
            checker.checkCondition(source, map.getSpace(target));
    }

    private void initializeCheckers() {
        ValidChecker checker = new PositionValidChecker();
        checker = new AvailableChecker(checker);
        this.availableChecker = checker;

        checker = new AdjacentChecker(checker);
        this.buildChecker = checker;

        checker = new HeightChecker(checker);
        this.moveChecker = checker;
    }
}
