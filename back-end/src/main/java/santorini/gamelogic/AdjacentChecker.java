package santorini.gamelogic;

import santorini.datastructure.Vector2D;
import santorini.map.Space;

public class AdjacentChecker extends ValidCheckDecorator {
    
    public AdjacentChecker(ValidChecker vc) {
        super(vc);
    }

    @Override
    public boolean checkCondition(Space src, Space dest) {
        Vector2D pos1 = src.getPosition();
        Vector2D pos2 = dest.getPosition();
        boolean result = Math.abs(pos1.x-pos2.x) <= 1 && Math.abs(pos1.y-pos2.y) <= 1;

        return result && super.checkCondition(src, dest);
    }

}
