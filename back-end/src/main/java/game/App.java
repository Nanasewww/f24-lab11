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
        try {
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
                    } else {
                        throw new Exception("transction: Failed initializtion");
                    }
                    break;
                case "/select":
                    break;
                case "/chooseworker":
                    this.gameManager.chooseWorker(Integer.parseInt(params.get("index")));
                    break;
                case "/move":
                    target = new Vector2D(Integer.parseInt(params.get("x0")), Integer.parseInt(params.get("y0")));
                    if (!this.gameManager.moveWorker(target)) {
                        throw new Exception("transction: Failed movement");
                    }
                    break;
                case "/build":
                    target = new Vector2D(Integer.parseInt(params.get("x0")), Integer.parseInt(params.get("y0")));
                    if (this.gameManager.buildBlock(target)) {
                        this.gameManager.nextTurn();
                    } else {
                        throw new Exception("transction: Failed building");
                    }
                    break;
                default:
                    throw new Exception("The requested resource does not exist");
            }
        } catch (Exception e) {
            return newFixedLengthResponse(Response.Status.NOT_ACCEPTABLE, MIME_PLAINTEXT, e.getMessage());
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