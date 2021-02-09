import yesno from 'yesno';
import os from 'os';
import open from 'open';

import {sync as commandExistsSync} from 'command-exists';
import child_process from 'child_process';
import { error, log, notify } from './stdout';


const Compilers = {
  macos: 'https://developer.apple.com/xcode/',
  windows: 'https://sourceforge.net/projects/mingw/',
  linuxCpp: 'sudo apt install g++',
  linuxC: 'sudo apt install gcc'
}

export const runScript = (command, args, options = {}) => {
  return new Promise((resolve, reject) => {
    const child = child_process.spawn(command, args, options);

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        log(data.toString());
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        error(data.toString());
    });

    child.on('exit', (code) => {
      if (code === 0) {
        notify('Done');
        resolve(true);
      } else {
        error('Something gone wrong, check logs for more details');
        reject();
      }
    });
  })
}

const installCompiler = (isCpp = true) => {
  switch (os.platform()) {
    case 'win32':
      open(Compilers.windows);
      return Promise.resolve(false);
    case 'linux':
      return isCpp ? runScript(Compilers.linuxCpp) : runScript(Compilers.linuxC);
    case 'darwin':
      open(Compilers.macos);
      return Promise.resolve(false);
  }

  return Promise.resolve(true);
}

export const isCompilerExists = (command = 'g++') => {
  const isCpp = command === 'g++';

  if (!commandExistsSync(command)) {
    notify(`${command} command doesn't exist on your machine, would you like to install appropriate software to fix this?`);

    return yesno({
      question: 'Say yes if you want to continue (y/n):'
    }).then((ok) => {
      if (ok) {
        return installCompiler(isCpp);
      }

      return Promise.resolve(false);
    });

  }
  
  return Promise.resolve(true);
}