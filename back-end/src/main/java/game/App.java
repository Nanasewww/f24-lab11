package game;

import java.io.IOException;
import java.util.Map;

import fi.iki.elonen.NanoHTTPD;
import santorini.datastructure.Vector2D;
import santorini.game.GameManager;

public class App extends NanoHTTPD {

    public static void main(String[] args) {
        try {
            new App();
        } catch (IOException ioe) {
            System.err.println("Couldn't start server:\n" + ioe);
        }
    }

    private GameManager gameManager;
    private boolean[] selected = new boolean[25];

    /**
     * Start the server at :8080 port.
     * @throws IOException
     */
    public App() throws IOException {
        super(8080);

        this.gameManager = new GameManager(2);
        resetSelected();

        start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
        System.out.println("\nRunning!\n");
    }

    private void resetSelected() {
        for (int i = 0; i<25; ++i) {
            this.selected[i] = false;
        }
    }

    @Override
    public Response serve(IHTTPSession session) {
        String uri = session.getUri();
        Map<String, String> params = session.getParms();
        Vector2D target;
        switch (uri) {
            case "/newgame":
                this.gameManager = new GameManager(2);
                break;
            case "/initialize":
                Vector2D target1 = new Vector2D(Integer.parseInt(params.get("x0")), Integer.parseInt(params.get("y0")));
                Vector2D target2 = new Vector2D(Integer.parseInt(params.get("x1")), Integer.parseInt(params.get("y1")));
                if (this.gameManager.initializeWorker(target1, target2)) {
                    this.gameManager.nextTurn();
                    resetSelected();
                }
                break;
            case "/select":
                break;
            case "/chooseworker":
                System.out.println("choose worker:" + this.gameManager.chooseWorker(Integer.parseInt(params.get("index"))));
                break;
            case "/move":
                target = new Vector2D(Integer.parseInt(params.get("x0")), Integer.parseInt(params.get("y0")));
                System.out.println("move worker:" + this.gameManager.moveWorker(target));
                break;
            case "/build":
                target = new Vector2D(Integer.parseInt(params.get("x0")), Integer.parseInt(params.get("y0")));
                System.out.println("build:" + this.gameManager.buildBlock(target));
                this.gameManager.nextTurn();
                break;
            default:
                //throw new AssertionError(uri);
        }
        // Extract the view-specific data from the game and apply it to the template.
        GameState gameplay = GameState.forGame(this.gameManager, this.selected);
        return newFixedLengthResponse(gameplay.toString());
    }

    public static class Test {
        public String getText() {
            return "Hello World!";
        }
    }
}