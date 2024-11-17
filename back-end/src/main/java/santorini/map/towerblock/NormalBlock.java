package santorini.map.towerblock;

public class NormalBlock implements TowerBlock{
    private boolean isAvailable = true;

    public boolean checkAvailable() {
        return this.isAvailable;
    }
}
