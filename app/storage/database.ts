/*
 * @author KaySaith
 * @date 2019/10/8
 */

import Dexie, { IndexableType } from 'dexie';
import Collection = Dexie.Collection;

export enum Order {
  Asc = 'Asc',
  Desc = 'Desc',
}

export abstract class Database extends Dexie {
  // 数据库版本
  public abstract readonly databaseVersion: number;

  // 表名及字段的定义
  public abstract readonly tableDefined: { [key: string]: string };

  protected constructor(value: string) {
    super(value);
  }

  /**
   * @description 添加一条记录
   * @param table 表名
   * @param item 一条记录
   */
  public async add(table: string, item: { [key: string]: IndexableType }) {
    return this.table(table).add(item);
  }

  /**
   * @description 添加多条记录
   * @param table 表名
   * @param items 记录数组
   */
  public async bulkAdd(
    table: string,
    items: { [key: string]: IndexableType }[]
  ) {
    return this.table(table).bulkAdd(items);
  }

  /**
   * @description 更新一条记录
   * @param table 表名
   * @param item 记录
   */
  public async put(table: string, item: { [key: string]: IndexableType }) {
    return this.table(table).put(item);
  }

  /**
   * @description 更新多条记录
   * @param table 表名
   * @param items
   */
  public async bulkPut(
    table: string,
    items: { [key: string]: IndexableType }[]
  ) {
    return this.table(table).bulkPut(items);
  }

  /**
   * @description 更新符合筛选条件的记录
   * @param params.table 表名
   * @param params.query 筛选条件
   * @param params.changes 更新字段的名和值
   */
  public async update(params: {
    table: string;
    query: { [key: string]: IndexableType };
    changes: { [key: string]: IndexableType };
  }) {
    return this.table(params.table).where(params.query).modify(params.changes);
  }

  /**
   * @description 获取指定主键值的记录
   * @param table
   * @param primaryKey
   */
  public async get(
    table: string,
    primaryKey: IndexableType
  ): Promise<{ [key: string]: IndexableType }> {
    return this.table(table).get(primaryKey);
  }

  /**
   * @description 查询符合筛选条件的记录，并且可以设置排序规则和分页条件
   * @param params.table 表名
   * @param params.query 筛选条件
   * @param params.sort 排序规则
   * @param params.pageIndex 页码
   * @param params.pageSize 每页大小
   */
  public find(params: {
    table: string;
    query?: { [key: string]: IndexableType };
    sort?: { key: string; order: Order };
    pageIndex?: number;
    pageSize?: number;
  }): Promise<{ [key: string]: IndexableType }[]> {
    return new Promise<{ [key: string]: IndexableType }[]>(
      (resolve, reject) => {
        const index = params.pageIndex || 0;
        const limit = params.pageSize || 0;
        const offset = index * limit;
        const table = this.table(params.table);
        let collection: Collection<any, any> | undefined;
        if (params.query) {
          collection = table.where(params.query);
        }
        if (offset >= 0 && limit > 0) {
          if (!collection) {
            collection = table.toCollection();
          }
          collection = collection.offset(offset).limit(limit);
        }
        if (params.sort) {
          if (!collection) {
            collection = table.toCollection();
          }
          if (params.sort.order === Order.Desc) {
            collection = collection.reverse();
          }
          collection
            .sortBy(params.sort.key)
            .then((result: { [key: string]: IndexableType }[]) =>
              resolve(result)
            )
            .catch(reject);
          return;
        }
        if (!collection) {
          collection = table.toCollection();
        }
        collection
          .toArray((dataList: { [key: string]: IndexableType }[]) => dataList)
          .then((result: { [key: string]: IndexableType }[]) => resolve(result))
          .catch(reject);
      }
    );
  }

  /**
   * @description 查询字段为某些值的记录，可以指定排序规则
   * @param params.table 表名
   * @param params.key 字段名
   * @param params.array 值数组
   * @param params.sort 排序条规则
   */
  public async findByArray(params: {
    table: string;
    key: string;
    array: (string | number)[];
    sort?: { key: string; order: Order };
  }): Promise<{ [key: string]: IndexableType }[]> {
    let collection = this.table(params.table)
      .where(params.key)
      .anyOf(params.array);
    if (params.sort) {
      if (params.sort.order === Order.Desc) {
        collection = collection.reverse();
      }
      return collection.sortBy(params.sort.key);
    }
    return collection.toArray();
  }

  /**
   * @description 查询符合筛选条件的记录个数
   * @param table 表名字
   * @param query 筛选条件
   */
  public count(
    table: string,
    query?: { [key: string]: IndexableType }
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (query) {
        this.table(table)
          .where(query)
          .count()
          .then((result: number) => resolve(result))
          .catch(reject);
      } else {
        this.table(table)
          .count()
          .then((result: number) => resolve(result))
          .catch(reject);
      }
    });
  }

  /**
   * @description 查询不同值对应记录的数量
   * @param params.table 表名
   * @param params.key 字段名
   * @param params.array 值数组
   */
  public findCountByArray(params: {
    table: string;
    key: string;
    array: (string | number)[];
  }): Promise<{ [key: string]: number }> {
    return new Promise<{ [key: string]: number }>((resolve, reject) => {
      const result: { [key: string]: number } = {};
      this.table(params.table)
        .where(params.key)
        .anyOf(params.array)
        .eachKey((value) => {
          result[<string>value] = (result[<string>value] || 0) + 1;
        })
        .then(() => resolve(result))
        .catch(reject);
    });
  }

  /**
   * @description 移除符合筛选条件的记录
   * @param table 表名
   * @param query 筛选条件
   */
  public async remove(table: string, query: { [key: string]: IndexableType }) {
    return this.table(table).where(query).delete();
  }

  /**
   * @description 移除指定主键值的记录
   * @param table 表名
   * @param ids 主键值
   */
  public async removeByIds(table: string, ids: (string | number)[]) {
    return this.table(table).bulkDelete(ids);
  }

  /**
   * @description 移除字段为某些值的记录
   * @param params.table 表名
   * @param params.key 字段名
   * @param params.array 值数组
   */
  public async removeByKeyArray(params: {
    table: string;
    key: string;
    array: (string | number)[];
  }) {
    return this.table(params.table)
      .where(params.key)
      .anyOf(params.array)
      .delete();
  }

  /**
   * @description 清空表中所有记录
   * @param table
   */
  public async clear(table: string) {
    return this.table(table).clear();
  }

  /**
   * @description 删除数据库
   */
  public async deleteDatabase() {
    return Dexie.delete(this.name);
  }
}
