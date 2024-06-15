import { useState } from "react";
import "../css/App.css";
import { PlayerController } from "../lib/game/player/PlayerController";
import { Console } from "./Console";
import PlayerControllerStatus from "./PlayerControllerStatus";
import { Sonar } from "./Sonar";

function App() {
    return (
        <div className="box-container App">
            <div className="box-top">
                <Messages />
                <PlayerControllerStatus />
            </div>
            <div className="box-bottom">
                <Console />
                <Sonar />
            </div>
        </div>
    );
}

function Messages() {
    return (
        <div className="messages">
            <h2>Incoming Messages</h2>
        </div>
    );
}

function Box2() {
    return (
        <div className="box2">
            <h1>Box 2</h1>
        </div>
    );
}

export default App;
