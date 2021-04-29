[TOC]

# solid-data

## Description

Towify`s development kit,contain request, storage and data etc.

- DeltaEventManager：事件过滤
- RequestManager：网络请求
- EventObserverService：事件监听
- Database：数据库
- SharedPreference：键值对存储
- ArrayUtils：数组相关
- StringUtils：字符串相关
- CommonUtil：零散工具类
- Md5：MD5 加密
- ObjectUtils：Object 相关
- Performance：方法调用相关
- value_checker

## Install

This project uses `node` and `npm`.Go check them out if you don`t have them locally installed.

```
npm install soid-data
```
## Usage

### 1.DeltaEventManager

保证间隔时间内方法只响应一次



**DeltaEventManager 中的方法：**

| 方法         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| setDeltaTime | 设置时间阈值                                                 |
| setEvent     | 设置回调方法                                                 |
| getWatcher   | 试图调用回调方法，如果时间间隔在阈值之内回调方法不会响应，如果时间间隔超过阈值则回调方法执行 |



**使用示例**：

```
// 导入 DeltaEventManager
import { DeltaEventManager } from 'soid-data';

// 1.创建实例
const deltaEventManager = new DeltaEventManager();

// 2.设置时间阈值
deltaEventManager.setDeltaTime(500)

// 3.设置回调方法
deltaEventManager.setEvent(() => {
	console.log('1');
});

// 前 3 步也可以用链式方式书写
deltaEventManager = new DeltaEventManager()
  .setDeltaTime(500)
  .setEvent(() => {
  	console.log('1');
	});
	
// 4.方法调用
deltaEventManager.getWatcher();
deltaEventManager.getWatcher();
setTimeout(() => {
  deltaEventManager.getWatcher();
}, 1000);
```

执行结果

```
1
1
```

> 由于时间阈值为 500ms,第二次方法调用被过滤掉了，最终方法只被执行了2次



### 2.RequestManager

进行网络请求



**RequestManager 中的方法：**

| 方法    | 说明         |
| ------- | ------------ |
| request | 进行方法请求 |

**请求方法**：`get`  `post`  `put`  `delete`



**RequestOptions 请求配置：**

| 字段        | 类型                        | 说明                                                     |
| ----------- | --------------------------- | -------------------------------------------------------- |
| ignoreCache | boolean                     | 是否忽略缓存，默认 false                                 |
| timeout     | number                      | 请求超时时间，单位 ms，0或者负数会一直等待，默认 10000ms |
| headers     | { [*key*: string]: string } | 请求头                                                   |



**RequestResult 请求结果：**

| 字段       | 类型       | 说明                                            |
| ---------- | ---------- | ----------------------------------------------- |
| ok         | boolean    | 请求状态，true 表示请求成功，false 表示请求有误 |
| status     | number     | 请求响应状态码                                  |
| statusText | string     | 请求响应状态码对应的说明                        |
| headers    | string     | 响应头                                          |
| data       | string     | 字符串形式的返回数据                            |
| json       | <T>() => T | 响应文本解析后对应的数据model                   |



**使用示例：**

```
// 导入 RequestManager RequestOptions RequestResult
import { RequestManager, RequestOptions, RequestResult } from 'soid-data';

// 1.准备 url
const url = 'https://sls-api-dev.towify.com/global/getClientIp';

// 2.设置请求配置，也使用默认的
const requestOption: RequestOptions = {
	ignoreCache: true,
  headers: {
  	token: '123',
  },
  timeout: 1000,
};

// 3.设置请求参数
const params = {
  id: 12,
};

// 4.发起请求
RequestManager.request('get', url, params, null, requestOption).then(
(result: RequestResult) => {
		console.log(result);
	}
);
```



### 3.EventObserverService

事件监听，也可以理解为通知中心，用于多方对某一变化做出不同响应



**EventObserverService 方法：**

| 方法        | 说明         |
| ----------- | ------------ |
| getInstance | 获取单利对象 |
| register    | 注册监听     |
| notify      | 发送消息     |
| unregister  | 移除监听     |



**使用示例：**

