import path from 'path';
import Node from './node';

import { quit } from '../utils/stderr';
import { copyAll, ensureDir, exists, getSources, isSourceFile, loadFileSync } from '../utils/fileLoader';
import { isCompilerExists, runScript } from '../utils/compiler';
import { notify } from '../utils/stdout';

const globalIncludesRegExp = /#include\s*<([^>]*)>/gi
const localIncludesRegExp = /#include\s*"([^"]*)"/gi

export const parseText = (content, parent, rootName) => {
  let root = parent;
  
  if (!root) {
    root = new Node();
    root.name = rootName || 'root';
  }

  const globalMatches = content.matchAll(globalIncludesRegExp);

  for (const match of globalMatches) {
    let node = new Node();
    node.name = path.normalize(match[1]);
    node.isGlobal = true;

    root.append(node);
  }

  const localMatches = content.matchAll(localIncludesRegExp);

  for (const match of localMatches) {
    let node = new Node();
    node.name = path.normalize(match[1]);
    node.isGlobal = false;

    root.append(node);
  }

  return root;
}

const getArrayView = (item, parent = []) => {
  if (!item) {
    return [];
  }

  if (Array.isArray(item)) {
    for (let part of item) {
      getArrayView(part, parent);
    }

    return parent;
  }

  if (item.length) {
    for (let part of item.split(' ')) {
      parent.push(part);
    }
  }

  return parent;
}

const getCompiler = (filename) => (filename.indexOf('.cpp') !== -1) ? 'g++' : ((filename.indexOf('.c') !== -1) ? 'gcc' : null);

export class ProjectProcessor {
  config = null;
  basePath = null;

  includes = new Set();// -I
  sources = new Map();// source nodes
  headers = new Map();// header nodes
  libs = new Set();// -l
  libFolders = new Set();// -L
  copy = new Set();// Files to copy
  flags = new Map();// additional flags, such as --std, -W, etc.

  build = {
    command: 'g++',
    args: [],
    directory: './'
  }

  constructor(config, basePath) {
    this.config = config.task;
    this.basePath = basePath;
  }

  checkCompiler() {
    this.build.command = this.config.compiler || null;
    if (!this.build.command) {
      if (this.config.main) {
        this.build.command = getCompiler(this.config.main);
      }
    }

    if (!this.build.command) {
      return Promise.reject("Can't determine a correct compiler, check your project configuration");
    }
    
    return isCompilerExists(this.build.command);
  }

  __filePath(headerName, pointerPath, basePath) {
    const resultLocalPath = pointerPath ? path.join(pointerPath, headerName) : headerName;
    if (exists(resultLocalPath)) {
      return resultLocalPath;
    }

    const includeDirs = this.config.include ? (Array.isArray(this.config.include) ? this.config.include : [this.config.include]) : [];

    for (let includeDir of includeDirs) {
      const resultGlobalPath = path.join(basePath, includeDir, headerName);
      
      if (exists(resultGlobalPath)) {
        return resultGlobalPath;
      }
    }

    return null;
  }

  __parseFiles(filePath, basePath, pointerPath, currentNode) {
    let headerPath = this.__filePath(filePath, pointerPath, basePath);

    if (!headerPath) {
      if (!currentNode) {
        return quit(`Entry point file doesn't exist, aborting...`);
      }

      return false;
    }

    if (this.headers.has(headerPath) || this.sources.has(headerPath)) {
      return false;
    }

    const currentPointerPath = path.dirname(headerPath);

    const headerContent = loadFileSync(headerPath);
    const resultNode = parseText(headerContent, currentNode, path.normalize(headerPath));

    if (isSourceFile(headerPath)) {
      this.sources.set(headerPath, resultNode);
    } else {
      this.headers.set(headerPath, resultNode);
    }

    for (let child of resultNode.children) {
      this.__parseFiles(child.name, currentPointerPath, basePath, child);
    }

    return true;
  }

  __parseConfigSources() {
    const sources = getArrayView(this.config.src);

    for (let source of sources) {
      const file = path.basename(source);
      const base = path.dirname(source);
      this.__parseFiles(file, base, base);
    }

    return true;
  }

  __parseSourcesAuto() {
    const baseDir = this.config.srcDir ? path.join(this.basePath, this.config.srcDir) : this.basePath;
    const exclude = [];
    if (this.config.include) {
      if (Array.isArray(this.config.include)) {
        exclude.push(...this.config.include);
      } else {
        exclude.push(this.config.include);
      }
    }

    const files = getSources(baseDir, exclude);
    for (let source of files) {
      const file = path.basename(source);
      const base = path.dirname(source);
      this.__parseFiles(file, base, base);
    }

    return true;
  }

  __processAdditional() {
    const includes = getArrayView(this.config.include);
    const libFolders = getArrayView(this.config.libFolder);
    const libs = getArrayView(this.config.libs);
    const flags = getArrayView(this.config.flags);
    const copy = getArrayView(this.config.copy);

    this.includes = new Set(includes);
    this.libFolders = new Set(libFolders);
    this.libs = new Set(libs);
    this.flags = new Set(flags);
    this.copy = new Set(copy);
  }

  process() {
    notify('Collecting source files...');

    if (!this.config) {
      return quit("Config was not set");
    }

    if (!this.basePath) {
      return quit("Base path was not set");
    }

    if (!this.config.main) {
      return quit("Entry point was not set");
    }

    const entryPointSuccess = this.__parseFiles(this.config.main, this.basePath, this.basePath);

    if (!entryPointSuccess) {
      return quit("Project parsing error.");
    }

    this.__parseConfigSources();

    if (this.config.autoSrc) {
      this.__parseSourcesAuto();
    }
    
    this.__processAdditional();

    return true;
  }

  execute() {
    notify('Compiling the project...');

    notify('Ensuring that output dir exists');
    ensureDir(this.build.directory);

    notify('Copying assets');
    copyAll(this.copy, this.basePath, this.build.directory);

    notify(`Running build command: ${this.build.command} ${this.build.args.join(' ')}`);
    notify('Compiling...');

    runScript(this.build.command, this.build.args, {cwd: this.build.directory});
  }

  compile() {
    notify('Compiling resulting cli command...');

    const args = [];

    if (this.config.std) {
      args.push('--std', this.config.std);
    }

    for (let flag of this.flags) {
      args.push(flag);
    }

    const resultDir = path.join(this.basePath, this.config.out.base);

    for (let source of this.sources) {
      args.push(path.relative(resultDir, source[0]));
    }

    for (let include of this.includes) {
      const includeDir = path.join(this.basePath, include);
      args.push(`-I${path.relative(resultDir, includeDir)}`);
    }

    for (let libFolder of this.libFolders) {
      const libDir = path.join(this.basePath, libFolder);
      args.push(`-L${path.relative(resultDir, libDir)}`);
    }

    for (let lib of this.libs) {
      args.push(`-l${lib}`);
    }

    args.push('-o', this.config.out.name + '.' + this.config.out.target);

    this.build.args = args;
    this.build.directory = resultDir;

    return true;
  }

}