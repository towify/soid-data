/*
 * @Author: kaysaith
 * @Date: 2021-04-28 11:37:26
 */

export class StringUtils {
  /**
   * @description 首字母大写
   * @param text
   */
  static capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * @description 获取字符串的哈希值
   * @param text
   */
  static toHashCode(text: string): number {
    return text.split('').reduce(function (a, b) {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }

  public static filterCalculateSymbol(source: string): string {
    const specific = [
      '-/',
      '*',
      '+',
      '//',
      '(',
      ')',
      '.',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '%'
    ];
    const regex = new RegExp('[^' + specific.join('') + ']', 'g');
    return source.replace(regex, '');
  }

}
