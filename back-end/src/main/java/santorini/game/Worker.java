package santorini.game;

import santorini.map.Space;

public class Worker {
    private Space position;
    private final int playerId;
    private final int workerId;

    public Worker(int playerId, int workerId) {
        this.position = null;
        this.playerId = playerId;
        this.workerId = workerId;
    }

    /**
     * @return {@code true} if this worker wins
     */
    public boolean checkWinCondition() {
        return (this.position != null && position.getTowerLevel() == 3);
    }

    /**
     * Move the worker to the target Space and remove the worker from its previous Space
     * @param target moving destination
     */
    public void moveToPosition(Space target) {
        if (this.position != null) position.setWorker(null);
        target.setWorker(this);
        this.position = target;
    }

    /**
     * @return current position
     */
    public Space getPosition() {
        return this.position;
    }

    public int getPlayerId() {
        return this.playerId;
    }

    public int getWorkerId() {
        return this.workerId;
    }
}
