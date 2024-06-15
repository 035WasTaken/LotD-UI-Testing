import { Player } from "./Player";

export class PlayerManager {
    private static instance: Player;

    public static GetInstance(): Player {
        if (this.instance) {
            return this.instance;
        }

        return new Player();
    }
}
