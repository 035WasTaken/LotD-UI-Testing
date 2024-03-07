import { Unit } from "../types/interface/game";
import { SonarDetectionTypes } from "../types/enum/game";
import { Vector2 } from "./Vector2";

export class GameArea {
    width: number;
    height: number;
    grid: Unit[][] = [];
    playerPosition: Vector2 = new Vector2(0, 0);

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;

        this.Initialize();
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
        // though, we still have to initialize the array with *something*, but hopefully that can just be the subarrays
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
        this.grid[coordinateUnit.y][coordinateUnit.x].type = coordinateUnit.type;
    }

    public GetCoordinateType(coordinate: Unit) {
        const type = coordinate.type;
        let result: String;

        switch (type) {
            case 0:
                result = "None";
                break;
            case 1:
                result = "Terrain";
                break;
            case 2:
                result = "Object";
                break;
            case 3:
                result = "Threat";
                break;
            case 4:
                result = "Unknown";
                break;
            default:
                throw TypeError("Sonar type does not exist");
        }

        return result;
    }

    public GetDistanceFromPlayer(coordinate: Unit): number {
        const point1 = this.playerPosition;
        const point2 = new Vector2(coordinate.x, coordinate.y);

        // pythagorean theorem
        const distance = Math.sqrt((point2.data.x - point1.data.x) ** 2 + (point2.data.y - point1.data.y) ** 2);

        return distance;
    }
}
