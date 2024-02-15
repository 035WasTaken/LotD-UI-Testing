import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import { GameArea } from "./lib/GameArea";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

const ga = new GameArea(100, 1000);
const GAME_AREA = ga.Initialize();
// @ts-ignore
document.GAME_AREA = GAME_AREA; // for ease-of-use
