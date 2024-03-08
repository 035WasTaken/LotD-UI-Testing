import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./css/index.css";
import { SonarDetectorManager } from "./events/SonarDetectorManager";
import { GameAreaManager } from "./lib/GameAreaManager";
import { ms } from "./lib/Misc";
import { SonarDetectionTypes } from "./types/enum/game";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

const GameArea = GameAreaManager.GetInstance();
const SonarDetector = SonarDetectorManager.GetInstance();

GameArea.UpdateCoordinate({ type: SonarDetectionTypes.Object, x: 30, y: 20 });

setTimeout(() => {
    GameArea.UpdateCoordinate({ type: SonarDetectionTypes.Unknown, x: 32, y: 5 });
}, ms(10));
