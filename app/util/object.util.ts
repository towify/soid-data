/*
 * @author kaysaith
 * @date 12/23/20 11:10
 */

export class ObjectUtils {
  /**
   * @description: 判断是否是对象
   */
  static isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
}
