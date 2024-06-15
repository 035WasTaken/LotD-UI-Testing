import { PlayerController } from "../lib/game/player/PlayerController";
import { Dispatch } from "react";

export type ParsedArgs = {
    [key: string]: boolean | number | string;
};

export type ErrorResult = string;

export type ParseResult = ParsedArgs | ErrorResult;

export type CommandHistory = {
    commands: string[];
    index: number;
    saved: string;
};

export type ParsedUserInput = {
    newUserInput: string;
};

export type ConsoleAnimation = {
    speed: number;
    text: string;
};

export interface IConsole {
    playerController: PlayerController;
    setPlayerController: Dispatch<PlayerController>;
}
