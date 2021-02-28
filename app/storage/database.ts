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

  public add(table: string, item: { [key: string]: IndexableType }): Promise<Function> {
    return new Promise<Function>((resolve, reject) => {
      this
        .table(table)
        .add(item)
        .then(() => resolve()).catch(reject);
    });
  };

  public bulkAdd(table: string, items: { [key: string]: IndexableType }[]): Promise<Function> {
    return new Promise<Function>((resolve, reject) => {
      this
        .table(table)
        .bulkAdd(items)
        .then(() => resolve()).catch(reject);
    });
  };

  public bulkPut(table: string, items: { [key: string]: IndexableType }[]): Promise<Function> {
    return new Promise<Function>((resolve, reject) => {
      this
        .table(table)
        .bulkPut(items)
        .then(() => resolve()).catch(reject);
    });
  };

  public update(
    params: {
      table: string,
      query: { [key: string]: IndexableType },
      changes: { [key: string]: IndexableType }
    }
  ): Promise<Function> {
    return new Promise<Function>((resolve, reject) => {
      this
        .table(params.table)
        .where(params.query)
        .modify(params.changes)
        .then(() => resolve()).catch(reject);
    });
  };

  public put(table: string, item: { [key: string]: IndexableType }): Promise<Function> {
    return new Promise<Function>(((resolve, reject) => {
      this
        .table(table)
        .put(item)
        .then(() => resolve()).catch(reject);
    }))
  }

  public get(table: string, primaryKey: string | number | Object): Promise<{ [key: string]: IndexableType }> {
    return new Promise<{ [key: string]: IndexableType }>(((resolve, reject) => {
      this
        .table(table)
        .get(primaryKey)
        .then((data) => resolve(data)).catch(reject);
    }))
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
        collection
          .sortBy(params.sort.key)
          .then((result: { [key: string]: IndexableType }[]) => resolve(result))
          .catch(reject);
        return;
      }
      if(!collection){
        collection = table.toCollection();
      }
      collection.toArray((dataList: { [key: string]: IndexableType }[]) => dataList)
        .then((result: { [key: string]: IndexableType }[]) => resolve(result)).catch(reject);
    });
  };

  public findByArray(params: {
    table: string,
    key: string,
    array: (string | number)[]
  }): Promise<{ [key: string]: IndexableType }[]> {
    return new Promise<{ [key: string]: IndexableType }[]>((resolve, reject) => {
      this
        .table(params.table)
        .where(params.key)
        .anyOf(params.array)
        .toArray((dataList: { [key: string]: IndexableType }[]) => dataList)
        .then((result: { [key: string]: IndexableType }[]) => resolve(result)).catch(reject);
    });
  };

  public remove(table: string, query: { [key: string]: IndexableType }): Promise<Function> {
    return new Promise<Function>((resolve, reject) => {
      this
        .table(table)
        .where(query)
        .delete().then(() => resolve()).catch(reject);
    });
  };

  public removeByIds(table: string, ids: (string | number)[]): Promise<Function> {
    return new Promise<Function>((resolve, reject) => {
      this
        .table(table)
        .bulkDelete(ids).then(() => resolve()).catch(reject);
    });
  };

  public removeByKeyArray(params: { table: string, key: string, array: (string | number)[] }): Promise<Function> {
    return new Promise<Function>((resolve, reject) => {
      this
        .table(params.table)
        .where(params.key).anyOf(params.array)
        .delete().then(() => resolve()).catch(reject);
    });
  };

  public count(table: string, query?: { [key: string]: IndexableType }): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (query) {
        this
          .table(table)
          .where(query)
          .count()
          .then((result: number) => resolve(result)).catch(reject);
      } else {
        this
          .table(table)
          .count()
          .then((result: number) => resolve(result)).catch(reject);
      }
    });
  };

  //Clear the table
  public clear(table: string): Promise<Function> {
    return new Promise<Function>((resolve, reject) => {
      this
        .table(table)
        .clear()
        .then(() => resolve()).catch(reject);
    });
  };

  public deleteDatabase(): Promise<Function> {
    return new Promise<Function>((resolve, reject) => {
      Dexie
        .delete(this.name)
        .then(() => resolve()).catch(reject);
    });
  };
}
