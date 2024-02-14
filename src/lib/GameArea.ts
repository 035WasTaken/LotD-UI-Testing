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

    // the fun part is going to be updating this constantly without causing lag
    // i'll probably initialize this with GameObjects at some point in the future
    // but i'd like to optimize it before then, because as of right now it takes
    // ~16ms to execute this as it is. let alone adding more data.
    /**
     * @returns Initialized GameArea
     * @description Sets up GameArea.grid to be used
     */
    public Initialize(): Unit[][] {
        // one way I could potentially optimize this is by removing the `fill(null)` call to remove an iteration
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

    public Update() {}

    public UpdateCoordinate(coordinateUnit: Unit) {
        // idk why it formats like this.
        this.grid[coordinateUnit.y][coordinateUnit.x].type =
            coordinateUnit.type;
    }
}
