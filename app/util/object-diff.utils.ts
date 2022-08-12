/*
 * @Author: allen
 * @Date: 2022/6/17
 */

import { ObjectUtils } from "./object.util";

export class ObjectDiffUtils {

  /**
   * 获取 originObject 和 newObject 以 rootPath (eg: a.b.c.d) 会根目录下， value 不同的 path 值
   * **/
  static getObjectDiffInfoList(params: {
    id: string;
    originObject?: { [key: string | number]: any };
    newObject?: { [key: string | number]: any };
    rootPath?: string;
  }): {
    id: string;
    path: string;
    oldValue?: string | number | boolean | [] | { [key: string | number] : any };
    newValue?: string | number | boolean | [] | { [key: string | number] : any }
  }[] {
    const result: {
      id: string;
      path: string;
      oldValue?: string | number | boolean | [] | { [key: string | number] : any };
      newValue?: string | number | boolean | [] | { [key: string | number] : any }
    }[] = [];
    if (params.originObject === undefined || params.newObject === undefined) {
      if (params.originObject !== params.newObject) {
        result.push({
          id: params.id,
          path: params.rootPath ?? '',
          oldValue: params.originObject,
          newValue: params.newObject
        });
      }
      return result;
    }
    // 获取 originObject 与 newObject 不同的值的 mapping。 path(eg: a.b.c.d) 为 key， value 为值。 非递归处理
    const diffMapping = ObjectDiffUtils.getObjectDiffMapping(params.originObject, params.newObject);
    let newValue;
    Object.keys(diffMapping).forEach(path => {
      newValue = ObjectDiffUtils.getObjectValueByPath(params.newObject!, path)
      result.push({
        id: params.id,
        path: params.rootPath ? `${params.rootPath}.${path}` : path,
        oldValue: ObjectDiffUtils.getObjectValueByPath(params.originObject!, path) ?? ObjectDiffUtils.getDefaultValue(newValue),
        newValue
      });
    });
    return result;
  }

  /*
  * 根据传入的 referValue 类型，返回对应的默认值。
  * */
  static getDefaultValue(referValue: any) {
    if (referValue === undefined || ObjectUtils.isObject(referValue) || Array.isArray(referValue)) return undefined;
    switch (typeof referValue){
      case "string":
        return '';
      case "boolean":
        return false;
      case "number":
        return 0;
      default:
        return undefined;
    }
  }

  /**
   * 按照 diff list 将修改的值设置到原本的 object 中。 非递归循环
   * */
  static getNewObjectByObjectDiffInfoList(
    originObject: { [key: string | number]: any },
    diffList: {
      path: string,
      newValue?: string | number | boolean | [] | { [key: string | number] : any }
    }[]
  ): {
    [key: string | number]: any;
  } {
    diffList.forEach(item => {
      ObjectDiffUtils.setObjectValueByPath({
        object: originObject,
        valuePath: item.path,
        value: item.newValue
      })
    })
    return originObject;
  }

  /**
   * 将 key - value 的 origin object 和 new object 打平处理成 path(a.b.c.d) 为 key ，value 为值的 mapping。 这一步为递归处理
   * 同时比较两个 mapping 中 value 不同的 path 并组装成一个新的 mapping。 非递归处理
   * **/
  static getObjectDiffMapping(originObject: { [key: string | number]: any }, newObject: { [key: string | number]: any }) {
    const originMapping = ObjectDiffUtils.flattenObject(originObject);
    const updateMapping = ObjectDiffUtils.flattenObject(newObject);
    const diffMapping: { [key: string]: boolean } = {};
    Object.keys(originMapping).forEach(key => {
      if (updateMapping[key] === undefined) {
        ObjectDiffUtils.setObjectUnsetDiff({
          path: key,
          unsetValueObject: newObject,
          valueMapping: originMapping,
          diffMapping: diffMapping
        })
      }
    })
    Object.keys(updateMapping).forEach(key => {
      if (
        originMapping[key] === updateMapping[key] ||
        (Array.isArray(originMapping[key]) && Array.isArray(updateMapping[key])) ||
        (ObjectUtils.isObject(originMapping[key]) && ObjectUtils.isObject(updateMapping[key]))
      ) {
        return;
      }
      if (originMapping[key] === undefined) {
        ObjectDiffUtils.setObjectUnsetDiff({
          path: key,
          unsetValueObject: originObject,
          valueMapping: updateMapping,
          diffMapping: diffMapping
        })
      } else if (originMapping[key] !== updateMapping[key]) {
        if (!Object.keys(diffMapping).some(diffKey => diffKey !== key && key.includes(diffKey))) {
          diffMapping[key] = true;
          Object.keys(diffMapping).forEach(diffKey => {
            if (diffKey !== key && diffKey.includes(key)) {
              delete diffMapping[diffKey];
            }
          })
        }
      }
    });
    return diffMapping;
  }

