import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Console } from "./Console";
import { Sonar } from "./Sonar";

function App() {
  return (
    <div className="box-container App">
      <div className="box-top">
        <Box1 />
        <Box2 />
      </div>
      <div className="box-bottom">
        <Console />
        <Sonar />
      </div>
    </div>
  );
}

function Box1() {
  return (
    <div className="box1">
      <h1>Box 1</h1>
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
