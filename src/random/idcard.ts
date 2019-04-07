import { AREA_TREE } from '../data/area';
import { Generate } from './generate';
import fs from 'fs';
export namespace IdCard {
  let tempAreaStr = JSON.parse(fs.readFileSync(process.cwd()+'\\src\\data\\area3.json').toString()) as INode[];
  export function areaNum(code: number = 0) {
    if(code == 0) {
      return randomTreeRoot(tempAreaStr).code;
    }else{
      let res = IdCard.findArea(tempAreaStr, 'code', code);
      if(res != null) {
        if(res.children.length == 0) {
          return res.code;
        }else{
          let randomCode  = IdCard.randomTreeRoot(res.children);
          return randomCode['code'];          
        }
      }else{
        return null;
      }
    }
  }
  export interface IRandomIdNumber {
    code: number;
    age: { max: number, min: number},
    gender: 0|1|2
  }
  function fullZorro(num: number, count: number) {
    return new Array(count  - String(num).length).fill('0').join('') + num;
  }
  export function randomIdNumber(param?: Partial<IRandomIdNumber>) {
    let paramobj: IRandomIdNumber = Object.assign({
      code: 0,
      age: { max: 60, min: 20},
      gender: 0
    }, param == undefined ? {} : param);
    let oneYearTimestamp =  365 * 24 * 60 * 60 * 1000;
    let timesmp = Generate.randomNumber(paramobj.age.max * oneYearTimestamp, paramobj.age.min * oneYearTimestamp);
    let birthSmp =  new Date(new Date().getTime() - timesmp);
    let area = areaNum(paramobj.code);
    let year = birthSmp.getFullYear();
    let month = fullZorro(birthSmp.getMonth() + 1, 2);
    let day = fullZorro(birthSmp.getDay() + 1, 2);
    let order = Generate.randomNumber(98,1);
    if(paramobj.gender == 1) {
      if(order % 2 == 0) {
        order+=1;
      }
    }else if(paramobj.gender == 2) {
      if(order % 2 == 1) {
        order+=1;
      }
    }
    let orderStr =  fullZorro(order, 3);
    let perCode = area + year + month + day + orderStr;
    return perCode + calculateLastNumber(perCode);
  }
  function calculateLastNumber(code: string) {
    let determinant = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let total = 0;
    for (let i = 0; i < 17; i++) {
      total += Number(code[i]) * determinant[i];
    }
    let lastCodes = ['1','0','X', '9', '8' ,'7' ,'6' ,'5' ,'4' ,'3' ,'2'];
    let index = total % 11;
    return lastCodes[index];
  }
  export function randomTreeRoot(node: INode[]): INode {
    let idx = Generate.randomNumber(node.length - 1);
    if(node[idx].children == undefined || node[idx].children == null || node[idx].children.length == 0) {
      return node[idx];
    }else{
      return randomTreeRoot(node[idx].children);
    }
  }
  export function findArea(tree: INode[],key: string, value: any): (null|INode) {
    for(let item of tree) {
      if(item[key] == value) {
        return item;
      }else{
        let res = findArea(item.children, key, value)
        if(res != null) {
          return res;
        }
      }
    }
    return null;
  }
  interface INode {
    children: INode[]
    [key: string]: any;
  }
}
