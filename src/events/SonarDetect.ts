import EventEmitter from "events";
import { GameArea } from "../lib/GameArea";
import { GameAreaManager } from "../lib/GameAreaManager";
import type { Unit } from "../types/interface/game";
import { Vector2 } from "../lib/Vector2";

export class Sonar extends EventEmitter {
    private gameArea: GameArea;
    private lastDetected: Unit[] = [];
    private lastPlayerPosition: Vector2 = new Vector2(0, 0);

    constructor(gameArea: GameArea) {
        super();
        this.gameArea = GameAreaManager.getInstance();
    }

    public TryDetect(radius: number): void {
        // if player has not moved, and there were objects detected in this position previously
        // we emit the "detect" event with those objects so as to avoid unnecessary iteration.
        // if player has not moved and there were no objects detected last time, return nothing.
        // otherwise, continue.
        if (this.gameArea.playerPosition === this.lastPlayerPosition && this.lastDetected.length > 0) {
            this.emit("detect", this.lastDetected);
            return;
        } else if (this.gameArea.playerPosition === this.lastPlayerPosition && this.lastDetected.length < 1) {
            return;
        }

        const center = [this.gameArea.width / 2, this.gameArea.height / 2];
        const [centerX, centerY] = center;
        const elementsInRadius = [];

        for (let i = centerX - radius; i <= centerX + radius; i++) {
            for (let j = centerY - radius; j <= centerY + radius; j++) {
                // Check if the current indices are within the bounds of the matrix
                if (i >= 0 && i < this.gameArea.grid.length && j >= 0 && j < this.gameArea.grid[i].length) {
                    elementsInRadius.push(this.gameArea.grid[i][j]);
                }
            }
        }

        this.lastDetected = elementsInRadius;
        this.lastPlayerPosition = this.gameArea.playerPosition;

        if (elementsInRadius.length > 0) {
            this.emit("detect", elementsInRadius);
        }
    }
}
