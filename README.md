[TOC]

# solid-data

## Description

Towify`s development kit,contain request, storage and data etc.

- DeltaEventManager：事件过滤
- request_manager：网络请求
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
deltaEventManager.getWatcher(1);
deltaEventManager.getWatcher(1);
setTimeout(() => {
  deltaEventManager.getWatcher(1);
}, 1000);
```

执行结果

```
1
1
```

> 由于时间阈值为 500ms,第二次方法调用被过滤掉了，最终方法只被执行了2次



### 2.request_manager

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

