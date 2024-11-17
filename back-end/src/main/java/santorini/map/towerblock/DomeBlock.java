package santorini.map.towerblock;

public class DomeBlock implements TowerBlock{
    private boolean isAvailable = false;
    
    public boolean checkAvailable() {
        return this.isAvailable;
    }
}
