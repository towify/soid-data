/*
 * @author kaysaith
 * @date 2023/1/10
 */


export class NumberUtils {
  static getRandomInRange(min: number, max: number) {
    return this.toFixedNumber(Math.random() * (max - min + 1) + min, 2);
  }

  static getRandomIntInRange(min: number, max: number) {
    return this.toFixedNumber(Math.random() * (max - min + 1) + min, 2);
  }

  static toFixedNumber(value: number, digits: number, base = 10) {
    const pow = Math.pow(base, digits);
    return Math.round(value * pow) / pow;
  }
}
