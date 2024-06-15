import { PlayerController } from "./PlayerController";

export class PlayerControllerManager {
    private static instance: PlayerController;

    public static GetInstance(): PlayerController {
        if (this.instance) {
            return this.instance;
        }

        return new PlayerController();
    }
}
