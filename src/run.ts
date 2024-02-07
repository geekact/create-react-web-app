import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import Ora from 'ora';
import chalk from 'chalk';

const execPromisify = promisify(exec);

export const runShell = async (command: string) => {
  await execPromisify(command, {
    cwd: process.cwd(),
    env: process.env,
  });
};

const ora = Ora();

export const runCommand = async (message: string, fn: () => Promise<any>) => {
  ora.start(message);
  try {
    await fn();
    ora.succeed();
  } catch (e) {
    ora.fail(chalk.red((e as Error).message || 'Error'));
    process.exit(1);
  }
};
