import os from 'os';
import { quit } from '../utils/stderr';


export const OS = {
  any: null,
  windows: 'windows',
  windows64: 'windows64',
  linux: 'linux',
  android: 'android',
  iOS: 'ios',
  macOS: 'mac'
}

export const OSValues = Object.values(OS);

const isOSExists = (os = null) => Object.values(OS).indexOf(os) !== -1;

export const getCurrentOS = () => {
  switch (os.platform()) {
    case 'android':
      return OS.android;
    case 'win32':
      return (os.arch() === 'x32') ? OS.windows : OS.windows64;
    case 'linux':
      return OS.linux;
    case 'darwin':
      return OS.macOS;
    default:
      return OS.any;
  }
}

/**
 * List of available properties:
 * 
 * include
 * libs
 * libFolder
 * flags
 * std
 * main
 * src
 * srcDir
 * autoSrc
 * out
 * compiler
 * 
 */

const getOSObject = (data, os = null) => {
  if (os !== null) {
    return data[os] || data.default || data;
  }

  return data.default || data;
}

const isBoolean = val => 'boolean' === typeof val;

const getFlatOSObject = (data, os, parent = {}) => {
  const base = getOSObject(data, os);

  if (base === null || base.hasOwnProperty('length') || isBoolean(base)) { // Check if array or string or bool
    return base;
  }

  for (let key of Object.keys(base)) {
    if (base[key] === null || base[key].hasOwnProperty('length') || isBoolean(base[key])) { // Check if array or string
      parent[key] = base[key];
    } else {
      parent[key] = getFlatOSObject(base[key], os, {});
      
    }
  }

  return parent;
}

export class ConfigParser {
  target = OS.any;

  task = null;
  config = null;

  constructor(config = {}) {
    this.config = config;
  }

  setTarget(target) {
    if (!isOSExists(target)) {
      return quit(`${target} target doesn't exists`);
    }

    this.target = target;
    if (this.taskName) {
      return this.setTask(this.taskName);
    }

    return true;
  }

  setTask(name) {
    let task = this.config[name];
    if (!task) {
      return quit(`Task "${name}" doesn't exists`);
    }

    this.taskName = name;
    this.task = getFlatOSObject(task, this.target);

    return true;
  }
}