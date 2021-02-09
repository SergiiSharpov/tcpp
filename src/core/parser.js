import path from 'path';

import { exists, loadFileSync } from '../utils/fileLoader';
import { ConfigParser, getCurrentOS } from './config';
import { isCompilerExists } from '../utils/compiler';
import { ProjectProcessor } from './projectProcessor';
import { quit } from '../utils/stderr';

const ENTRY_FORMAT = {
  CPP: 0,
  C: 1,
  UNDEFINED: 2
}
const entryPointFormat = (fileName) => {
  if (fileName.indexOf('.cpp') !== -1) {
    return ENTRY_FORMAT.CPP;
  } else if (fileName.indexOf('.c') !== -1) {
    return ENTRY_FORMAT.C;
  }

  return ENTRY_FORMAT.UNDEFINED;
}

export const parse = (directory, task, os = null, configName = 'config.json') => {
  if (!task) {
    return quit("Task isn't defined");
  }

  if (!exists(directory)) {
    return quit("Directory doesn't exist");
  }

  const configPath = path.join(directory, configName);

  if (!exists(configPath)) {
    return quit("Config file doesn't exist");
  }

  const configContent = loadFileSync(configPath);
  const config = new ConfigParser(JSON.parse(configContent));

  if (!config.setTarget(os || getCurrentOS())) {
    return quit("Can't set current target");
  }

  if (!config.setTask(task)) {
    return quit("Can't set task");
  }

  if (entryPointFormat(config.task.main || "") === ENTRY_FORMAT.UNDEFINED) {
    return quit("Entry point format is not C/C++");
  }

  // if (!isCompilerExists()) {
  //   return quit("Can't find g++ command");
  // }

  const processor = new ProjectProcessor(config, directory);

  return processor;
}
