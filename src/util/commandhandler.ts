import { Argument, Command } from "../types/interface/commands";
import { ParseResult } from "../types/console";

export class CommandHandler {
    terminal;
    /**
     * @param {Object} terminal - The terminal object to use
     */
    constructor(terminal: any = {}) {
        this.terminal = terminal;
    }
    /**
     * @param {number} ms - Number of milliseconds to delay by.
     * @param {any} value - The value you want returned at the end of the delay.
     * @returns {any}
     * @static
     * 
     * Delay the execution of a function or method, and then return a given value at the end.
     */
    static delayExecutionThenReturn(ms: number, value: any) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(value);
            }, ms)
        })
    }

    /**
     * @param {Command} command
     * @param {string[]} args
     * @returns {ParseResult}
     *
     * Parse command arguments and return a string to be displayed to the user
     */
    parseArgs(command: Command, args: string[]) {
        console.log(args);
        if (!this.checkRequiredArgsPresent(command, args)) {
            return "Required argument(s) not present!";
        }
        // working on this, ignore errors
        let output: ParseResult = {};
        for (let i = 0; i < args.length; i++) {
            if (args[i] === "")
                continue;
            let arg;
            if (args[i].startsWith("--")) {
                arg = args[i].slice(2);
            }
            else if (args[i].startsWith("-")) {
                arg = args[i].slice(1);
            }
            else {
                // throw ("FUCK"); I wish
                return `Argument '${args[i]}' is not valid`;
            }
            let present = false;
            for (let j = 0; j < command.arguments.length; j++) {
                const alias = command.arguments[j].alias;
                const type = command.arguments[j].type;
                const next = args[i + 1];
                if (alias.includes(arg)) {
                    if (!this.verifyType(next, type)) {
                        return `Argument '${args[i]}' is not of right type`;
                    }
                    if (type === "boolean" &&
                        (next === undefined || next === "" || next.startsWith("-"))) {
                        // indexed with last element of "string" type
                        output[alias[alias.length - 1]] = true;
                    }
                    else if (type === "boolean") {
                        output[alias[alias.length - 1]] = next === "true";
                        i++;
                    }
                    else if (type === "number") {
                        output[alias[alias.length - 1]] = Number(next);
                        i++;
                    }
                    else {
                        output[alias[alias.length - 1]] = args[i + 1];
                        i++; // next arg is actually just this one
                    }
                    present = true;
                    break;
                }
            }
            if (!present)
                return `Argument '${arg}' not found`;
        }
        console.log(output);
        return output;
    }
    /**
     * @param {Object} command
     * @param {string[]} args
     * @returns {bool}
     *
     * Checks if all required arguments are present
     */
    checkRequiredArgsPresent(command: Command, args: string[]) {
        for (let i = 0; i < command.arguments.length; i++) {
            if (!command.arguments[i].required)
                continue;
            let present = false;
            command.arguments[i].alias.forEach((alias) => {
                if (args.includes(`-${alias}`) || args.includes(`--${alias}`)) {
                    present = true;
                }
            });
            if (!present) {
                return false;
            }
        }
        return true;
    }
    verifyType(arg: string, type: any) {
        console.log(type);
        console.log(arg);
        console.log(Number(arg));
        if (type === "boolean") {
            // if it's a bool, and the next thing is also a flag or whatever, the arg is gonna be true anyway
            if (arg === undefined || arg === "" || arg.startsWith("-"))
                return true;
            if (arg === "true" || arg === "false")
                return true;
        }
        if (arg === undefined || arg === null)
            return false;
        if (typeof type !== "string") {
            return typeof arg === typeof type;
        }
        if (type === "string") {
            return typeof arg.toString() === type; // well i guess this is always true but still
        }
        if (type === "number") {
            return !!Number(arg); // true if not NaN
        }
        return typeof arg === type;
    }
    // This converts args to a readable format. Can be used when displaying help, or when they type in the command wrong
    renderArgs(args: Argument[]) {
        if (args.length === 0 || args === undefined)
            return;
        let output = "";
        let requiredArgs = "";
        let optionalArgs = "";
        args.forEach((arg) => {
            let _arg = " ";
            // aliases
            for (let i = 0; i < arg.alias.length; i++) {
                // if arg is one letter, one dash (e.g. -a). If it is more than 1 letter, it is a flag (e.g. --apple)
                _arg += " -";
                if (arg.alias[i].length > 1)
                    _arg += "-";
                _arg += arg.alias[i]; // the alias itself
                // if this isn't the last alias, add a comma
                if (i !== arg.alias.length - 1)
                    _arg += ",";
            }
            // usage
            _arg += ` (${arg.type}): ${arg.usage}\n`;
            if (arg.required) {
                requiredArgs += _arg;
            }
            else {
                optionalArgs += _arg;
            }
        });
        if (requiredArgs !== "") {
            output += `\nThis command has the following required arguments:\n${requiredArgs}`;
        }
        if (optionalArgs !== "") {
            output += `\nThis command has additional options available:\n${optionalArgs}`;
        }
        return output;
    }
}