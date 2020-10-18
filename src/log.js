const chalk = require('chalk');

export function info (...args) { console.log(chalk.cyan(...args)) }
export function warning (...args) { console.log(chalk.yellow(...args))}
export function error (...args) { console.log(chalk.red(...args)) }
