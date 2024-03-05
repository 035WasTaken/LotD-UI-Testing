import React, { Component, useEffect, useState } from "react";
import { GameAreaManager } from "../lib/GameAreaManager";
import { SonarDetectionTypes } from "../types/enum/game";
import { ms } from "../lib/Misc";
import * as Maths from "../util/math";
import { Vector2 } from "../lib/Vector2";

import type { Unit, Ping } from "../types/interface/game";

const GameArea = GameAreaManager.getInstance();

export function Sonar() {
    const [pings, setPings] = useState<any[]>([]);

    function renderPings() {
        let _pings: React.ReactNode[] = [];
        pings.forEach((ping: any) => {
            const type = ping.type; // int for rn
            const text = `${type} detected [${ping.distance.toFixed(0)}m] ${Maths.roundToDecimalPlaces(ping.angle, 2)}° at [${ping.coordinate.x}, ${
                ping.coordinate.y
            }]`;
            GameArea.UpdateCoordinate(ping.coordinate);
            _pings.push(<Ping key={ping.timestamp} className={ping.type.toLowerCase()} timestamp={ping.timestamp} text={text} />);
        });
        return <>{_pings.map((element) => element)}</>;
    }

    function generatePingType() {
        const randomNumber = Math.random();
        if (randomNumber < 0.5) {
            return SonarDetectionTypes.Terrain;
        }
        if (randomNumber < 0.9) {
            return SonarDetectionTypes.Object;
        }
        return SonarDetectionTypes.Threat;
    }

    function removeOldPings() {
        const maxMs = ms(60); // how long pings stay on the screen for
        if (pings.length === 0) return;

        // we only need to check one at a time because the ones
        // after it are going to be older than this one
        const ping = pings[0];
        const elapsed = Date.now() - ping.timestamp;
        if (elapsed > maxMs) {
            setPings((prevPings: any) => prevPings.slice(1, prevPings.length));
        }
    }

    function tryCreateNewPing() {
        if (Maths.randomNumberInRange(30, 0) === 0) {
            const t = generatePingType();
            const c: Unit = {
                x: Math.floor(Maths.randomNumberInRange(0, 100)),
                y: Math.floor(Maths.randomNumberInRange(0, 1000)),
            };
            const newPing = {
                timestamp: Date.now(),
                type: getType(t),
                coordinate: {
                    type: t,
                    x: c.x,
                    y: c.y,
                },
                angle: Maths.calcAngleToPosition(new Vector2(c.x, c.y)),
                // ignore this for a bit
                distance: GameArea.GetDistanceFromPlayer(c),
            };
            setPings((prevPings: any) => [...prevPings, newPing]);
        }
    }

    /*
        export enum SonarDetectionTypes {
            None = 0,
            Terrain,
            Object,
            Threat,
            Unknown,
        }
    */

    function getType(type: SonarDetectionTypes) {
        let result: String;
        switch (type) {
            case 0:
                result = "None";
                break;
            case 1:
                result = "Terrain";
                break;
            case 2:
                result = "Object";
                break;
            case 3:
                result = "Threat";
                break;
            case 4:
                result = "Unknown";
                break;
            default:
                throw TypeError("Sonar type does not exist");
        }

        return result;
    }

    // Every 500ms, removes pings older than 1 minute and has a small
    // chance to generate a new ping
    useEffect(() => {
        const loop = setInterval(() => {
            removeOldPings();
            tryCreateNewPing();
        }, ms(0.5));

        return () => clearInterval(loop);
    }, [pings]);

    return (
        <div className="sonar">
            <h1>Sonar</h1>
            {renderPings()}
        </div>
    );
}

function Ping({ timestamp, text, className = "" }: any) {
    function addLeadingZero(number: number | string) {
        return number.toString().padStart(2, "0");
    }

    const date = new Date(timestamp);
    const hours = addLeadingZero(date.getHours());
    const minutes = addLeadingZero(date.getMinutes());
    const seconds = addLeadingZero(date.getSeconds());
    const time = `${hours}:${minutes}:${seconds}`;

    return <p className={className}>{`[${time}] ${text}`}</p>;
}
