package santorini.map;

import santorini.datastructure.Vector2D;

public class Map {
    private final Space[][] spaces;
    public static int size = 5;

    public Map() {
        this.spaces = new Space[size][size];
        for (int i = 0; i < size; ++i)
            for (int j = 0; j < size; ++j) {
                this.spaces[i][j] = new Space(new Vector2D(i, j));
            }
    }

    /**
     * @param pos Space position
     * @return required Space
     */
    public Space getSpace(Vector2D pos) {
        return this.spaces[pos.x][pos.y];
    }
}
