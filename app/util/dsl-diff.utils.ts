/*
 * @Author: allen
 * @Date: 2022/6/17
 */

import { ObjectUtils } from "./object.util";

export class DslDiffUtils {
  static getDslDiffInfo(params: {
    id: string;
    originDsl: { [key: string]: any };
    newDsl: { [key: string]: any };
    rootPath?: string;
  }): {
    id: string;
    path: string;
    oldValue?: string | number | boolean | { [key: string]: any };
    newValue?: string | number | boolean | { [key: string]: any };
  }[] {
    const diff = DslDiffUtils.getDslDiffMapping(params.originDsl, params.newDsl);
    const result: {
      id: string;
      path: string;
      oldValue?: string | number | boolean | { [key: string]: any };
      newValue?: string | number | boolean | { [key: string]: any };
    }[] = [];
    Object.keys(diff).forEach(path => {
      result.push({
        id: params.id,
        path,
        oldValue: DslDiffUtils.getDslValueByPath(params.originDsl, path),
        newValue: DslDiffUtils.getDslValueByPath(params.newDsl, path)
      });
    });
    if (params.rootPath) {
      result.forEach(item => {
        item.path = `${params.rootPath}.${item.path}`;
      });
    }
    return result;
  }

  static getDslDiffMapping(originDsl: { [key: string]: any }, newDsl: { [key: string]: any }) {
    const originMapping = DslDiffUtils.flattenJSON(originDsl);
    const updateMapping = DslDiffUtils.flattenJSON(newDsl);
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

  static getDslValueByPath(json: { [key: string]: any }, valuePath: string) {
    const keys = valuePath.split('.');
    let node = json;
    let value: string | number | boolean | { [key: string]: any } | undefined;
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

  static flattenJSON(json: { [key: string]: any }): {
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

  static unFlattenToJSON(data: { [key: string]: number | string | boolean | [] | {} }): {
    [key: string]: any;
  } {
    const result: { [key: string]: any } = {};
    let node: any;
    let nodeKeys;
    let keysLength = 0;
    Object.keys(data).forEach(path => {
      node = result;
      nodeKeys = path.split('.');
      keysLength = nodeKeys.length;
      nodeKeys.forEach((key, index) => {
        if (index < keysLength) {
          if (node[key] === undefined) {
            node[key] = !Number.isNaN(parseInt(key, 10)) ? [] : {};
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
