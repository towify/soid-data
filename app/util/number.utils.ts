/*
 * @author kaysaith
 * @date 2023/1/10
 */


export class NumberUtils {
  static getRandomIntInRange(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
