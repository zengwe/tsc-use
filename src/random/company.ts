// 第一位和第二位1-9， A:10,B:11跳过即str的顺序值
import { Generate } from './generate';
export namespace Company {
  const weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
  const numOfcode = '0123456789'; // 80%的权重
  const charaterOfCode = 'ABCDEFGHJKLMNPQRTUWXY'; // 20%的权重
  const str = numOfcode + charaterOfCode;
  export function randomCredit() {
    let code1 = String(Generate.randomNumber(9,1));
    let code2 = String(Generate.randomNumber(9,1));
    let code3_8 = '';
    for(let i = 0; i < 6; i++) {
      code3_8 += randomCode();
    }
    let code9_17 = '';
    for(let i = 0; i < 9; i++) {
      code9_17 += randomCode();
    }
    let code1_17 = code1 + code2 + code3_8 + code9_17;
    return code1_17 + getCheckCode(code1_17);
  }
  function getCheckCode(code: string) {
    let total = 0;
    for(let i = 0; i < 17; i++) {
      total += str.indexOf(code[i]) * weightedfactors[i];
    }
    return str[31 - total % 31]
  }
  function randomCode () {
    let selectAreaCode = Generate.randomNumber(4,0);
    if(selectAreaCode < 4) {
      return String(Generate.randomNumber(9,0));
    }else{
      return charaterOfCode[Generate.randomNumber(charaterOfCode.length - 1, 0)];
    }
  }
}

