/*
 * @author kaysaith
 * @date 2020/4/19 13:19
 */

export const CommonUtil = {
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
