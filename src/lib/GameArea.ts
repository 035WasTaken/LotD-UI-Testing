import { Unit } from '../types/interface/game';
import { SonarDetectionTypes } from '../types/enum/game';

export class GameArea {
    width: number;
    height: number;
    grid: Unit[][] = [];

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;
    }

    public initialize(): Unit[][] {
        this.grid = new Array(this.height).fill(null).map((_, y) => {
            const arrX = [];

            for (let x = 0; x < this.width; x++) {
                arrX[x] = {
                    type: SonarDetectionTypes.None,
                    x,
                    y,
                };
            }

            return arrX;
        });

        return this.grid;
    }
}

// this.units = new Array(height).fill(null).map(() => new Array(width).fill({ type: SonarDetectionTypes.None, x: 0, y: 0 }));
