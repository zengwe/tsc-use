import xlsx from 'xlsx';
import path from 'path';
import { Folder } from '../algorithm/tree/folder';
const XlsxPopulate = require('xlsx-populate');
var _progress = require('cli-progress');
let root = process.cwd();
/** 
 * 
 * 
 * 
*/
let source = 'D:\\zengwe\\typescript\\excel\\test-data\\excel\\xls';
let endpath = 'D:\\zengwe\\typescript\\excel\\test-data\\excel\\dist\\xls-to-xlsx';
let replaceRules = [
    {
        origin: '发大水发大水',
        now: '发大水发大水 替换了'
    },
    {
        origin: 'CC',
        now: '55'
    }
]
let paths = Folder.traverseFolder(source);
let total = 0;
let complete = 0;
var bar = new _progress.Bar({}, _progress.Presets['legacy'] || _progress.Presets.shades_classic);
let errfile: any[] = [];
function traverseCellOfSheet(sheet: any, callback:(cell: {_value: string,[key: string]: any})=>void) {
    let rows = sheet._rows;
    for(let row of rows) {
        if(row != undefined) {
            let cols = row._cells;
            for(let cell of cols) {
                if(cell != undefined) {
                   callback(cell); 
                }  
            }
        }
    }
}
function xlsxReplace(origin: string, filename: string) {
    try {
        let dirname = path.dirname(origin).replace(source, '');
        let dist = path.resolve(`${endpath}\\${dirname}\\${filename}.xlsx`);
        XlsxPopulate.fromFileAsync(path.resolve(origin))
        .then((workbook:any) => {
        let sheet = workbook._sheets[0];
        traverseCellOfSheet(sheet, (cell)=>{
            if(cell._value != undefined) {
                for(let obj of replaceRules) {
                    try {
                        let dataType = Object.prototype.toString.call(cell._value);
                        if(dataType == '[object String]') {
                            cell._value = cell._value.replace(new RegExp(obj.origin,'g'),obj.now);
                        }
                        if(dataType = '[object Number]') {
                            if(cell._value == obj.origin) {
                                cell._value = obj.now;
                            }
                        }
                    } catch (error) {
                        // cell
                    }
                    
               }
            }
        })
        return workbook.toFileAsync(dist);
    }).catch((err:any)=>{
        console.log(err)
    });
        bar.update(++complete);
    } catch (error) {
        errfile.push(origin);
        // console.log(error)
    }
}

for(let dir of paths) {
    if(dir.type == 'file' && dir.attr && dir.attr.subfix == 'xlsx') {
        total++;
    }
}
bar.start(total, 0);
for(let dir of paths) {
    if(dir.type == 'file' && dir.attr && dir.attr.subfix == 'xlsx') {
        xlsxReplace(dir.dir, dir.attr.name);
    }
}
bar.stop();
console.log('替换中出错误的文件：');
console.log(errfile);