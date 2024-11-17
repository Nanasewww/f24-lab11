package santorini.map;

import java.util.Stack;

import santorini.datastructure.Vector2D;
import santorini.game.Worker;
import santorini.map.towerblock.GroundBlock;
import santorini.map.towerblock.TowerBlock;

public class Space {
    private final Vector2D position;
    private final Stack<TowerBlock> tower;
    private Worker occupiedWorker;

    public Space(Vector2D pos) {
        this.position = pos;
        this.tower = new Stack<>();
        this.tower.add(new GroundBlock());
        this.occupiedWorker = null;
    }

    /**
     * Check if the space is not occupied by any worker and its height is not 3
     * @return {@code true} if the space is available
     */
    public boolean checkAvailable() {
        return (this.occupiedWorker == null && tower.peek().checkAvailable());
    }

    /**
     * Build a new block on the Space
     */
    public void buildBlock(TowerBlock newBlock) {
        tower.add(newBlock);
    }

    /**
     * Get thr current building level on the Space
     * @return building level
     */
    public int getTowerLevel() {
        return tower.size() - 1;
    }

    /**
     * @param newWorker new occupied worker
     */
    public void setWorker(Worker newWorker) {
        this.occupiedWorker = newWorker;
    }


    /**
     * @return current occupied worker
     */
    public Worker getWorker() {
        return this.occupiedWorker;
    }

    /**
     * @return the Space's Vector2 position
     */
    public Vector2D getPosition() {
        return this.position;
    }
}
