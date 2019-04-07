const word2pdf = require('word2pdf');
const docxConverter = require('docx-pdf');
const moment = require('moment');
var _progress = require('cli-progress');
var _colors = require('colors');
import readline from 'readline'
import fs from 'fs';
import path, { resolve } from 'path';
var bar = new _progress.Bar({}, _progress.Presets['legacy'] || _progress.Presets.shades_classic);
let errfiles=[];
const root = process.cwd();
let completCount = 0;
let paths: {fullPath: string, dest: string, item: string}[] = [];
let timer=null;
async function deepdir(dir: string) {
  let dirs = fs.readdirSync(dir);
  for(let item of dirs) {
    let fullPath = path.resolve(dir+'/'+item);
    if(fs.lstatSync(fullPath).isDirectory()){
      await deepdir(fullPath);
    }else{
      if(fullPath.indexOf('.docx') != -1) {
        let dest = path.dirname(fullPath).replace('word', 'pdf');

        mkdirs(dest);
        // await toPdf(fullPath, dest, item);
        paths.push({
          fullPath: fullPath,
          dest: dest,
          item: item
        });
      }else{
      }
    }
  }
}
async function toPdf(full: string, dest: string, item: string) {
  return new Promise(resolve=>{
    word2pdf(full).then((res: any,err:any)=>{
      // readline.clearLine(process.stdout, 0);
      // readline.cursorTo(process.stdout, 0,0);
      // // readline.moveCursor(process.stdout,0,0);
      // process.stdout.write(String(`${completCount}/${paths.length} ---- `+Math.ceil((completCount/paths.length)*100))+'%','utf-8');
      bar.update(completCount);
      let filename = item.replace('docx', 'pdf');
      try {
        fs.writeFileSync(path.resolve(dest+'/'+filename), res);
        completCount++;
        resolve();
      } catch (error) {
        completCount++;
        resolve();
      }
    })
  }).catch(rs=>{
    completCount++;
    console.log(rs);
  }); 
}
function mkdirs(dirpath: string) {
  if(fs.existsSync(dirpath)) return;
  if (!fs.existsSync(path.dirname(dirpath))) {
    mkdirs(path.dirname(dirpath));
  }
  fs.mkdirSync(dirpath);
}
const convert = async () => {
  await deepdir(path.resolve(root+'/word'));
  bar.start(paths.length, 0);
  for(let i=0; i < paths.length; i++) {
    // let promiseArr = []
    // for(let j = i; j < i+5 && j < paths.length; j++) {
      await toPdf(paths[i].fullPath, paths[i].dest, paths[i].item);
    // }
    // await Promise.all(promiseArr);
  }
  bar.stop();
}

convert().then(()=>{
  console.log('end----------------------------------------------------')
});
