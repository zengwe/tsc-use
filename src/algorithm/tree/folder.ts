import fs from 'fs';
import path from 'path';
export namespace Folder {
  function throughDir(dir: string, type: 'depth', callback: (direct: string, type: 'file'|'folder'|'empty' )=>void ){
    let dirs = fs.readdirSync(dir);
    if(dirs.length == 0) {
      return false;
    }
    for(let childDir of dirs) {
      let fullPath = path.resolve(`${dir}/${childDir}`);
      if(fs.lstatSync(fullPath).isDirectory()){
        if(type == 'depth') {
          if(throughDir(fullPath, type, callback) == false) {
            callback(fullPath,'empty');
          }else{
            callback(fullPath,'folder');
          }
        }
      }else{
        callback(fullPath, 'file');
      }
    }
  }
  export function traverseFolder(dir: string, hasEmpty: boolean = false) {
    let paths: {type: 'file'|'folder', dir: string, isEmpty: boolean, attr?: {subfix: string, name: string, full: string}}[] = [];
    dir = path.resolve(dir);
    throughDir(dir, 'depth', (fullpath, type) => {
      if(type == 'empty') {
        paths.push({
          type: 'folder',
          dir: fullpath,
          isEmpty: true
        });
      }else if(type == 'folder') {
        paths.push({
          type: 'folder',
          dir: fullpath,
          isEmpty: false
        });
      }else{
        let dirname = path.dirname(fullpath);
        let filename = fullpath.replace(dirname+'\\', '');
        let extnames=filename.split('.');
        paths.push({
          type: 'file',
          dir: fullpath,
          isEmpty: false,
          attr: {
            subfix: extnames[1],
            name: extnames[0],
            full: extnames[0] + '.' + extnames[1]
          }
        });
      }
    });
    return paths;
  }
  export function mkdirs(dirpath: string) {
    let dirname = path.dirname(dirpath);
    if(fs.existsSync(dirname)) return;
    if (!fs.existsSync(dirname)) {
      mkdirs(dirname);
    }
    fs.mkdirSync(dirname);
  }
}