/*
 * @author KaySaith
 * @date 2019/10/8
 */

import Dexie, { IndexableType } from 'dexie';
import Collection = Dexie.Collection;

export enum Order {
  Asc = 'Asc',
  Desc = 'Desc'
}

export abstract class Database extends Dexie {

  public readonly abstract databaseVersion: number;

  public readonly abstract tableDefined: { [key: string]: string };

  protected constructor(value: string) {
    super(value);
  }

  public async add(table: string, item: { [key: string]: IndexableType }) {
    return this.table(table).add(item);
  };

  public async bulkAdd(table: string, items: { [key: string]: IndexableType }[]) {
    return this.table(table).bulkAdd(items);
  };

  public async bulkPut(table: string, items: { [key: string]: IndexableType }[]) {
    return this.table(table).bulkPut(items);
  };

  public async update(
    params: {
      table: string,
      query: { [key: string]: IndexableType },
      changes: { [key: string]: IndexableType }
    }
  ) {
    return this.table(params.table).where(params.query).modify(params.changes);
  };

  public async put(table: string, item: { [key: string]: IndexableType }) {
    return this.table(table).put(item);
  }

  public async get(
    table: string,
    primaryKey: IndexableType
  ): Promise<{ [key: string]: IndexableType }> {
    return this.table(table).get(primaryKey);
  }

  public find(
    params:
      {
        table: string,
        query?: { [key: string]: IndexableType },
        sort?: { key: string, order: Order },
        pageIndex?: number,
        pageSize?: number
      }): Promise<{ [key: string]: IndexableType }[]> {
    return new Promise<{ [key: string]: IndexableType }[]>((resolve, reject) => {
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
        collection.sortBy(params.sort.key).then((result: { [key: string]: IndexableType }[]) => resolve(
          result)).catch(reject);
        return;
      }
      if (!collection) {
        collection = table.toCollection();
      }
      collection.toArray((dataList: { [key: string]: IndexableType }[]) => dataList).then((result: { [key: string]: IndexableType }[]) => resolve(
        result)).catch(reject);
    });
  };

  public async findByArray(params: {
    table: string,
    key: string,
    array: (string | number)[],
    sort?: { key: string, order: Order }
  }): Promise<{ [key: string]: IndexableType }[]> {
    let collection = this.table(params.table).where(params.key).anyOf(params.array)
    if (params.sort) {
      if (params.sort.order === Order.Desc) {
        collection = collection.reverse();
      }
      return collection.sortBy(params.sort.key);
    }
    return collection.toArray();
  };

  public findCountByArray(params: {
    table: string,
    key: string,
    array: (string | number)[]
  }): Promise<{ [key: string]: number }> {
    return new Promise<{ [key: string]: number }>((resolve, reject) => {
      const result: { [key: string]: number } = {}
      this
        .table(params.table)
        .where(params.key)
        .anyOf(params.array)
        .eachKey(value => {
          result[<string>value] = (result[<string>value] || 0) + 1;
        }).then(() => resolve(result)).catch(reject);
    });
  };

  public async remove(table: string, query: { [key: string]: IndexableType }) {
    return this.table(table).where(query).delete();
  };

  public async removeByIds(table: string, ids: (string | number)[]) {
    return this.table(table).bulkDelete(ids);
  };

  public async removeByKeyArray(params: { table: string, key: string, array: (string | number)[] }) {
    return this.table(params.table).where(params.key).anyOf(params.array).delete();
  };

  public count(table: string, query?: { [key: string]: IndexableType }): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (query) {
        this.table(table).where(query).count().then((result: number) => resolve(result)).catch(
          reject);
      } else {
        this.table(table).count().then((result: number) => resolve(result)).catch(reject);
      }
    });
  };

  //Clear the table
  public async clear(table: string) {
    return this.table(table).clear();
  };

  public async deleteDatabase() {
    return Dexie.delete(this.name);
  };
}
