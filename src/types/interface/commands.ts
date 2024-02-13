export interface Argument {
  alias: string[];
  required: boolean;
  type: string;
  usage: string;
}

export interface Command {
  description: string;
  arguments: Argument[];
  run: Function;
}

export interface GlobalCommands {
    [key: string]: Command;
}

// this still feels kinda cringe but at least its defined
export interface CommandRunArgs {
  [key: string]: number | string | boolean;
}