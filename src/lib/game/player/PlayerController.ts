import { Vector2 } from "../../Vector2";

export class PlayerController {
    /**
     * A vector representing the player's current velocity, in units/second. Represented as (Vx, Vy).
     */
    public velocity: Vector2 = new Vector2(0, 0);
    /**
     * A vector representing the player's current position
     */
    public position: Vector2 = new Vector2(0, 0);
    /**
     * A normalized vector representing the current throttle of the submarine
     */
    public throttle: Vector2 = new Vector2(0, 0);

    // public constructor() {}
}
