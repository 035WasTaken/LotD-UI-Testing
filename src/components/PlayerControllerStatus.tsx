import { PlayerController } from "../lib/game/player/PlayerController";
import { PlayerControllerManager } from "../lib/game/player/PlayerControllerManager";

function PlayerControllerStatus() {
    const playerController = PlayerControllerManager.GetInstance();

    const speed = playerController.velocity;
    const position = playerController.position;

    return (
        <div className="box2">
            <h1>Status</h1>
            <p>
                Speed: {speed.Length()} m/s {"("}x: {speed.data.x} m/s, y: {speed.data.y + " m/s)"}
            </p>
            <p>
                Position: {position.data.x}, {position.data.y}
            </p>
        </div>
    );
}

export default PlayerControllerStatus;
