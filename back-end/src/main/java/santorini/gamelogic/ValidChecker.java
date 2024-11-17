package santorini.gamelogic;

import santorini.map.Space;

/**
 * Validation checker for two Spaces
 */
public interface ValidChecker {
    /**
     * @param src where the worker is on
     * @param dest where the worker tries moving to
     * @return {@code true} if it is available
     */
    public boolean checkCondition(Space src, Space dest);
}
