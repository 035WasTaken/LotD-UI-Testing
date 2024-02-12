import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { CommandHandler } from "./util/commandhandler";
import { ConsoleHandler } from "./util/consolehandler";
import { globalCommands } from "./util/commands";

export function Console() {
  const [canType, setCanType] = useState(true);
  const [consoleHistory, setConsoleHistory] = useState("");
  const [userInput, setUserInput] = useState("");
  const commandHandler = new CommandHandler();
  const consoleHandler = new ConsoleHandler();
  const consoleOutputRef = useRef<HTMLDivElement>(null);

  const cursor = canType ? <span className="console-cursor">&#9646;</span> : "";
  const consoleText = `${consoleHistory}\nCONSOLE> ${userInput}`;

  function handleKeyPress(e: KeyboardEvent) {
    if (!canType) return;

    const newUserInput = consoleHandler.calcUserInput(userInput, e, () => {
      const command = userInput;
      runCommand(userInput);
    });
    setUserInput(newUserInput);
  }

  function appendConsoleHistory(text: string, newLine = true, animated = false) {
    if (newLine) {
      setConsoleHistory(consoleHistory + "\n" + text);
      return;
    }
    setConsoleHistory(consoleHistory + text);
  }

  function runCommand(input: string) {
    const splitCmd = input.split(" ");
    const cmd = globalCommands[splitCmd[0]];
    let output = "CONSOLE> " + userInput + "\n";

    if (cmd === undefined) {
      output += `'${splitCmd[0]}' was not found in the list of commands. Run 'help' for a list of commands.\n`;
      appendConsoleHistory(output, true);
      return;
    }

    const args = commandHandler.parseArgs(cmd, splitCmd.slice(1));
    if (typeof(args) === "string") {
      output += args + "\n" + commandHandler.renderArgs(cmd.arguments);
      appendConsoleHistory(output);
    }

    output += cmd.run(args) + "\n";
    appendConsoleHistory(output);
  }

  // scroll to bottom if consoleHistory changes
  useEffect(() => {
    if (consoleOutputRef.current) {
      const { current } = consoleOutputRef;
      current.scrollTop = current.scrollHeight;
    }
  }, [consoleHistory]);

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