```
// 导入 EventObserverService
import { EventObserverService } from 'soid-data';

// 1.在 A 类中注册监听事件
EventObserverService.getInstance().register<string>(
  'property',
  'class A',
  (message?: string) => {
  	console.log(`A ${message}`);
  }
);

// 2.在 B 类中注册监听事件
EventObserverService.getInstance().register<string>(
  'property',
  'class B',
  (message?: string) => {
  	console.log(`B ${message}`);
  }
);

// 4.任意位置发送消息，上述两个监听都会收到消息
EventObserverService.getInstance().notify('property', 'message');

// 5.监听结束后移除
EventObserverService.getInstance().unregister('property');
```

执行结果

```
A message
B message
```



### 4.Database

数据库相关操作

**抽象类 Database 属性：**

| 属性            | 说明             |
| --------------- | ---------------- |
| databaseVersion | 数据库版本       |
| tableDefined    | 表名及字段的定义 |

**抽象类 Database 方法：**

* 数据库操作
  * `deleteDatabase`：删除数据库
* 表操作
  * 增
    * `add`：添加一条记录
    * `bulkAdd`：添加多条记录
  * 删
    * `remove`：移除符合筛选条件的记录
    * `removeByIds`：移除指定主键值的记录
    * `removeByKeyArray`：移除字段为某些值的记录
    * `clear`：清空表中所有记录
  * 改
    * `put`：更新一条记录，使用 put 相关方法更新数据需要将所有字段都带上
    * `bulkPut`：更新多条记录
    * `update`：更新符合筛选条件的记录
  * 查
    * `get`：获取指定主键值的记录
    * `find`：查询符合筛选条件的记录，并且可以设置排序规则和分页条件
    * `findByArray`：查询字段为某些值的记录，可以指定排序规则
    * `count`：查询符合筛选条件的记录个数
    * `findCountByArray`：查询不同值对应记录的数量



>  首先需要声明数据库的实体类

```
// 导入 Database Order
import { Database, Order } from 'soid-data';

class GlobalDatabase extends Database {

  private static _database: Database | undefined;
	// 数据库版本
  public readonly databaseVersion = 1;
  // 定义表名和字段名，++ 表示字段是主键，& 表示字段值唯一，* 表示字段需要建立多值索引
  public readonly tableDefined = { User: '++id, name, age, *type' };
  
  private constructor() {
    super('MyDatabase');
    // 初始化数据库并创建表
    this.version(this.databaseVersion).stores(this.tableDefined);
  }

  public static getInstance(): Database {
    if (!GlobalDatabase._database) {
      GlobalDatabase._database = new GlobalDatabase();
    }
    return GlobalDatabase._database;
  }
}
```

**使用示例**

```
// 增加一条数据
GlobalDatabase.getInstance().add('User', { name: 'a', age: 1, type: 'boy' });


// 查询 age=1 的记录,查询结果按照 name 倒序排列
GlobalDatabase.getInstance()
  .find({
    table: 'User',
    query: { age: 1 },
    sort: { key: 'name', order: Order.Desc },
  })
  .then((list) => console.log(list));


// 删除 name=a 的记录
GlobalDatabase.getInstance()
  .remove('User', { name: 'a' })
  .then(() => console.log('deleted'));
  
  
// 更新 id=1 的记录
GlobalDatabase.getInstance().put('User', {
    id: 1,
    name: 'e',
    age: 20,
    type: 'boy',
  });


// 将 id=2 的记录 age 字段值改为 30
GlobalDatabase.getInstance()
  .update({
    table: 'User',
    query: { id: 2 },
    changes: {
    	age: 30,
 		},
	})
	
	
// 查询 type 值为 boy 和 girl 的记录各多少条
// 输出结果为 {boy: 3, girl: 2}
GlobalDatabase.getInstance()
  .findCountByArray({
    table: 'User',
    key: 'type',
    array: ['boy', 'girl'],
  })
  .then((array) => {
  	console.log(array);
  });
  
// 查询 name 值为 a 或 c 的记录
GlobalDatabase.getInstance()
  .findByArray({
    table: 'User',
    key: 'name',
    array: ['a', 'c'],
  })
```





### 5.SharedPreference

键值对存储，在 `localStorage` 的基础上增加了内存读写

**SharedPreference 中的方法**

| 方法        | 说明                               |
| ----------- | ---------------------------------- |
| getInstance | 获取单利对象                       |
| save        | 保存键值对，如果已经存在则进行更新 |
| delete      | 删除键值对                         |
| get         | 获取指定键对应的值                 |



**使用示例**

