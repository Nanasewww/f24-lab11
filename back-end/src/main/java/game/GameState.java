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
    private final static String[] playerSymbols = {"A", "B"};
    
        private GameState(Cell[] cells, int player, int winner) {
            this.cells = cells;
            this.player = player;
            this.winner = winner;
        }
    
        public static GameState forGame(GameManager game, boolean[] selected) {
            Cell[] cells = getCells(game, selected);
            return new GameState(cells, game.getCurrentPlayer(), game.checkWinCondition());
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
                    { "cells": %s, "player": %d, "winner": %d}
                    """.formatted(Arrays.toString(this.cells), this.player, this.winner);
        }
    
        private static Cell[] getCells(GameManager game, boolean[] selected) {
            int size = Map.size;
            Cell cells[] = new Cell[size * size];
            Map map = game.getMap();
            for (int x = 0; x < size; ++x) {
                for (int y = 0; y < size; ++y) {
                    Worker worker = map.getSpace(new Vector2D(x, y)).getWorker();
                    int playerId = -1;
                    String text = "";
                    if (worker != null) {
                        playerId = worker.getPlayerId() + 1;
                        text = playerSymbols[worker.getPlayerId()];
                    }
                    text += "+" + map.getSpace(new Vector2D(x, y)).getTowerLevel();
                    cells[size * y + x] = new Cell(x, y, playerId, selected[size * y + x], text);
                }
            }
        return cells;
    }
}

class Cell {
    private final int x;
    private final int y;
    private final int playerId;
    private final boolean selected;
    private final String text;

    Cell(int x, int y, int playerId, boolean selected, String text) {
        this.x = x;
        this.y = y;
        this.playerId = playerId;
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
                    "selected": %b,
                    "text": "%s"
                }
                """.formatted(this.x, this.y, this.playerId, this.selected, this.text);
    }
}