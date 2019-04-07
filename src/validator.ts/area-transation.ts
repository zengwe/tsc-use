import fs from 'fs';
import readline from 'readline';
import path from 'path'
console.log(process.cwd())
let fileStm = fs.createReadStream(path.resolve(process.cwd()+'/src/data/area3.txt'));
let rdLine = readline.createInterface({input: fileStm});
let res: any[] = [];
let idx = 0;
rdLine.on('line', data => {
  let area = data.split(' ');
  if(area[0] == '') {
    area.splice(0, 1)
  }
  area
  if(area.length == 0) return;
  if(/^\d{2}0000$/.test(area[0])) {
    res.push({
      name: area[1],
      code: area[0],
      children: []
    });
    idx++;
  }else{
    if(/^\d{4}00$/.test(area[0])) {
      res[idx - 1].children.push({
        name: area[1],
        code: area[0],
        children: []
      });      
    }else{
      let tem = res[idx - 1];
      for(let item of res[idx - 1].children) {
        if(item.code[2] == area[0][2] && item.code[3] == area[0][3]) {
          item.children.push({
            name: area[1],
            code: area[0],
            children: []
          });
        }
      }
    }
  }
});
rdLine.on('close', () => {
  let dd = fs.createWriteStream(path.resolve(process.cwd()+'/src/data/area3.json'));
  dd.write(JSON.stringify(res));
});