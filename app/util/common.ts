/*
 * @author kaysaith
 * @date 2020/4/19 13:19
 */

export type Merge<T> = { [K in keyof T]: T[K] };

export const CommonUtil = {
  splitString(content: string) {
    return content.match(/[A-Z][a-z]+|[0-9]+/g)?.join(' ');
  },
  getRandomId: (prefix?: string) => {
    return ((prefix || '') + Math.random().toString(16).substr(2)).substring(0, 12)
  },
  pickNumber: (content: string): number | undefined => {
    const result = content.replace(/[^0-9]/ig, '');
    return result ? parseInt(result) : undefined;
  },
  repeat: (count: number, hold: (index: number) => void) => {
    for (let index = 0; index < count; index += 1) {
      hold(index);
    }
  }
};

export class StringUtils {
  static capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  static toHashCode(text: string): number {
    return text.split('').reduce(function (a, b) {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }
}
