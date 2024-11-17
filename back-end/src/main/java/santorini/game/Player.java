package santorini.game;

import santorini.map.Space;

public class Player {
    public static int workerNum = 2;

    private final Worker[] workers;
    private final int playerId;
    private Worker currentWorker;
    
    public Player(int id) {
        this.workers = new Worker[2];
        this.playerId = id;
        for (int i = 0; i < workerNum; ++i) {
            this.workers[i] = new Worker(id, i);
        }
        this.currentWorker = this.workers[0];
    }

    /**
     * @return a list of workers this player has
     */
    public Worker[] getWorkers() {
        return this.workers;
    }

    /**
     * @param workerIndex current worker's index
     */
    public void setCurrentWorker(int workerIndex) {
        this.currentWorker = this.workers[workerIndex];
    }

    /**
     * @return current chosen worker
     */
    public Worker getCurrentWorker() {
        return this.currentWorker;
    }

    public int getPlayerId() {
        return this.playerId;
    }

    /**
     * Move the current worker to the given Space.
     * This Space should be available for the worker to move.
     * @param target The destination.
     */
    public void moveWorker(Space target) {
        currentWorker.moveToPosition(target);
    }

    public void moveWorker(int id, Space target) {
        this.workers[id].moveToPosition(target);
    }

    /**
     * Check whether the player wins the game.
     * @return {@code true} if the player wins.
     */
    public boolean checkWinCondition() {
        for (Worker worker: this.workers) {
            if (worker.checkWinCondition()) return true;
        }
        return false;
    }  
}
