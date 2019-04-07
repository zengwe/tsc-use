import { PersonIdCard } from './persion-id-card';
export const checkIdCard = (function () {
  return function (card: string) {
    if (PersonIdCard.check(card) == PersonIdCard.CardError.success) {
      return true;
    } else {
      return false;
    }
  }
})();
export function checkPhone(phone: number | string): boolean {
  let pho = String(phone);
  if (!(/^1[34578]\d{9}$/.test(pho))) {
    return false;
  }
  return true;
}
export function checkEmail(email: string): boolean {
  let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  return reg.test(email);
}
export function checkJustNumberCharacter(str: string): boolean {
  let reg = /^[0-9a-zA-Z]*$/;
  return reg.test(str);
}
export function checkNumber(str: number | string) {
  let reg = /^[0-9]+$/;
  return reg.test(String(str));
}
export function checkJustCharater(str: string): boolean {
  return /^[a-zA-Z]*$/.test(str);
}
export function checkJustChineseCharater(str: string): boolean {
  return /^[\u0391-\uFFE5]+$/.test(str);
}
export function checkCharaterUpper(str: string) {
  if (str.length != 1) return false;
  if (/[A-Z]/.test(str)) {
    return true;
  }
  return false;
}
export function checkCharaterLower(str: string): boolean {
  if (str.length != 1) return false;
  if (/[a-z]/.test(str)) {
    return true;
  }
  return false;
}
export const checkHasSpecialCharater = (function () {
  let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
  let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
  return function (str: string) {
    if (regCn.test(str) || regEn.test(str)) {
      return true;
    } else {
      return false;
    }
  };
})();
export function CheckSocialCreditCode(Code: string) {
  var patrn = /^[0-9A-Z]+$/;
  //18位校验及大写校验
  if ((Code.length != 18) || (patrn.test(Code) == false)) {
    alert("不是有效的统一社会信用编码！");
  }
  else {
    var Ancode;//统一社会信用代码的每一个值
    var Ancodevalue;//统一社会信用代码每一个值的权重 
    var total = 0;
    var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];//加权因子 
    var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
    //不用I、O、S、V、Z 
    for (var i = 0; i < Code.length - 1; i++) {
      Ancode = Code.substring(i, i + 1);
      Ancodevalue = str.indexOf(Ancode);
      total = total + Ancodevalue * weightedfactors[i];
      //权重与加权因子相乘之和 
    }
    var logiccheckcode: any = 31 - total % 31;
    if (logiccheckcode == 31) {
      logiccheckcode = 0;
    }
    var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
    var Array_Str = Str.split(',');
    logiccheckcode = Array_Str[logiccheckcode];
    var checkcode = Code.substring(17, 18);
    if (logiccheckcode != checkcode) {
      alert("不是有效的统一社会信用编码！");
    }
  }
}

