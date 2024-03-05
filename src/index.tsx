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

interface Document {
    GAME_AREA: GameArea;
}
