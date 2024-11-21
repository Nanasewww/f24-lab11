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
    private final boolean[] selected = new boolean[25];
    private int lastSelected = 0;

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
        for (int i = 0; i < 25; ++i) {
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
                case "/newgame" -> {  // start a new game
                    this.gameManager = new GameManager(2);
                    resetSelected();
                }
                case "/action" -> {  // perform an action (move, build, etc.)
                    target = new Vector2D(Integer.parseInt(params.get("x")), Integer.parseInt(params.get("y")));
                    if (!this.gameManager.handleAction(target)) {
                        throw new Exception("transction: Failed: invalid space");
                    }
                    resetSelected();
                }
                case "/select" -> {  // select a cell
                    target = new Vector2D(Integer.parseInt(params.get("x")), Integer.parseInt(params.get("y")));
                    if (this.gameManager.checkTarget(target)) {
                        int s = 5 * target.y + target.x;
                        selected[lastSelected] = false;
                        selected[s] = !selected[s];
                        lastSelected = s;
                    }
                }
                case "/chooseworker" -> {  // choose a worker
                    this.gameManager.chooseWorker(Integer.parseInt(params.get("index")));
                    resetSelected();
                }
                default -> throw new Exception("The requested resource does not exist");  // If an error occurs, return a "Not Acceptable" response with the error message
            }
        } catch (Exception e) {
            return newFixedLengthResponse(Response.Status.NOT_ACCEPTABLE, MIME_PLAINTEXT, e.getMessage());
        }
        // Extract the view-specific data from the game and apply it to the template.
        GameState gameplay = GameState.forGame(this.gameManager, this.selected);
        return newFixedLengthResponse(gameplay.toString());
    }
}