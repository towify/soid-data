/*
 * @author KaySaith
 * @date 2019/10/8
 */

import Dexie, { IndexableType } from 'dexie';

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

  public find(table: string, query?: { [key: string]: IndexableType }): Promise<{ [key: string]: IndexableType }[]> {
    return new Promise<{ [p: string]: IndexableType }[]>((resolve, reject) => {
      if (query) {
        this
          .table(table)
          .where(query)
          .toArray((dataList: { [key: string]: IndexableType }[]) => dataList)
          .then((result: { [key: string]: IndexableType }[]) => resolve(result)).catch(reject);
      } else {
        this
          .table(table)
          .toArray((dataList: { [key: string]: IndexableType }[]) => dataList)
          .then((result: { [key: string]: IndexableType }[]) => resolve(result)).catch(reject);
      }
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
}