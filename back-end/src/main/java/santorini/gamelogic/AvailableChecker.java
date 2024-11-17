package santorini.gamelogic;

import santorini.map.Space;

public class AvailableChecker extends ValidCheckDecorator { 
    public AvailableChecker(ValidChecker vc) {
        super(vc);
    }

    @Override
    public boolean checkCondition(Space src, Space dest) {
        boolean result = dest.checkAvailable();
        return result && super.checkCondition(src, dest); 
    }
}
