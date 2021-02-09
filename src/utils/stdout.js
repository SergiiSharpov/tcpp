import chalk from 'chalk';

export const log = (msg) => console.log(msg);
export const notify = (msg) => console.log(chalk.green(msg));
export const error = (msg) => console.log(chalk.red(msg));