import { CommandHandler } from "./commandhandler";
import { Argument, GlobalCommands } from "../types/interface/commands.js";

const commandHandler = new CommandHandler();
const globalCommands: GlobalCommands = {
	"help": {
		"description": "Displays a list of available commands, or details about a given command",
		"arguments": [
			{
				alias: ["c", "command"],
				required: false,
				type: "string",
				usage: "Displays information about the given command"
			},
			{
				alias: ["?", "t", "tutorial"],
				required: false,
				type: "boolean",
				usage: "Displays a tutorial on how to use the console",
			}
		],
		"run": function(args: any) { //fuck ts
			if (args.tutorial) {
				let output = "--The Console for Dummies--\n";
				output += "The console is a command line interface that allows you to interact with the game.\n"
				output += "To use the console, simply type a command and press enter. For example, to run the help command, type 'help' and press enter.\n";
				output += "Most commands have arguments. Some are required, and some are optional. Arguments are separated by spaces, and each one starts with a flag (for instance, '-t' or '--tutorial').\n";
				output += "Arguments can have many different types, which are boolean, number, and string.\n";
				output += "A boolean is either true or false, but just by specifying the flag, you are already making it true (which is almost always what you want). For instance, the tutorial argument in 'help --tutorial', which is a boolean, has been made true since you specified it. If you need a value to be false, just leave out the flag. If you're an overachiever, you can also type '--tutorial false' or '--tutorial true', which will make the argument false or true respectively.\n";
				output += "Strings and numbers require a little more than just specifying the flag. They need to be followed up by a value.\n"
				output += "For instance, the command 'help --command' requires a string argument. If you wanted to get help about the 'add' command, you would type 'help --command add'. Note that if you add additional spaces (like 'help --command add a number'), it will interpret those as additional arguments, resulting in an error.\n"
				output += "Number arguments will convert the value to a number, and if it fails, it will return an error. For instance, 'add --num1 10 --num2 twenty' would fail, because num2 is not a number.\n"
				output += "Most flags have additional aliases, which you can use to increase your productivity. For instance, in the 'help' command, the '-c' flag is the same as '--command' (so 'help -c [command]' is just as functional as 'help --command [command]'). If you are an overachiever, however, you will always want to type out the longest alias. So, just run 'help --command [command]', and pick out the longest aliases for each command.\n";
				output += "That concludes the tutorial. If you have additional questions, you're fucked. Good luck!";
				return output;
			}

			if (!args.command) {
				var commands = Object.keys(globalCommands);
				var output = "Run 'help --command [command]' to get more information about a specific command\n";
				output += "Run 'help --tutorial' for a tutorial on how to use the console\n\n";
				output += "The following commands are available:\n"
				for (var i = 0; i < commands.length; i++) {
					console.log(commands[i] + " a");
					output += `  ${commands[i]}: ${globalCommands[commands[i]].description}`;
				}
				return output;
			} else {
				var command = args.command;
				if (globalCommands[command]) {
					return `Displaying info for command '${command}':\nDescription: ${globalCommands[command].description}${commandHandler.renderArgs(globalCommands[command].arguments)}`;
				} else {
					return `Command '${command}' not found\n${commandHandler.renderArgs(this.arguments)}`;
				}
			}
		}
	},
	"add": {
		"description": "Adds two numbers together",
		"arguments": [
			{
				alias: ["a", "num1"],
				required: true,
				type: "number",
				usage: "The first number to be added together"
			},
			{
				alias: ["b", "num2"],
				required: true,
				type: "number",
				usage: "The second number to be added together"
			}
		],
		"run": function(args: any) {
			return `What makes you think I'm going to add ${args.num1} and ${args.num2} for you? Go do it yourself, you lazy bum!`;
		}
	}
}

export { globalCommands };