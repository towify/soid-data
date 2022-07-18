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
    const diff = ObjectDiffUtils.getObjectDiffMapping(params.originObject, params.newObject);
    let newValue;
    Object.keys(diff).forEach(path => {
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
        diffMapping[key] = updateMapping[key];
        if (Object.keys(diffMapping).some(diffKey => diffKey !== key && key.includes(key))) {
          delete diffMapping[key];
        } else {
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

  static setObjectUnsetDiff(params: {
    path: string,
    unsetValueObject: { [key: string | number]: any },
    valueMapping: { [key: string]: any },
    diffMapping: { [key: string]: any }
  }) {
    const newKeys = params.path.split('.');
    let newPath = '';
    let newIndex = 0;
    let originNode = params.unsetValueObject;
    let updateNode: { [key: string | number]: any } | undefined;
    let finallyPath = '';
    newKeys.forEach((newKey, keyIndex) => {
      if (keyIndex === newKeys.length - 1) {
        if (updateNode !== undefined) {
          finallyPath = newPath ? `${newPath}.${newKey}` : `${newKey}`;
          updateNode[newKey] = params.valueMapping[params.path];
        } else {
          finallyPath = params.path;
          params.diffMapping[params.path] = params.valueMapping[params.path];
        }
        return;
      }
      if (originNode[newKey] !== undefined && newIndex === 0) {
        originNode = originNode[newKey];
        newPath = newPath ? `${newPath}.${newKey}` : `${newKey}`;
      } else {
        newPath = newPath ? `${newPath}.${newKey}` : `${newKey}`
        if (newIndex === 0) {
          params.diffMapping[newPath] ??= !Number.isNaN(parseInt(newKeys[keyIndex+1], 10)) ? [] : {};
          updateNode = params.diffMapping[newPath ? `${newPath}.${newKey}` : `${newKey}`]
        } else if (updateNode) {
          updateNode[newKey] ??= !Number.isNaN(parseInt(newKeys[keyIndex+1], 10)) ? [] : {};
          updateNode = updateNode[newKey];
        }
        newIndex += 1;
      }
    })
    if (Object.keys(params.diffMapping).some(key => key !== finallyPath && finallyPath.includes(key))) {
      delete params.diffMapping[finallyPath];
    } else {
      Object.keys(params.diffMapping).forEach(key => {
        if (key !== finallyPath && key.includes(finallyPath)) {
          delete params.diffMapping[key];
        }
      })
    }
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
