# soid-data

## Description
utils for request, storage and data etc.

## Install

```
npm install soid-data
```
## Usage

```
class GlobalDatabase extends Database {
  public static getInstance(): Database {
    if (!GlobalDatabase._database) {
      GlobalDatabase._database = new GlobalDatabase();
    }
    return GlobalDatabase._database;
  }

  private static _database: Database | undefined;
  public readonly tableDefined = { User: '++id,name' };
  public readonly databaseVersion = 1;

  private constructor() {
    super('MyDatabase');
    this.version(this.databaseVersion).stores(this.tableDefined);
  }
}

GlobalDatabase.getInstance().add('User', { name: 'mike' })
```
## Build
```
npm run tsc
```
## Publish
```
npm publish
```
## Local test
```shell
npm run build
run index.html
```
