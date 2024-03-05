import "./css/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import { GameAreaManager } from "./lib/GameAreaManager";
import { Sonar } from "./events/SonarDetect";
import { ms } from "./lib/Misc";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

const GameArea = GameAreaManager.getInstance();
const sonar = new Sonar(GameArea);

// this is for testing
setInterval(() => {
    sonar.TryDetect(200);
}, ms(1));

sonar.on("detect", (targets) => {
    console.log(targets);
});
