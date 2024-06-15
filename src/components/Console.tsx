import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { CommandHistory, ConsoleAnimation, IConsole } from "../types/console";
import { CommandHandler } from "../util/commandhandler";
import { globalCommands } from "../util/commands";
import { ConsoleHandler } from "../util/consolehandler";
import { PlayerController } from "../lib/game/player/PlayerController";

export function Console() {
    const [canType, setCanType] = useState(true);
    const [consoleLoading, setConsoleLoading] = useState(false);
    const [consoleLoadingText, setConsoleLoadingText] = useState<String | null>(null);
    const [consoleHistory, setConsoleHistory] = useState("");
    const [consoleAnimation, setConsoleAnimation] = useState<ConsoleAnimation | null>(null);
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

    function renderConsoleText() {
        let text = consoleHistory;
        if (consoleLoadingText != null) {
            text += "\n" + consoleLoadingText;
        }
        if (canType) {
            text += `\nCONSOLE> ${userInput}`;
        }

        return text;
    }

    function handleKeyPress(e: KeyboardEvent) {
        if (!canType) return;

        const parsedUserInput = consoleHandler.calcUserInput(userInput, commandHistory, e, () => {
            clearUserInput();
            appendConsoleHistory(`CONSOLE> ${userInput}`);
            runCommand(userInput);
        });
        if (!parsedUserInput) return;
        setCommandHistory(parsedUserInput.newCommandHistory);
        setUserInput(parsedUserInput.newUserInput);
    }

    function clearUserInput() {
        setUserInput("");
    }

    function appendConsoleHistory(text: string, animated = false, newLine = true) {
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
            return;
        }

        setCanType(false);
        setConsoleLoading(true);
        let output = (await cmd.run(args)) + "\n";
        setConsoleLoading(false);
        appendConsoleHistory(output, true);
    }

    // Scrolls to bottom if consoleHistory changes
    useEffect(() => {
        if (consoleOutputRef.current) {
            const { current } = consoleOutputRef;
            current.scrollTop = current.scrollHeight;
        }
    }, [consoleHistory, canType, consoleLoadingText]);

    // Console Animation Handler thingy whatever the fuck
    useEffect(() => {
        if (consoleAnimation === null) return;

        setCanType(false);
        let index = 0;
        let speed = consoleAnimation.speed;
        let charsPerCycle: number;
        if (speed <= 1) {
            charsPerCycle = 4;
        } else if (speed <= 5) {
            charsPerCycle = 3;
        } else if (speed <= 10) {
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
        }, speed);
    }, [consoleAnimation?.text]);

    // Displays animation while the console is loading
    useEffect(() => {
        const loadingChars = ["—", "\\", "|", "/"];

        if (!consoleLoading) {
            setConsoleLoadingText(null);
            return;
        }

        let char = 0;
        const loading = setInterval(() => {
            setConsoleLoadingText(`Executing command...  ${loadingChars[char]}`);
            char++;

            if (char >= loadingChars.length) {
                char = 0;
            }
        }, 120);

        return () => clearInterval(loading);
    }, [consoleLoading]);

    return (
        <div className="console">
            <div tabIndex={0} className="console-output" ref={consoleOutputRef} onKeyDown={(e) => handleKeyPress(e)}>
                <pre>
                    {renderConsoleText()}
                    {cursor}
                </pre>
            </div>
        </div>
    );
}
