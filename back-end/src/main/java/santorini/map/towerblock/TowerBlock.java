package santorini.map.towerblock;

/**
 * Tower block's interface
 */
public interface TowerBlock {
    /**
     * @return {@code true} if the worker can move on this tower block, or another block can build on it
     */
    public boolean checkAvailable();
}
