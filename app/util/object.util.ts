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
    let result = source;
    if (!source[clonedPath[0]]) clonedPath.splice(0, 1);
    while (clonedPath.length > 0) {
      result = result[clonedPath[0]];
      clonedPath.splice(0, 1);
    }
    return result;
  }

  /**
   * 如果设置的 Path 深度没有结束，其中某个节点为 undefined 的话那么会生成一个 空的 Object
   * */
  static deepOptionalSet(params: {
    path: string[];
    source: any;
    value: any;
    onBindDifferentValue?: () => void;
  }): void {
    const setDeepValueFunction = (deepPath: string[], deepSource: any, deepValue: any) => {
      if (deepPath.length && deepPath.length === 1 && deepSource[deepPath[0]] === undefined) {
        deepSource[deepPath[0]] = deepValue;
        params.onBindDifferentValue && params.onBindDifferentValue();
        return;
      }
      if (deepPath.length > 1) {
        if (!deepSource[deepPath[0]]) {
          deepSource[deepPath[0]] = {};
        }
        setDeepValueFunction(
          deepPath.slice(1, deepPath.length),
          deepSource[deepPath[0]],
          deepValue
        );
      } else if (deepPath.length) {
        let isDifferent = false;
        if (typeof deepSource[deepPath[0]] === typeof deepValue) {
          isDifferent = deepSource[deepPath[0]] !== deepValue;
          deepSource[deepPath[0]] = deepValue;
          if (isDifferent) params.onBindDifferentValue && params.onBindDifferentValue();
        } else if (typeof deepSource[deepPath[0]] === 'string') {
          if (deepSource[deepPath[0]] !== `${ deepValue }`) {
            params.onBindDifferentValue && params.onBindDifferentValue();
          }
          deepSource[deepPath[0]] = `${ deepValue }`;
        } else if (typeof deepSource[deepPath[0]] === 'number') {
          // todo
        } else if (typeof deepSource[deepPath[0]] === 'string') {
          isDifferent = deepSource[deepPath[0]] !== parseFloat(deepValue);
          const formatted = parseFloat(deepValue);
          if (Number.isNaN(formatted)) {
            console.error(
              `Towify: Invalid Deep Value Source, it should be number but it is ${ deepValue }`
            );
          }
          deepSource[deepPath[0]] = formatted;
          if (isDifferent) params.onBindDifferentValue && params.onBindDifferentValue();
        } else if (typeof deepSource[deepPath[0]] === 'boolean') {
          isDifferent = deepSource[deepPath[0]] !== (deepValue === 'true');
          deepSource[deepPath[0]] = deepValue === 'true';
          if (isDifferent) params.onBindDifferentValue && params.onBindDifferentValue();
        }
      }
    };
    setDeepValueFunction(params.path, params.source, params.value);
  }
}
