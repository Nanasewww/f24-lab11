package santorini.datastructure;

import santorini.map.Map;

public class Vector2D {
    public int x;
    public int y;
    public static Vector2D zero = new Vector2D(0,0);

    public Vector2D() { }

    public Vector2D(int a, int b) {
        this.x = a;
        this.y = b;
    }

    /**
     * @return {@code true} if this Vector2D is valid in 5x5 Map
     */
    public boolean checkValid() {
        return (x >= 0) && (y >= 0) && (x < Map.size) && (y < Map.size);
    }

    /**
     * @return {@code true} if pos1 and pos2 are adjecent to each other
     */
    public static boolean checkAdjacent(Vector2D pos1, Vector2D pos2) {
        return (Math.abs(pos1.x-pos2.x) <= 1) && (Math.abs(pos1.y-pos2.y) <= 1);
    }
}
