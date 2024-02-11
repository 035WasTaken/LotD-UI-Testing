class CommandHandler {

	terminal = null;

	/**
	 * @param {Object} terminal - The terminal object to use
	 */
	constructor(terminal) {
		// no type checking just yet
		this.terminal = terminal;
	}

	/**
	 * @param {Object} command
	 * @param {string[]} args
	 * @returns {string}
	 *
	 * Parse command arguments and return a string to be displayed to the user
	 */
	parseArgs(command, args) {
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
	/**
	 * @param {Object} command
	 * @param {string[]} args
	 * @returns {bool}
	 *
	 * Checks if all required arguments are present
	 */
	checkRequiredArgsPresent(command, args) {
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
	}
}