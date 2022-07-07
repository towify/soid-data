/*
 * @Author: allen
 * @Date: 2022/6/17
 */

import { ObjectUtils } from "./object.util";

export class ObjectDiffUtils {
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
      result.push({
        id: params.id,
        path: params.rootPath ?? '',
        oldValue: params.originObject,
        newValue: params.newObject
      });
      return result;
    }
    const diff = ObjectDiffUtils.getObjectDiffMapping(params.originObject, params.newObject);
    Object.keys(diff).forEach(path => {
      result.push({
        id: params.id,
        path: params.rootPath ? `${params.rootPath}.${path}` : path,
        oldValue: ObjectDiffUtils.getObjectValueByPath(params.originObject!, path),
        newValue: ObjectDiffUtils.getObjectValueByPath(params.newObject!, path)
      });
    });
    return result;
  }

  static getNewObjectByObjectDiffInfoList(
    originObject: { [key: string | number]: any },
    diffInfo: {
      path: string,
      newValue?: string | number | boolean | [] | { [key: string | number] : any }
    }[]
  ): {
    [key: string | number]: any;
  } {
    diffInfo.forEach(item => {
      ObjectDiffUtils.setObjectValueByPath({
        object: originObject,
        valuePath: item.path,
        value: item.newValue
      })
    })
    return originObject;
  }

  static getObjectDiffMapping(originObject: { [key: string | number]: any }, newObject: { [key: string | number]: any }) {
    const originMapping = ObjectDiffUtils.flattenObject(originObject);
    const updateMapping = ObjectDiffUtils.flattenObject(newObject);
    const diffMapping: { [key: string]: any } = {};
    Object.keys(updateMapping).forEach(key => {
      if (
        originMapping[key] === updateMapping[key] ||
        (Array.isArray(originMapping[key]) && Array.isArray(updateMapping[key])) ||
        (ObjectUtils.isObject(originMapping[key]) && ObjectUtils.isObject(updateMapping[key]))
      ) {
        return;
      }
      if (originMapping[key] === undefined) {
        const newKeys = key.split('.');
        let newPath = '';
        let newIndex = 0;
        let originNode = originObject;
        let updateNode: { [key: string | number]: any } | undefined;
        newKeys.forEach((newKey, keyIndex) => {
          if (keyIndex === newKeys.length - 1) {
            if (updateNode !== undefined) {
              updateNode[newKey] = updateMapping[key];
            } else {
              diffMapping[key] = updateMapping[key];
            }
            return;
          }
          if (originNode[newKey] !== undefined && newIndex === 0) {
            originNode = originNode[newKey];
            newPath = newPath ? `${newPath}.${newKey}` : `${newKey}`;
          } else {
            if (newIndex === 0) {
              diffMapping[newPath ? `${newPath}.${newKey}` : `${newKey}`] ??= !Number.isNaN(parseInt(newKeys[keyIndex+1], 10)) ? [] : {};
              updateNode = diffMapping[newPath ? `${newPath}.${newKey}` : `${newKey}`]
            } else if (updateNode) {
              updateNode[newKey] ??= !Number.isNaN(parseInt(newKeys[keyIndex+1], 10)) ? [] : {};
              updateNode = updateNode[newKey];
            }
            newIndex += 1;
          }
        })
      } else if (originMapping[key] !== updateMapping[key]) {
        diffMapping[key] = updateMapping[key];
      }
    });
    return diffMapping;
  }

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

  static setObjectValueByPath(params: {
    object: { [key: string]: any };
    valuePath: string;
    value?: string | number | boolean | [] | { [key: string | number] : any }
  }) {
    let node = params.object;
    let parentNode: { [key: string]: any } | undefined;
    const keys = params.valuePath.split('.');
    keys.forEach((key, keyIndex) => {
      if (node === undefined) {
        return;
      }
      if (keyIndex < keys.length - 1) {
        parentNode = node;
        if (node[key] === undefined) {
          node[key] = !Number.isNaN(parseInt(keys[keyIndex+1], 10)) ? [] : {};
        }
        node = node[key];
      } else {
        if (params.value !== undefined) {
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
