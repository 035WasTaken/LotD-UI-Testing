import { SonarDetectionTypes } from "../enum/game";

export interface Unit {
    type?: SonarDetectionTypes;
    x: number;
    y: number;
}

export interface Vector2Data {
    x: number;
    y: number;
}

export interface Ping {
    timestamp: number;
    type: string;
    coordinate: Unit;
    compass: string;
    distance: number;
}
