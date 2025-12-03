import chalk from "chalk";

export function errorClose(message: string): never {
  console.error(chalk.red(message));
  console.error(chalk.red("Exiting..."));
  process.exit(1);
}
