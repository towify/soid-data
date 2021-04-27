[TOC]

# solid-data

## Description

Towify`s development kit,contain request, storage and data etc.

- DeltaEventManager：事件过滤
- RequestManager：网络请求
- event_observer：事件监听
- database：数据库
- shared_preference：偏好设置
- nullable
- array.util
- common
- md5
- object.util
- performance
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

### 3.event_observer

### 4.database

### 5.shared_preference

### 6.nullable

### 7.array.util

### 8.common

### 9.md5

### 10.object.util

### 11.performance

### 12.value_checker



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

