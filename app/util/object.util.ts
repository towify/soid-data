/*
 * @author kaysaith
 * @date 12/23/20 11:10
 */

export class ObjectUtils {
  /**
   * @description 判断是否是对象
   */
  static isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  static deepSet(object: { [key: string]: any }, keyPaths: string | string[], value: any): { [key: string]: any } {
    if (typeof keyPaths == 'string')
      return ObjectUtils.deepSet(object, keyPaths.split('.'), value);
    else if (keyPaths.length == 1 && value !== undefined) {
      object[keyPaths[0]] = value;
      return object;
    } else if (keyPaths.length == 0)
      return object;
    else
      return ObjectUtils.deepSet(object[keyPaths[0]], keyPaths.slice(1), value);
  }

  static deepGet(source: {[key: string]: any}, keyPath: string[]) {
    const clonedPath = [...keyPath];
    let result = source;
    if (!source[clonedPath[0]]) clonedPath.splice(0, 1);
    while (clonedPath.length > 0) {
      result = result[clonedPath[0]];
      clonedPath.splice(0, 1);
    }
    return result;
  }
}
