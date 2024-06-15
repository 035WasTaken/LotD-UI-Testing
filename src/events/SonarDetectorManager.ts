import { GameAreaManager } from "../lib/game/GameAreaManager";
import { SonarDetector } from "./SonarDetector";

// we only really want one instance of SonarDetector at any point in time, so this will facilitate that.
export class SonarDetectorManager {
    private static emitter: SonarDetector;

    public static GetInstance(): SonarDetector {
        if (!this.emitter) {
            this.emitter = new SonarDetector(GameAreaManager.GetInstance());
        }

        return this.emitter;
    }
}
