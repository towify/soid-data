/*
 * @Author: allen
 * @Date: 2022/6/17
 */

import { ObjectUtils } from "./object.util";

export class ObjectDiffUtils {
  static getObjectDiffInfoList(params: {
    id: string;
    originObject: { [key: string | number]: any };
    newObject: { [key: string | number]: any };
    rootPath?: string;
  }): {
    id: string;
    path: string;
    oldValue?: string | number | boolean | [] | { [key: string | number] : any };
    newValue?: string | number | boolean | [] | { [key: string | number] : any }
  }[] {
    const diff = ObjectDiffUtils.getObjectDiffMapping(params.originObject, params.newObject);
    const result: {
      id: string;
      path: string;
      oldValue?: string | number | boolean | [] | { [key: string | number] : any };
      newValue?: string | number | boolean | [] | { [key: string | number] : any }
    }[] = [];
    Object.keys(diff).forEach(path => {
      result.push({
        id: params.id,
        path,
        oldValue: ObjectDiffUtils.getObjectValueByPath(params.originObject, path),
        newValue: ObjectDiffUtils.getObjectValueByPath(params.newObject, path)
      });
    });
    if (params.rootPath) {
      result.forEach(item => {
        item.path = `${params.rootPath}.${item.path}`;
      });
    }
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
    const originMapping = ObjectDiffUtils.flattenObject(originObject);
    diffInfo.forEach(item => {
      if (item.newValue !== undefined) {
        originMapping[item.path] = item.newValue;
      } else if (originMapping[item.path]) {
        delete originMapping[item.path]
      }
    })
    return ObjectDiffUtils.unFlattenToObject(originMapping);
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
      if (originMapping[key] === undefined || originMapping[key] !== updateMapping[key]) {
        diffMapping[key] = updateMapping[key];
      }
    });
    return diffMapping;
  }

  static getObjectValueByPath(json: { [key: string]: any }, valuePath: string) {
    const keys = valuePath.split('.');
    let node = json;
    let value: string | number | boolean | [] | { [key: string | number] : any } | undefined;
    keys.forEach((key, keyIndex) => {
      if (!node) {
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
