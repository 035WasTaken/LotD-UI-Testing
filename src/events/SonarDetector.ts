import EventEmitter from "events";
import { GameArea } from "../lib/GameArea";
import { GameAreaManager } from "../lib/GameAreaManager";
import { Vector2 } from "../lib/Vector2";
import { SonarDetectionTypes } from "../types/enum/game";
import type { Ping, TryDetectOptionals, Unit } from "../types/interface/game";
import { CommandHandler } from "../util/commandhandler";
import * as Maths from "../util/math";

export class SonarDetector extends EventEmitter {
    private gameArea: GameArea;
    private lastDetected: Ping[] = [];
    private lastPlayerPosition: Vector2 = new Vector2(0, 0);

    constructor(gameArea: GameArea) {
        super();
        this.gameArea = GameAreaManager.GetInstance();
    }

    public async TryDetect(radius: number, { delay }: TryDetectOptionals = {}): Promise<Ping[]> {
        // if player has not moved, and there were objects detected in this position previously
        // we emit the "detect" event with those objects so as to avoid unnecessary iteration.
        // if player has not moved and there were no objects detected last time, return nothing.
        // otherwise, continue.

        // uncomment this when we actually implement player movement
        /*if (this.gameArea.playerPosition === this.lastPlayerPosition && this.lastDetected.length > 0) {
            this.emit("detect", this.lastDetected);
            return this.lastDetected;
        } else if (this.gameArea.playerPosition === this.lastPlayerPosition && this.lastDetected.length < 1) {
            console.log("nothing ever");
            return;
        }*/

        if (delay) {
            await CommandHandler.delayExecutionThenReturn(delay, null);
        }

        console.log("after timer");

        // this definitely isn't the most efficient method, but it should be fine for our use case
        const playerPos = [this.gameArea.playerPosition.data.x, this.gameArea.playerPosition.data.y];
        const [playerX, playerY] = playerPos;
        const elementsInRadius: Ping[] = [];

        for (let i = playerX - radius; i <= playerX + radius; i++) {
            for (let j = playerY - radius; j <= playerY + radius; j++) {
                // waow,,
                if (
                    i >= 0 &&
                    i < this.gameArea.grid.length &&
                    j >= 0 &&
                    j < this.gameArea.grid[i].length &&
                    this.gameArea.grid[i][j].type !== null &&
                    this.gameArea.grid[i][j].type !== SonarDetectionTypes.None
                ) {
                    const coordinate: Unit = this.gameArea.grid[i][j];
                    const timestamp: number = Date.now();
                    const type = this.gameArea.GetCoordinateType(coordinate);
                    const angle = Maths.calcAngleToPosition(new Vector2(coordinate.x, coordinate.y));
                    const distance = this.gameArea.GetDistanceFromPlayer(coordinate);

                    console.log(distance);

                    const ping = {
                        timestamp,
                        type,
                        coordinate,
                        angle,
                        distance,
                    };

                    elementsInRadius.push(ping);
                }
            }
        }

        this.lastDetected = elementsInRadius;
        this.lastPlayerPosition = this.gameArea.playerPosition;

        if (elementsInRadius.length > 0) {
            this.emit("detect", elementsInRadius);
        }

        console.log(elementsInRadius);

        return elementsInRadius;
    }
}
