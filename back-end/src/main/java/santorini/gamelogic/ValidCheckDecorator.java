package santorini.gamelogic;

import santorini.map.Space;

public class ValidCheckDecorator implements ValidChecker {
    private ValidChecker wrappee;

    public ValidCheckDecorator(ValidChecker vc) {
        wrappee = vc;
    }

    public boolean checkCondition(Space src, Space dest) {
        return wrappee.checkCondition(src, dest);
    }
}