```
// 导入 Shared，Shared 为 SharedPreference 的单利对象
import { Shared } from 'soid-data';

// 增加键值对
Shared.save('name', 'Jack');

// 更新 name 的值
Shared.save('name', 'Simth');

// 获取 name 的值
const name = await Shared.get('name');

// 删除 name 对应的键值对
Shared.delete('name');
```





### 6.ArrayUtils

数组相关的方法



**ArrayUtils 中的方法**

| 方法 | 说明                   |
| ---- | ---------------------- |
| flat | 将二维数组降为一维数组 |



**使用示例**

```
// 导入 ArrayUtils
import { ArrayUtils } from 'soid-data';

const array = [[1], [2, 3], [4, 5], [6], [7, 8]];
const flatArray = ArrayUtils.flat<number>(array);
// flatArray 最终为 [1, 2, 3, 4, 5, 6, 7, 8]
```



### 7.StringUtils

字符串相关的方法



**StringUtils 中的方法**

| 方法                  | 说明               |
| --------------------- | ------------------ |
| capitalizeFirstLetter | 首字母大写         |
| toHashCode            | 获取字符串的哈希值 |



**使用示例**

```
// 导入 StringUtils
import { StringUtils } from 'soid-data';

const result = StringUtils.capitalizeFirstLetter('yantai');
const hashcode = StringUtils.toHashCode('test content');
```



### 8.CommonUtil

零散工具类



**CommonUtil 中的方法**

| 方法        | 说明                                                 |
| ----------- | ---------------------------------------------------- |
| splitString | 查找字符串中所有符合 `[A-Z][a-z]+|[0-9]+` 正则的字符 |
| getRandomId | 获取随机 id                                          |
| pickNumber  | 去除字符串中非数字的字符                             |
| repeat      | 循环调用                                             |



**使用示例**

```
// 导入 CommonUtil
import { CommonUtil } from 'soid-data';

CommonUtil.splitString('Aaas121A21aa')

CommonUtil.getRandomId()

CommonUtil.pickNumber('sdj12jkasfjslafkja33')

CommonUtil.repeat(12, (index) => {
	console.log(index);
});
```





### 9.Md5

MD5 加密工具类



**Md5 中的方法**

| 方法         | 说明                                   |
| ------------ | -------------------------------------- |
| hashStr      | 对普通字符串进行 MD5 加密              |
| hashAsciiStr | 对还有 ASCII 字符的字符串进行 MD5 加密 |



**使用示例**

```
// 导入 Md5
import { Md5 } from 'soid-data';

// 对普通字符串 Md5 加密
Md5.hashStr('普通字符')

// 对含有 ASCII 字符的字符串进行加密
Md5.hashAsciiStr('\u666e\u901a\u5b57\u7b26')
```



### 10.ObjectUtils

Object 相关



**ObjectUtils 中的方法**

| 方法     | 说明           |
| -------- | -------------- |
| isObject | 判断是否是对象 |



**使用示例**

```
// 导入 ObjectUtils
import { ObjectUtils } from 'soid-data';

ObjectUtils.isObject([1, 2])
```







### 11.Performance

方法调用相关操作，如防抖动操作、延迟调用和间隔调用



**Performance 中的方法**

| 方法     | 描述     |
| -------- | -------- |
| debounce | 防抖动   |
| delay    | 延迟调用 |
| throttle | 间隔调用 |



**使用示例**

```
// 导入 Performance
import { Performance } from 'soid-data';

// 防抖动,运行后 count = 2
let count = 0;
const debounceFunction = Performance.debounce(() => {
	count += 1;
}, 200);
setTimeout(debounceFunction, 0);
setTimeout(debounceFunction, 100);
setTimeout(debounceFunction, 300);

// 间隔调用，没 200ms 执行一次方法，一共执行4次
let count = 0;
const throttleFunction = Performance.throttle(() => {
	count += 1;
}, 200);
throttleFunction()
throttleFunction()
throttleFunction()
throttleFunction()

// 延迟调用,200ms 后修改 count 的值
let count = 0;
Performance.delay(200).then(() => {
	count = 1;
});
```





### value_checker



## Other

### Local test

```shell
npm install
npm run build
run index.html
```

### Build

```
npm run tsc
```
### Publish

1. 验证你在 npmjs.org 上的账号 `npm adduser`
2. 发布 `npm publish`

