import React, { Component, useEffect, useState } from "react";
import * as Maths from "./util/math";

export function Sonar() {
  const [pings, setPings] = useState<any[]>([]);
  const directions = [
    "N",
    "S",
    "W",
    "E",
    "NW",
    "NE",
    "SW",
    "SE",
    "NNW",
    "WNW",
    "NNE",
    "ENE",
    "SSW",
    "WSW",
    "SSE",
    "ESE",
  ];

  function renderPings() {
    let _pings: any[] = [];
    pings.forEach((ping) => {
      const type = ping.type[0].toUpperCase() + ping.type.slice(1);
      const text = `${type} detected ${ping.distance}m ${ping.compass}`;
      _pings.push(
        <Ping
          key={ping.timestamp}
          className={ping.type}
          timestamp={ping.timestamp}
          text={text}
        />
      );
    });
    return <>{_pings.map((element) => element)}</>;
  }

  function toDirection(int: number) {
    return directions[int];
  }

  function generatePingType() {
    const randomNumber = Math.random();
    if (randomNumber < .5) {
      return "terrain";
    }
    if (randomNumber < .9) {
      return "object";
    }
    return "threat";
  }

  function removeOldPings() {
    const maxMs = 60000;
    if (pings.length === 0) return;

    // we only need to check one at a time because the ones
    // after it are going to be older than this one
    const ping = pings[0];
    const elapsed = Date.now() - ping.timestamp;
    if (elapsed > maxMs) {
      setPings((prevPings) => prevPings.slice(1, prevPings.length));
    }
  }

  function tryCreateNewPing() {
    if (Maths.randomNumberInRange(30, 0) === 0) {
      const newPing = {
        timestamp: Date.now(),
        type: generatePingType(),
        distance: Math.floor(
          Maths.randomNumberWithCurve(200, 100)
        ),
        compass: toDirection(
          Maths.randomNumberInRange(directions.length - 1, 0)
        ),
      };
      setPings((prevPings) => [...prevPings, newPing]);
    }
  }

  useEffect(() => {
    const loop = setInterval(() => {
      removeOldPings();
      tryCreateNewPing();
    }, 500);

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
