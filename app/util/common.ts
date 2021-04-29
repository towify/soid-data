/*
 * @author kaysaith
 * @date 2020/4/19 13:19
 */

export type Merge<T> = { [K in keyof T]: T[K] };

export const CommonUtil = {
  /**
   * @description 查找字符串中所有符合 [A-Z][a-z]+|[0-9]+ 正则的字符
   * @param content
   */
  splitString(content: string) {
    return content.match(/[A-Z][a-z]+|[0-9]+/g)?.join(' ');
  },
  /**
   * @description 获取随机 id
   * @param prefix
   */
  getRandomId: (prefix?: string) => {
    return ((prefix || '') + Math.random().toString(16).substr(2)).substring(
      0,
      12
    );
  },
  /**
   * @description 去除字符串中非数字的字符
   * @param content
   */
  pickNumber: (content: string): number | undefined => {
    const result = content.replace(/[^0-9]/ig, '');
    return result ? parseInt(result) : undefined;
  },
  /**
   * @description 循环调用
   * @param count 循环次数
   */
  repeat: (count: number, hold: (index: number) => void) => {
    for (let index = 0; index < count; index += 1) {
      hold(index);
    }
  },
};
