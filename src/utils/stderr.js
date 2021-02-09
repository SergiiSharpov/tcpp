import chalk from "chalk";

export const quit = (msg) => {
  if (msg) {
    console.log(chalk.red(msg));
  }

  process.exitCode = 1; // the process exit gracefully.

  return false;
}