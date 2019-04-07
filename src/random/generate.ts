
export namespace Generate {
  /**
   * 
   * @param max 最大数
   * @param min 最小数 default 0
   */
  export function randomNumber(max: number, min: number =  1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}