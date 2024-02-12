import { KeyboardEvent } from "react";

export class ConsoleHandler {
  calcUserInput(currentUserInput: string, e: KeyboardEvent, callback:Function) {
    let newUserInput:string = currentUserInput;
    if (e.key.length === 1) {
      newUserInput += e.key.toLowerCase();
      // commandHistory.index = -1;
      // commandHistory.saved = command;
    }
    if (e.key === "Backspace") {
      newUserInput = newUserInput.slice(0, -1);
      // commandHistory.index = -1;
      // commandHistory.saved = command;
    }
    if (e.key === "Escape") {
      newUserInput = "";
      // commandHistory.index = -1;
      // commandHistory.saved = command;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault(); // prevents scrolling
      // if (commandHistory.index >= commandHistory.commands.length - 1) {
      //   return;
      // }
  
      // commandHistory.index++;
      // // newUserInput = commandHistory.commands[commandHistory.index];
    }
    if (e.key === "ArrowDown") {
      e.preventDefault(); // prevents scrolling
      // console.log(commandHistory.index);
      // if (commandHistory.index <= -1) return;
      // commandHistory.index--;
  
      // if (commandHistory.index === -1) {
      //   newUserInput = commandHistory.saved;
      // } else {
      //   newUserInput = commandHistory.commands[commandHistory.index];
      // }
    }
    if (e.key === "Enter") {
      if (newUserInput === "") {
        return newUserInput;
      }
      newUserInput = "";
      callback();
    }

    return newUserInput;
  }
}