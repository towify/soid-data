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

  static deepGet(source: { [key: string]: any }, keyPath: string[]) {
    const clonedPath = [...keyPath];
    let result: any = source;
    while (clonedPath.length > 0) {
      result = result[clonedPath[0]];
      clonedPath.splice(0, 1);
    }
    return result;
  }

  /**
   * @param params.onDifferent
   * 捕获深度设置置的时候，新值与旧置不同的时候的时机
   * @attention
   * 如果设置的 Path 深度没有结束，其中某个节点为 undefined 的话那么会生成一个
   * 空的 Object
   * */
  static deepOptionalSet(params: {
    path: string[];
    source: any;
    value: any;
    onDifferent?: () => void;
  }): void {
    const setDeepValue = (path: string[], source: any, value: any) => {
      if (path.length && path.length === 1 && source[path[0]] === undefined) {
        source[path[0]] = value;
        params.onDifferent && params.onDifferent();
        return;
      }
      if (path.length > 1) {
        if (!source[path[0]]) {
          source[path[0]] = {};
        }
        setDeepValue(
          path.slice(1, path.length),
          source[path[0]],
          value
        );
      } else if (path.length) {
        let isDifferent = false;
        if (typeof source[path[0]] === typeof value) {
          isDifferent = source[path[0]] !== value;
          source[path[0]] = value;
          if (isDifferent) params.onDifferent && params.onDifferent();
        } else if (typeof source[path[0]] === 'string') {
          if (source[path[0]] !== `${ value }`) {
            params.onDifferent && params.onDifferent();
          }
          source[path[0]] = `${ value }`;
        } else if (typeof source[path[0]] === 'number') {
          isDifferent = source[path[0]] !== parseFloat(value);
          const formatted = parseFloat(value);
          if (Number.isNaN(formatted)) {
            console.error(
              `Towify: Invalid Deep Value Source, it should be number but it is ${ value }`
            );
          }
          source[path[0]] = formatted;
          if (isDifferent) params.onDifferent && params.onDifferent();
        } else if (typeof source[path[0]] === 'boolean') {
          isDifferent = source[path[0]] !== (value === 'true');
          source[path[0]] = value === 'true';
          if (isDifferent) params.onDifferent && params.onDifferent();
        }
      }
    };
    setDeepValue(params.path, params.source, params.value);
  }
}
