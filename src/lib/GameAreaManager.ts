import { GameArea } from "./GameArea";

export class GameAreaManager {
    private static instance: GameArea;

    public static getInstance(): GameArea {
        if (!GameAreaManager.instance) {
            GameAreaManager.instance = new GameArea(100, 1000);
        }
        return GameAreaManager.instance;
    }
}
