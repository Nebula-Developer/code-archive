import Readline from "readline";
import { colorString, formatString } from "../logger";
import { castString } from "./strings";

/** A readline interface for reading user input. */
const rl = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Prompts the user for input, and casts the result to the specified type.
 * @param question The question to ask the user.
 * @param defaultValue The default value to use if the user enters nothing.
 * @returns A promise that resolves with the user's input.
 */
export function input<T>(
  question: string,
  defaultValue: T = "" as unknown as T,
): Promise<T> {
  return new Promise((resolve) =>
    rl.question(
      colorString(formatString(question) + " ", [100, 150, 255]),
      (res) => {
        if (res === "") resolve(defaultValue);
        else resolve(castString(res, typeof defaultValue) ?? defaultValue);
      },
    ),
  );
}
