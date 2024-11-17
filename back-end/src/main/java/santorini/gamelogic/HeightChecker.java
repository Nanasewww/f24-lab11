package santorini.gamelogic;

import santorini.map.Space;

public class HeightChecker extends ValidCheckDecorator {

    public HeightChecker(ValidChecker vc) {
        super(vc);
    }

    @Override
    public boolean checkCondition(Space src, Space dest) {
        boolean result = dest.getTowerLevel() - src.getTowerLevel() <= 1;
        return result && super.checkCondition(src, dest);
    }

}
