/*
 * @author kaysaith
 * @date 2020/4/19 13:19
 */

export const CommonUtil = {
  getRandomId: (prefix?: string) => (prefix || "") + Math.random().toString(16).substr(2)
};