import path from 'path';
import glob from 'glob';

import {
  readFile,
  readFileSync,
  existsSync,
  readdirSync,
  statSync,
  mkdirSync,
  copyFileSync,
  chmodSync,
  createReadStream,
  createWriteStream,
  constants
} from 'fs';

export const loadFile = (filename) => {
  return new Promise((resolve, reject) => {
    readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export const loadFileSync = (filename) => {
  let content;

  try {
    content = readFileSync(filename, {encoding: 'utf8'});
  } catch (err) {
    content = null;
  }

  return content;
};

export const exists = (filename) => {
  return existsSync(filename);
}

export const isSourceFile = (filePath) => [".cpp", ".c"].indexOf(path.extname(filePath)) !== -1;

const getFiles = (dir, exclude, files_) => {
  files_ = files_ || [];
  const files = readdirSync(dir);
  for (let i in files){
      if (exclude.indexOf(files[i]) === -1) {
        const name = dir + '/' + files[i];
        if (statSync(name).isDirectory()){
            getFiles(name, [], files_);
        } else {
            files_.push(name);
        }
      }
  }
  return files_;
}

export const getSources = (baseDir, exclude) => {
  return getFiles(baseDir, exclude).filter(isSourceFile);
}

export const ensureDir = (dirpath) => {
  if (!exists(dirpath)) {
    mkdirSync(dirpath, { recursive: true });
  }
}

export const copyAll = (files, base, dest) => {
  for (let file of files) {

    const resultFiles = glob.sync(path.join(base, file), {});
    for (let targetFile of resultFiles) {
      copyRecursiveSync(
        targetFile,
        path.join(dest, path.basename(targetFile))
      );
    }
  }
}

export const copyRecursiveSync = (src, dest) => {
  let exists = existsSync(src);
  let stats = exists && statSync(src);
  let isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!existsSync(dest)) {
      mkdirSync(dest);
    }
    
    readdirSync(src)
    .forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else if (!existsSync(dest)) {
    createReadStream(src).pipe(createWriteStream(dest));
  }
};