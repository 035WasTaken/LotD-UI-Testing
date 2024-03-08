import { SonarDetectorManager } from "../events/SonarDetectorManager";
import { ms } from "../lib/Misc";
import { CommandRunArgs, GlobalCommands } from "../types/interface/commands.js";
import { CommandHandler } from "./commandhandler";
import { randomNumberWithCurve } from "./math";

const commandHandler = new CommandHandler();
const globalCommands: GlobalCommands = {
    help: {
        description: "Displays a list of available commands, or details about a given command",
        arguments: [
            {
                alias: ["c", "command"],
                required: false,
                type: "string",
                usage: "Displays information about the given command",
            },
            {
                alias: ["?", "t", "tutorial"],
                required: false,
                type: "boolean",
                usage: "Displays a tutorial on how to use the console",
            },
        ],
        run: function (args: CommandRunArgs): string {
            if (args.tutorial) {
                let output = "--The Console for Dummies--\n";
                output += "The console is a command line interface that allows you to interact with the game.\n";
                output += "To use the console, simply type a command and press enter. For example, to run the help command, type 'help' and press enter.\n";
                output +=
                    "Most commands have arguments. Some are required, and some are optional. Arguments are separated by spaces, and each one starts with a flag (for instance, '-t' or '--tutorial').\n";
                output += "Arguments can have many different types, which are boolean, number, and string.\n";
                output +=
                    "A boolean is either true or false, but just by specifying the flag, you are already making it true (which is almost always what you want). For instance, the tutorial argument in 'help --tutorial', which is a boolean, has been made true since you specified it. If you need a value to be false, just leave out the flag. If you're an overachiever, you can also type '--tutorial false' or '--tutorial true', which will make the argument false or true respectively.\n";
                output += "Strings and numbers require a little more than just specifying the flag. They need to be followed up by a value.\n";
                output +=
                    "For instance, the command 'help --command' requires a string argument. If you wanted to get help about the 'add' command, you would type 'help --command add'. Note that if you add additional spaces (like 'help --command add a number'), it will interpret those as additional arguments, resulting in an error.\n";
                output +=
                    "Number arguments will convert the value to a number, and if it fails, it will return an error. For instance, 'add --num1 10 --num2 twenty' would fail, because num2 is not a number.\n";
                output +=
                    "Most flags have additional aliases, which you can use to increase your productivity. For instance, in the 'help' command, the '-c' flag is the same as '--command' (so 'help -c [command]' is just as functional as 'help --command [command]'). If you are an overachiever, however, you will always want to type out the longest alias. So, just run 'help --command [command]', and pick out the longest aliases for each command.\n";
                output += "That concludes the tutorial. If you have additional questions, you're fucked. Good luck!";
                return output;
            }

            if (!args.command) {
                var commands = Object.keys(globalCommands);
                var output = "Run 'help --command [command]' to get more information about a specific command\n";
                output += "Run 'help --tutorial' for a tutorial on how to use the console\n\n";
                output += "The following commands are available:\n";
                for (var i = 0; i < commands.length; i++) {
                    console.log(commands[i] + " a");
                    output += `  ${commands[i]}: ${globalCommands[commands[i]].description}\n`;
                }
                return output;
            } else {
                const command = args.command as string; // oh oops c# syntax i love c# syntax
                if (globalCommands[command]) {
                    return `Displaying info for command '${command}':\nDescription: ${globalCommands[command].description}${commandHandler.renderArgs(
                        globalCommands[command].arguments
                    )}`;
                } else {
                    return `Command '${command}' not found\n${commandHandler.renderArgs(this.arguments)}`;
                }
            }
        },
    },

    add: {
        description: "Adds two numbers together",
        arguments: [
            {
                alias: ["a", "num1"],
                required: true,
                type: "number",
                usage: "The first number to be added together",
            },
            {
                alias: ["b", "num2"],
                required: true,
                type: "number",
                usage: "The second number to be added together",
            },
        ],
        run: function (args: CommandRunArgs): string {
            const num1 = args.num1 as number;
            const num2 = args.num2 as number;

            return `Result: ${num1 + num2}`;
        },
    },

    ping: {
        description:
            "Send ICMP ECHO_REQUEST to network host and wait for a reply. WARNING: Due to long distances, this command may take a while to finish.\nAdditionally, ping may vary drastically depending on various factors.",
        arguments: [],
        run: async function (args: CommandRunArgs): Promise<string> {
            const suggestedPingMax = 10000;
            const suggestedPingMin = 7000;
            // generates a random ping number along a crazy probability curve
            const result: number = Math.abs(randomNumberWithCurve(10000, 7000));

            return (await CommandHandler.delayExecutionThenReturn(result * 2, `Ping: ${result.toFixed(4)}`)) as string;
        },
    },

    color: {
        description: "",
        arguments: [
            {
                alias: ["h", "hex"],
                required: false,
                type: "string",
                usage: "The hex code to change text color to. If none is provided, reset to white.",
            },
        ],
        run: function (args: CommandRunArgs): string {
            const consoleObj = document.getElementById("console");
            return "";
        },
    },

    throttle: {
        description: "Makes engine go brrr (may take a second to spool up or down)",
        arguments: [
            {
                alias: ["f", "full"],
                required: false,
                type: "boolean",
                usage: "Shorthand for 100% throttle",
            },
            {
                alias: ["s", "stop"],
                required: false,
                type: "boolean",
                usage: "Shorthand for 0% throttle (stops the throttle)",
            },
            {
                alias: ["s", "set"],
                required: false,
                type: "number",
                usage: "Sets the throttle to the % specified, capped to the interval [0, 100] (e.g. '--set 12' => 12% throttle)",
            },
        ],
        run: async function (args: CommandRunArgs): Promise<string> {
            const delay = 2000;
            if (args.full) {
                return (await CommandHandler.delayExecutionThenReturn(delay, "FULLL THROTTLER BSABYYYYY")) as string;
            }
            if (args.stop) {
                return (await CommandHandler.delayExecutionThenReturn(delay, "what a pussy. the engine is stopped, but out of spite.")) as string;
            }
            if (args.set) {
                return (await CommandHandler.delayExecutionThenReturn(delay, `Throttle set to ${args.set}%.`)) as string;
            }
            return (await CommandHandler.delayExecutionThenReturn(0, "IDFK what the throttle is set to LOL")) as string;
        },
    },

    sonar: {
        description: "",
        arguments: [
            {
                alias: ["p", "ping"],
                required: false,
                type: "number",
                usage: "Ping active sonar within a certain range. Defaults to 50m",
            },
        ],
        /*if (Maths.randomNumberInRange(30, 0) === 0) {
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
                distance: GameArea.GetDistanceFromPlayer(c),
            };
            setPings((prevPings: any) => [...prevPings, newPing]);
        }*/
        run: async function (args: CommandRunArgs): Promise<string> {
            const SonarDetector = SonarDetectorManager.GetInstance();

            if (args.ping) {
                const range = args.ping;
                const results = await SonarDetector.TryDetect((range as number) ?? 100, { delay: ms(3) }); // also fires an event if anything is detected

                if (results.length < 1) {
                    return "Nothing detected within range.";
                }

                return "Objects detected. Check sonar output for more details.";
            }

            return "";
        },
    },
};

export { globalCommands };
