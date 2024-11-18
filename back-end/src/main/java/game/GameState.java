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
    private final static String[] playerSymbols = {"A", "B"};
    
        private GameState(Cell[] cells, int player, int winner, int x, int y) {
            this.cells = cells;
            this.player = player;
            this.winner = winner;
            this.positionX = x;
            this.positionY = y;
        }
    
        public static GameState forGame(GameManager game, boolean[] selected) {
            Cell[] cells = getCells(game, selected);
            Vector2D position = game.getCurrentWorker().getPosition() == null? new Vector2D(0, 0) : game.getCurrentWorker().getPosition().getPosition();
            return new GameState(cells, game.getCurrentPlayer() + 1, game.checkWinCondition() + 1, position.x, position.y);
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
                    { "cells": %s, "player": %d, "winner": %d, "positionX": %d, "positionY": %d}
                    """.formatted(Arrays.toString(this.cells), this.player, this.winner, this.positionX, this.positionY);
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
                    String text = "";
                    if (worker != null) {
                        playerId = worker.getPlayerId() + 1;
                        text = playerSymbols[worker.getPlayerId()];
                        workerId = worker.getWorkerId() + 1;
                    }
                    cells[size * y + x] = new Cell(x, y, playerId, workerId, map.getSpace(new Vector2D(x, y)).getTowerLevel(), selected[size * y + x], text);
                }
            }
        return cells;
    }
}

class Cell {
    private final int x;
    private final int y;
    private final int playerId;
    private final int workerId;
    private final int height;
    private final boolean selected;
    private final String text;

    Cell(int x, int y, int playerId, int workerId, int height, boolean selected, String text) {
        this.x = x;
        this.y = y;
        this.playerId = playerId;
        this.workerId = workerId;
        this.height = height;
        this.selected = selected;
        this.text = text;
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
                    "text": "%s"
                }
                """.formatted(this.x, this.y, this.playerId, this.workerId, this.height, this.selected, this.text);
    }
}