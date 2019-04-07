export namespace PersonIdCard {
  export enum CardError {
    success,
    lengthError,
    wrong,
    checkCodeError,
    areaIllegal
  }
  export const area: {[key: string]: any} = {
    '11': "北京",'12': "天津",'13': "河北",'14': "山西",'15': "内蒙古",'21': "辽宁",'22': "吉林",'23': "黑龙江",'31': "上海",'32': "江苏",
    '33': "浙江",'34': "安徽",'35': "福建",'36': "江西",'37': "山东",'41': "河南",'42': "湖北",'43': "湖南",'44': "广东",'45': "广西",'46': "海南",
    '50': "重庆",'51': "四川",'52': "贵州",'53': "云南",'54': "西藏",'61': "陕西",'62': "甘肃",'63': "青海",'64': "宁夏",'65': "新疆",'71': "台湾",'81': "香港",
    '82': "澳门",'91': "国外"
  };
  export interface  IGerGenderParam {
    man: string;
    woman: string;
    unkonw: string;
  };
  const DefaultGerGenderParam: IGerGenderParam = {
      man: "男",
      woman: "女",
      unkonw: "未知"
  }
  export function getGender( psidno: string,param: IGerGenderParam = DefaultGerGenderParam) {
    let sexno;
    if (psidno.length == 18) {
      sexno = psidno.substring(16, 17);
    } else if (psidno.length == 15) {
      sexno = psidno.substring(14, 15);
    } else {
      return param.unkonw;
    }
    let tempid = Number(sexno) % 2;
    if (tempid == 0) {
      return param.woman;
    } else {
      return param.man;
    }
  }
  export function check(idcard: string): CardError {
    let  Y, JYM;
    let S, M;
    let idcard_array = new Array();
    idcard_array = idcard.split("");
    //地区检验
    let areaId: string = idcard.substr(0, 2);
    if (area[areaId] == null)
      return CardError.areaIllegal;
    //身份号码位数及格式检验
    let ereg: RegExp;
    switch (idcard.length) {
      case 15:
        if (
          (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 ||
          ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 &&
            (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)
        ) {
          //测试出生日期
          ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //的合法性
        } else {
          ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
        }
        if (ereg.test(idcard)) return CardError.success;
        else return CardError.wrong;

        break;
      case 18:
        if (
          parseInt(idcard.substr(6, 4)) % 4 == 0 ||
          (parseInt(idcard.substr(6, 4)) % 100 == 0 &&
            parseInt(idcard.substr(6, 4)) % 4 == 0)
        ) {
          //闰年出生日期的合法性正则表达式
          ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; 
        } else {
          //平年出生日期的合法性正则表达式
          ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; 
        }
        if (ereg.test(idcard)) {
          //测试出生日期的合法性
          //计算校验位
          S =
            (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 +
            (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 +
            (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 +
            (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 +
            (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 +
            (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 +
            (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 +
            parseInt(idcard_array[7]) * 1 +
            parseInt(idcard_array[8]) * 6 +
            parseInt(idcard_array[9]) * 3;
          Y = S % 11;
          M = "F";
          JYM = "10X98765432";
          M = JYM.substr(Y, 1); //判断校验位
          if (M == idcard_array[17]) return CardError.success;
          //检测ID的校验位
          else return CardError.checkCodeError;
        } else return CardError.wrong;
        break;
      default:
        return CardError.lengthError;
    }
  }
  interface ICallback<T = any> {
    (year: string, month: string, day: string): T;
  }
  export function getBirthday<T>(psidno: string, split: string | ICallback<T> = "-") {
    let birthdayno, birthdaytemp;
    if (psidno.length == 18) {
      birthdayno = psidno.substring(6, 14);
    } else if (psidno.length == 15) {
      birthdaytemp = psidno.substring(6, 12);
      birthdayno = "19" + birthdaytemp;
    } else {
      return false;
    }
    var birthday =
      birthdayno.substring(0, 4) +
      "-" +
      birthdayno.substring(4, 6) +
      "-" +
      birthdayno.substring(6, 8);
    if (Object.prototype.toString.call(split) == "[object String]") {
      return (
        birthdayno.substring(0, 4) +
        split +
        birthdayno.substring(4, 6) +
        split +
        birthdayno.substring(6, 8)
      );
    } else {
      return (<ICallback<T>>split)(
        birthdayno.substring(0, 4),
        birthdayno.substring(4, 6),
        birthdayno.substring(6, 8)
      );
    }
  }
  export function getAge(identityCard: string) {
    var len = (identityCard + "").length;
    if (len == 0) {
      return 0;
    } else {
      if (len != 15 && len != 18) {
        return 0;
      }
    }
    var strBirthday = "";
    if (len == 18) {
      //处理18位的身份证号码从号码中得到生日和性别代码
      strBirthday =
        identityCard.substr(6, 4) +
        "/" +
        identityCard.substr(10, 2) +
        "/" +
        identityCard.substr(12, 2);
    }
    if (len == 15) {
      strBirthday =
        "19" +
        identityCard.substr(6, 2) +
        "/" +
        identityCard.substr(8, 2) +
        "/" +
        identityCard.substr(10, 2);
    }
    var birthDate = new Date(strBirthday);
    var nowDateTime = new Date();
    var age = nowDateTime.getFullYear() - birthDate.getFullYear();
    if (
      nowDateTime.getMonth() < birthDate.getMonth() ||
      (nowDateTime.getMonth() == birthDate.getMonth() &&
        nowDateTime.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
}