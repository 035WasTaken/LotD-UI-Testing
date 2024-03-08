import React, { useEffect, useState } from "react";
import { SonarDetectorManager } from "../events/SonarDetectorManager";
import { GameAreaManager } from "../lib/GameAreaManager";
import { ms } from "../lib/Misc";
import * as Maths from "../util/math";

import type { Ping } from "../types/interface/game";

export function Sonar() {
    const [pings, setPings] = useState<any[]>([]);
    const GameArea = GameAreaManager.GetInstance();
    const SonarDetector = SonarDetectorManager.GetInstance();

    function renderPings() {
        let _pings: React.ReactNode[] = [];
        pings.forEach((ping: any) => {
            const type = ping.type; // int for rn
            const text = `${type} detected [${ping.distance.toFixed(0)}m] ${Maths.roundToDecimalPlaces(ping.angle, 2)}° at [${ping.coordinate.x}, ${
                ping.coordinate.y
            }]`;
            //GameArea.UpdateCoordinate(ping.coordinate);
            _pings.push(<Ping key={generateKey(ping)} className={ping.type.toLowerCase()} timestamp={ping.timestamp} text={text} />);
        });
        // this logs twice because react renders elements twice in dev
        console.log(_pings);

        return <>{_pings.map((element) => element)}</>;
    }

    function generateKey(ping: Ping): number {
        return Number.parseInt(`${ping.coordinate.x}${ping.timestamp + Math.random() * 10000}${ping.coordinate.y}`);
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

    /*
        export enum SonarDetectionTypes {
            None = 0,
            Terrain,
            Object,
            Threat,
            Unknown,
        }
    */

    // Every 500ms, removes pings older than 1 minute and has a small
    // chance to generate a new ping
    useEffect(() => {
        const loop = setInterval(() => {
            removeOldPings();
        }, ms(0.5));

        const handler = (targets: Ping[]) => {
            setPings((prevPings) => targets);
        };

        SonarDetector.on("detect", handler);

        return () => {
            clearInterval(loop);
            SonarDetector.off("detect", handler);
        };
    }, [pings, removeOldPings]);

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