  /**
   * 更具 path(eg: a.b.c.d)，并没有在 unsetValueObject 获取值 (undefined)
   * 同时确定 path 的 parent node path 是存在 unsetValueObject 中
   * 通过循环 path 路径查找到 在 unsetValueObject 中存在的 parent node path 以及其对应的值
   * 并替换到 diffMapping 中 path
   * 非递归处理
   * **/
  static setObjectUnsetDiff(params: {
    path: string,
    unsetValueObject: { [key: string | number]: any },
    valueMapping: { [key: string]: any },
    diffMapping: { [key: string]: boolean }
  }) {
    if (Object.keys(params.diffMapping).some(key => key !== params.path && params.path.includes(key))) {
      return;
    }
    const newKeys = params.path.split('.');
    let newPath = '';
    let originNode = params.unsetValueObject;
    let finallyPath = '';
    newKeys.forEach((newKey, keyIndex) => {
      if (keyIndex === newKeys.length - 1) {
        if (!finallyPath) {
          finallyPath = params.path;
        }
        params.diffMapping[finallyPath] = true;
        return;
      }
      if (finallyPath) return;
      if (originNode[newKey] !== undefined) {
        originNode = originNode[newKey];
        newPath = newPath ? `${newPath}.${newKey}` : `${newKey}`;
      } else {
        finallyPath = newPath ? `${newPath}.${newKey}` : `${newKey}`
      }
    })
    Object.keys(params.diffMapping).forEach(key => {
      if (key !== finallyPath && key.includes(finallyPath)) {
        delete params.diffMapping[key];
      }
    })
  }

  /**
   * 按照 value path(eg: a.b.c.d)， 获取 object 中原本的值， 非递归处理
   */
  static getObjectValueByPath(object: { [key: string]: any }, valuePath: string) {
    const keys = valuePath.split('.');
    let node = object;
    let value: string | number | boolean | [] | { [key: string | number] : any } | undefined;
    keys.forEach((key, keyIndex) => {
      if (node === undefined) {
        value = undefined;
        return;
      }
      if (keyIndex < keys.length - 1) {
        node = node[key];
      } else {
        value = node[key];
      }
    });
    return value;
  }

  /**
   * 按照 value path(eg: a.b.c.d)， 将 object 中的值进行更新。 非递归。
   **/
  static setObjectValueByPath(params: {
    object: { [key: string]: any };
    valuePath: string;
    value?: string | number | boolean | [] | { [key: string | number] : any }
  }) {
    let node = params.object;
    let parentNode: { [key: string]: any } | undefined;
    const keys = params.valuePath.split('.');
    keys.forEach((key, keyIndex) => {
      if (node === undefined || node === null) {
        return;
      }
      if (keyIndex < keys.length - 1) {
        parentNode = node;
        if (node[key] === undefined) {
          node[key] = !Number.isNaN(parseInt(keys[keyIndex+1], 10)) ? [] : {};
        }
        node = node[key];
      } else {
        if (params.value !== undefined && params.value !== null) {
          node[key] = params.value;
        } else if (node[key]) {
          if (Array.isArray(node) && !Number.isNaN(parseInt(key, 10))) {
            node.splice(parseInt(key, 10), 1);
          } else {
            delete node[key];
          }
        }
      }
    });
  }

  /**
   * 将 key - value 的 object 打平处理，变成 path(eg: a.b.c.d) 为 key， value 为值的 mapping。 递归处理
   * */
  static flattenObject(json: { [key: string | number]: any }): {
    [key: string]: number | string | boolean | [] | {};
  } {
    const result: { [key: string]: number | string | boolean | [] | {} } = {};
    const recurse = (node: any, path: string) => {
      if (Object(node) !== node) {
        result[path] = node;
      } else if (Array.isArray(node)) {
        if (node.length) {
          node.forEach((childNode, index) => {
            recurse(childNode, path ? `${path}.${index}` : `${index}`);
          });
        } else {
          result[path] = [];
        }
      } else if (Object.keys(node).length) {
        Object.keys(node).forEach(key => {
          recurse(node[key], path ? `${path}.${key}` : `${key}`);
        });
      } else {
        result[path] = {};
      }
    };
    recurse(json, '');
    return result;
  }

  /**
   * 将 path(eg: a.b.c.d) 为 key， value 为值的 mapping，组装成 key - value 的 object。 非递归
   * **/
  static unFlattenToObject(data: { [key: string]: number | string | boolean | [] | {} }): {
    [key: string | number]: any;
  } {
    const result: { [key: string]: any } = {};
    let node: any;
    let nodeKeys: string[];
    let keysLength = 0;
    Object.keys(data).forEach(path => {
      node = result;
      nodeKeys = path.split('.');
      keysLength = nodeKeys.length;
      nodeKeys.forEach((key, index) => {
        if (index < keysLength - 1) {
          if (node[key] === undefined) {
            node[key] = !Number.isNaN(parseInt(nodeKeys[index+1], 10)) ? [] : {};
          }
          node = node[key];
        } else {
          node[key] = data[path];
        }
      });
    });
    return result;
  }
}
