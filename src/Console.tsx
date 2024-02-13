import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { CommandHandler } from "./util/commandhandler";
import { ConsoleHandler } from "./util/consolehandler";
import { globalCommands } from "./util/commands";
import { CommandHistory, ConsoleAnimation } from "./types/console";

export function Console() {
  const [canType, setCanType] = useState(true);
  const [consoleLoading, setConsoleLoading] = useState(false);
  const [consoleHistory, setConsoleHistory] = useState("");
  const [consoleAnimation, setConsoleAnimation] =
    useState<ConsoleAnimation | null>(null);
  const [userInput, setUserInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandHistory>({
    commands: [],
    index: -1,
    saved: "",
  });
  const commandHandler = new CommandHandler();
  const consoleHandler = new ConsoleHandler();
  const consoleOutputRef = useRef<HTMLDivElement>(null);
  const cursor = canType ? <span className="console-cursor">&#9646;</span> : "";
  const consoleText = canType
    ? `${consoleHistory}\nCONSOLE> ${userInput}`
    : consoleHistory;

  function handleKeyPress(e: KeyboardEvent) {
    if (!canType) return;

    const parsedUserInput = consoleHandler.calcUserInput(
      userInput,
      commandHistory,
      e,
      () => {
        clearUserInput();
        appendConsoleHistory(`CONSOLE> ${userInput}`);
        runCommand(userInput);
      }
    );
    if (!parsedUserInput) return;
    setCommandHistory(parsedUserInput.newCommandHistory);
    setUserInput(parsedUserInput.newUserInput);
  }

  function clearUserInput() {
    setUserInput("");
  }

  function appendConsoleHistory(
    text: string,
    animated = false,
    newLine = true
  ) {
    let newConsoleText = newLine ? "\n" + text : text;

    if (animated) {
      setConsoleAnimation({
        text: newConsoleText,
        speed: 10,
      });
      return;
    }

    setConsoleHistory(
      // this syntax allows the event to be called multiple times per re-render
      (prevConsoleHistory) => prevConsoleHistory + newConsoleText
    );
  }

  async function runCommand(input: string) {
    const splitCmd = input.split(" ");
    const cmd = globalCommands[splitCmd[0]];

    if (cmd === undefined) {
      let output = `'${splitCmd[0]}' was not found in the list of commands. Run 'help' for a list of commands.\n`;
      appendConsoleHistory(output, true);
      return;
    }

    const args = commandHandler.parseArgs(cmd, splitCmd.slice(1));
    if (typeof args === "string") {
      let output = args + "\n" + commandHandler.renderArgs(cmd.arguments);
      appendConsoleHistory(output, true);
    }

    setCanType(false);
    setConsoleLoading(true);
    let output = await (cmd.run(args)) + "\n";
    setConsoleLoading(false);
    appendConsoleHistory(output, true);
  }

  // Scrolls to bottom if consoleHistory changes
  useEffect(() => {
    if (consoleOutputRef.current) {
      const { current } = consoleOutputRef;
      current.scrollTop = current.scrollHeight;
    }
  }, [consoleHistory, canType]);

  // Console Animation Handler thingy whatever the fuck
  useEffect(() => {
    if (consoleAnimation === null) return;
    
    setCanType(false);
    let index = 0;
    let speed = consoleAnimation.speed;
    let charsPerCycle: number;
    if (consoleAnimation.speed <= 1) {
      speed += 10;
      charsPerCycle = 4;
    } else if (consoleAnimation.speed <= 5) {
      speed += 10;
      charsPerCycle = 3;
    } else if (consoleAnimation.speed <= 10) {
      speed += 10;
      charsPerCycle = 2;
    } else {
      charsPerCycle = 1;
    }

    let text = consoleAnimation.text;
    const loop = setInterval(() => {
      for (let i = 0; i < charsPerCycle; i++) {
        // make the console able to render more than
        // one character at a time; console go brrr
        if (index >= text.length) break;
        appendConsoleHistory(text[index], false, false);
        index++;
      }

      if (index >= text.length) {
        clearInterval(loop);
        setCanType(true);
        setConsoleAnimation(null);
        return;
      }
    }, consoleAnimation.speed);
  }, [consoleAnimation?.text]);

  // Displays animation while the console is loading
  useEffect(() => {
    if (!consoleLoading) {
      return;
    }

    // adds a dot each second
    let dots = 1;
    const loading = setInterval(() => {
      if (dots === 1) appendConsoleHistory("Working.");
      appendConsoleHistory(".", false, false);
      dots++;
    }, 1000);

    return () => clearInterval(loading);
  }, [consoleLoading])

  return (
    <div className="console">
      <div
        tabIndex={0}
        className="console-output"
        ref={consoleOutputRef}
        onKeyDown={(e) => handleKeyPress(e)}
      >
        <pre>
          {consoleText}
          {cursor}
        </pre>
      </div>
    </div>
  );
}
