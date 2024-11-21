package game;

import java.util.Arrays;

import santorini.datastructure.Vector2D;
import santorini.game.GameManager;
import santorini.game.Worker;
import santorini.map.Map;

public class GameState {

    private final Cell[] cells;
    private final int player;
    private final int winner;
    private final int positionX, positionY;
    private final String stateText;
    
        private GameState(Cell[] cells, int player, int winner, int x, int y, String text) {
            this.cells = cells;
            this.player = player;
            this.winner = winner;
            this.positionX = x;
            this.positionY = y;
            this.stateText = text;
        }
    
        public static GameState forGame(GameManager game, boolean[] selected) {
            Cell[] cells = getCells(game, selected);
            Vector2D position = game.getCurrentWorker().getPosition() == null? new Vector2D(0, 0) : game.getCurrentWorker().getPosition().getPosition();
            return new GameState(cells, game.getCurrentPlayer() + 1, game.checkWinCondition() + 1, position.x, position.y, game.getState());
        }
    
        public Cell[] getCells() {
            return this.cells;
        }
    
        /**
         * toString() of GameState will return the string representing
         * the GameState in JSON format.
         */
        @Override
        public String toString() {
            return """
                    { "cells": %s, "player": %d, "winner": %d, "positionX": %d, "positionY": %d, "stateText": "%s"}
                    """.formatted(Arrays.toString(this.cells), this.player, this.winner, this.positionX, this.positionY, this.stateText);
        }
    
        private static Cell[] getCells(GameManager game, boolean[] selected) {
            int size = Map.size;
            Cell cells[] = new Cell[size * size];
            Map map = game.getMap();
            for (int x = 0; x < size; ++x) {
                for (int y = 0; y < size; ++y) {
                    Worker worker = map.getSpace(new Vector2D(x, y)).getWorker();
                    int playerId = -1;
                    int workerId = -1;
                    if (worker != null) {
                        playerId = worker.getPlayerId() + 1;
                        workerId = worker.getWorkerId() + 1;
                    }
                    int height = map.getSpace(new Vector2D(x, y)).getTowerLevel();
                    boolean available = game.checkTarget(new Vector2D(x, y));
                    cells[size * y + x] = new Cell(x, y, playerId, workerId, height, selected[size * y + x], available);
                }
            }
        return cells;
    }
}

class Cell {
    private final int x;         // The x-coordinate of the cell on the board
    private final int y;         // The y-coordinate of the cell on the board
    private final int playerId;  // The ID of the player who owns the cell (-1 if unowned)
    private final int workerId;  // The ID of the worker on this cell (-1 if no worker is present)
    private final int height;    // The height of the tower built on this cell (0-4)
    private final boolean selected;   // Indicates whether the cell is currently selected
    private final boolean available;  // Indicates whether the cell is available for an action

    Cell(int x, int y, int playerId, int workerId, int height, boolean selected, boolean available) {
        this.x = x;
        this.y = y;
        this.playerId = playerId;
        this.workerId = workerId;
        this.height = height;
        this.selected = selected;
        this.available = available;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public int getPlayerId() {
        return this.playerId;
    }

    @Override
    public String toString() {
        return """
                {
                    
                    "x": %d,
                    "y": %d,
                    "playerId": %d,
                    "workerId": %d,
                    "height": %d,
                    "selected": %b,
                    "available": %b
                }
                """.formatted(this.x, this.y, this.playerId, this.workerId, this.height, this.selected, this.available);
    }
}