// @ts-nocheck

import { globalCommands } from "./src/js/commands.js";
import { Command, Argument } from "./src/js/types/interface/commands.js";
import { CommandHandler } from "./src/js/commandHandler.js";
import { CommandHistory } from "./src/js/types/interface/console.js"
/*function parseArgs(command, args) {
	console.log(args);
	if (!checkRequiredArgsPresent(command, args)) {
		return "Required argument(s) not present!";
	}

	output = {};
	for (let i = 0; i < args.length; i++) {
		if (args[i] === "") continue;

		let arg;
		if (args[i].startsWith("--")) {
			arg = args[i].slice(2);
		} else if (args[i].startsWith("-")) {
			arg = args[i].slice(1);
		} else {
			// throw ("FUCK"); I wish
			return `Argument '${args[i]}' is not valid`;
		}

		let present = false;
		for (let j = 0; j < command.arguments.length; j++) {
			const alias = command.arguments[j].alias; // this is an array btw
			const type = command.arguments[j].type;
			const next = args[i + 1];
			if (alias.includes(arg)) {
				if (!verifyType(next, type)) {
					return `Argument '${args[i]}' is not of right type`;
				}

				if (type === "boolean" && (next === undefined || next === "" || next.startsWith("-"))) {
					output[alias[alias.length - 1]] = true;
				} else if (type === "boolean") {
					output[alias[alias.length - 1]] = next === "true";
					i++;
				} else if (type === "number") {
					output[alias[alias.length - 1]] = Number(next);
					i++;
				} else {
					output[alias[alias.length - 1]] = args[i + 1];
					i++; // next arg is actually just this one
				}
				present = true;
				break;
			}
		}
		if (!present) return `Argument '${arg}' not found`;
	}
	console.log(output);
	return output;
}

function checkRequiredArgsPresent(command, args) {
	for (let i = 0; i < command.arguments.length; i++) {
		if (!command.arguments[i].required) continue;
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
}*/

// when form is submitted, we need to do a few things
// 1. FUCK THIS FORM

// this function takes a string and returns an array of characters
// it then adds a `br` tag at the start
function separateChars(text: string) {
	const arr = text.split("");
	arr.unshift("\n");
	return arr;
}

// copy pasted from stack overflow but should just generate a random number between
// min (inclusive) max (inclusive)
function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Default console variables

const commandHandler = new CommandHandler({});
let commandHistory: CommandHistory = {
	commands: [],
	index: -1,
	saved: "",
}
let command = "";
let consoleHistory = "Booting system...\n"; // loading webpage placeholder
let canType = false;

startConsole();
// i don't like this nesting :sob:
// why *would* you like it? LOL
// i am going to rewrite this eventually
function startConsole() {
	animateConsoleText("Logging in", 10, () => {
		animateConsoleText("...", 200, () => {
			animateConsoleText(" ", 1000, () => {
				animateConsoleText(`\nWelcome, User! Run 'help' for a list of commands, or run 'help --tutorial' for a tutorial on how to use the console.\n\n`, 10, () => {
					renderConsole();
					canType = true;
				});
			});
		});
	}); // lol // what the fuck
	// i ran the formatter and its worse,, 
}

function runCommand(command: string) {
	// we should create a class for managing the console
	const splitCmd = command.split(" ");
	console.log(splitCmd);
	const cmd = globalCommands[splitCmd[0]];
	const args = splitCmd.slice(1);

	if (cmd === undefined) {
		animateConsoleText(`'${cmd}' was not found in the list of commands. Run 'help' for a list of commands.\n`, 10, () => {
			consoleHistory += "\n";
			renderConsole();
			canType = true;
		});

		return;
	}

	const _args = commandHandler.parseArgs(cmd, args);
	// it will return a string if there are errors
	if (typeof (_args) == "string") {
		animateConsoleText(`${_args}\n${commandHandler.renderArgs(cmd.arguments)}`, 10, () => {
			consoleHistory += "\n";
			renderConsole();
			canType = true;
		});
		// you don't want to see what happens if you put the return inside the callback. trust me
		return;
	}

	const output = cmd.run(_args);
	let outputSpeed = 10;
	if (output.length > 100) outputSpeed = 5;
	if (output.length > 350) outputSpeed = 1;
	console.log(outputSpeed);
	animateConsoleText(output + "\n", outputSpeed, () => {
		consoleHistory += "\n";
		renderConsole();
		canType = true;
	});
}

// this might be more readable with method-chaining as opposed to callbacks
function animateConsoleText(text: string, speed: number, callback: Function) {
	let index = 0;
	const loop = setInterval(() => {
		consoleHistory += text[index];
		if (speed < 10 && index < text.length - 1) {
			index++;
			consoleHistory += text[index];
		}
		if (speed < 3 && index < text.length - 1) {
			index++;
			consoleHistory += text[index];
		}
		renderConsole(consoleHistory, true);

		index++;
		if (index >= text.length) {
			window.clearTimeout(loop);
			callback();
		}
	}, speed)
}

function addToCommandHistory(command: string) {
	commandHistory.index = -1;
	commandHistory.saved = "";

	if (commandHistory.commands[0] === command) {
		return;
	}

	commandHistory.commands.unshift(command); // add to beginning of array
}

$(document).keydown((e) => {
	if (!canType) {
		return;
	}
	// console.log(e.key);

	if (e.key.length === 1) {
		command += e.key.toLowerCase();
		commandHistory.index = -1;
		commandHistory.saved = command;
	}
	if (e.key === "Backspace") {
		command = command.slice(0, -1);
		commandHistory.index = -1;
		commandHistory.saved = command;
	}
	if (e.key === "Escape") {
		command = "";
		commandHistory.index = -1;
		commandHistory.saved = command;
	}
	if (e.key === "ArrowUp") {
		e.preventDefault(); // prevents scrolling
		if (commandHistory.index >= commandHistory.commands.length - 1) {
			return;
		}

		commandHistory.index++;
		command = commandHistory.commands[commandHistory.index];
	}
	if (e.key === "ArrowDown") {
		e.preventDefault(); // prevents scrolling
		console.log(commandHistory.index);
		if (commandHistory.index <= -1) return;
		commandHistory.index--;

		if (commandHistory.index === -1) {
			command = commandHistory.saved;
		} else {
			command = commandHistory.commands[commandHistory.index];
		}
	}
	if (e.key === "Enter") {
		if (command === "") {
			return;
		}

		canType = false;
		runCommand(command);
		addToCommandHistory(command);
		consoleHistory += "CONSOLE> " + command + "\n";
		command = "";
	}

	renderConsole(consoleHistory + "CONSOLE> " + command);
});

// Renders text to the console. If no args are presented, it renders
// the console history and a spot for you to type (with the cursor visible)
function renderConsole(text?: string, hideCursor = false) {
	const consoleOutput = $("#console-output");

	if (text === undefined) {
		text = consoleHistory + "CONSOLE> ";
	}
	if (!hideCursor) {
		text += `<span class="console-cursor" id="console-cursor">&#9646;</span>`;
	}

	// <pre> assumes that the text is formatted; this should keep things sexy
	consoleOutput.html(`<p><pre>${text}</pre></p>`);
	// Scroll to the bottom of the console (apparently consoleOutput is an array?)
	consoleOutput.scrollTop(consoleOutput[0].scrollHeight);
}