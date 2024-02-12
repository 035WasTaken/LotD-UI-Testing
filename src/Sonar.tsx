import React, { useEffect } from "react";

export function Sonar() {
  
  // function onDestruct(timestamp: number) {

  // }

  return (
    <div className="sonar">
      <h1>Sonar</h1>
      <p className="terrain">[21:54:23] Terrain detected 260m NNE</p>
      <p className="threat">[22:06:32] Threat detected 182m ESE</p>
      <p className="object">[22:09:29] Object detected 111m S</p>
      {/* <Ping timestamp={Date.now()} text={"test"} onDestruct={onDestruct} /> */}
    </div>
  );
}

function Ping(timestamp: number, text: string, onDestruct: Function) {
  useEffect(() => {
    setTimeout(() => {
      onDestruct(timestamp);
    }, 2000)
  }, [])

  return (
    <p>{timestamp + text}</p>
  )
}
