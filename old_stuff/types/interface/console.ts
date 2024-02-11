export type ParsedArgs = {
    [key: string]: boolean | number | string;
};
  
export type ErrorResult = string;
  
export type ParseResult = ParsedArgs | ErrorResult;

export type CommandHistory = any;