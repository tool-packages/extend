---
id: 'modules'
title: 'API'
---

# @roshin/extend-internal

## Variables

### MAX_SAFE_INTEGER

• `Const` **MAX_SAFE_INTEGER**: _number_

Number 最大值

**`since`** 0.0.1

**`constant`** Number.MAX_SAFE_INTEGER

**`example`**

```js
MAX_SAFE_INTEGER; // => 9007199254740991
```

Defined in: constant.ts:19

---

### MIN_SAFE_INTEGER

• `Const` **MIN_SAFE_INTEGER**: _number_

Number 最小值

**`since`** 0.0.1

**`constant`** Number.MIN_SAFE_INTEGER

**`example`**

```js
MIN_SAFE_INTEGER; // => -9007199254740991
```

Defined in: constant.ts:30

---

### coreJsData

• `Const` **coreJsData**: _any_

用于检测扩展的 core-js 填充

**`since`** 0.0.1

**`constant`** root['__core-js_shared__']

Defined in: constant.ts:8

---

### freeExports

• `Const` **freeExports**: _any_

exports 对象检测
::: warning 注意
Node.js 原生支持 CommonJS 模块加载机制，在全局环境上会暴露 module 对象和 exports 对象
:::

**`since`** 0.0.1

**`constant`** freeSelf

Defined in: global.ts:44

---

### freeGlobal

• `Const` **freeGlobal**: NodeJS.Global & _typeof_ globalThis \| _false_

在 node 环境中捕获 global 变量
::: warning 注意
这里有个缺陷 global 是可以被冒充的 => var global = { Object: Object }
:::

**`since`** 0.0.1

**`constant`** freeGlobal

Defined in: global.ts:9

---

### freeGlobalThis

• `Const` **freeGlobalThis**: _typeof_ globalThis \| _false_

获取 globalThis 变量
::: warning 注意
globalThis 提供了一个标准的方式来获取不同环境下的全局 this 对象, 也就是全局对象自身。
可以确保代码在不同的环境下，都可以正常工作。
:::

**`since`** 0.0.1

**`constant`** freeGlobalThis

Defined in: global.ts:21

---

### freeModule

• `Const` **freeModule**: NodeModule \| _false_

module 对象检测
::: warning 注意
先判断是否存在 exports 对象, 因为这两个在 Node.js 中肯定是同时存在的
:::

**`since`** 0.0.1

**`constant`** freeSelf

Defined in: global.ts:54

---

### freeProcess

• `Const` **freeProcess**: NodeJS.Process \| _false_

从 Node.js 中检测可用变量 process

**`since`** 0.0.1

**`constant`** freeProcess

Defined in: global.ts:72

---

### freeSelf

• `Const` **freeSelf**: Window & _typeof_ globalThis \| _false_

获取 self 变量
::: warning 注意
self 在浏览器中大部分情况下指向的是当前 window 引用;
而在 worker 中，只有 self 这个顶层全局对象，是没有 window 对象的;
:::

**`since`** 0.0.1

**`constant`** freeSelf

Defined in: global.ts:33

---

### funcProto

• `Const` **funcProto**: Function

Function 原型链

**`since`** 0.0.1

**`constant`** Function.prototype

Defined in: constant.ts:81

---

### moduleExports

• `Const` **moduleExports**: _boolean_

检测当前环境是否支持 CommonJS 模块加载机制
::: warning 注意
CommonJS 规定，exports 对象必须为 module.exports 的引用。
:::

**`since`** 0.0.1

**`constant`** moduleExports

Defined in: global.ts:65

---

### objectProto

• `Const` **objectProto**: Object

Object 原型链

**`since`** 0.0.1

**`constant`** Object.prototype

Defined in: constant.ts:37

---

### root

• `Const` **root**: _any_

获取顶层全局对象
::: warning 注意
首先是 globalThis，因为这有最大的普适性；
接着是 global，因为在 node 的环境中，性能的考量会比浏览器环境更重要；
在有 window 的环境中，self 肯定是 window 对象的引用；
在松散模式下，可以在函数中返回 this 获取全局对象，但是在严格模式下，this 会返回 undefined;
因此也可以使用 Function('return this')() 来获取顶层全局对象。
:::

**`since`** 0.0.1

**`constant`** root

Defined in: global.ts:86

---

### symbolToStringTag

• `Const` **symbolToStringTag**: _symbol_ \| _undefined_

定义对象的自定义类型标签，通过 Object.prototype.toString.call 获取

**`since`** 0.0.1

**`constant`** Symbol.toStringTag

Defined in: constant.ts:95

## Functions

### baseGetTag

▸ `Const`**baseGetTag**(`arg`: _any_): _string_

获取参数的数据的类型

**`since`** 0.0.1

**`example`**

```js
baseGetTag(null); // => 'Null'
baseGetTag(void 0); // => 'Undefined'
baseGetTag(NaN); // => 'Number'

class MyObject {}
baseGetTag(new MyObject()); // => 'MyObject'

class ValidatorClass {
  get [Symbol.toStringTag]() {
    return 'test';
  }
}
baseGetTag(new ValidatorClass()); // => 'test'

const obj = {};
Object.defineProperty(obj, Symbol.toStringTag, { value: 'customObj' });
baseGetTag(obj); // => 'customObj'

const obj2 = {};
obj2[Symbol.toStringTag] = 'test';
baseGetTag(obj2); // => 'Object'
```

#### Parameters:

| Name  | Type  | Description        |
| ----- | ----- | ------------------ |
| `arg` | _any_ | 需要获取类型的参数 |

**Returns:** _string_

数据类型名称 Null | Undefined | Number | Object | ...

Defined in: baseGetTag.ts:36

---

### baseIsNative

▸ **baseIsNative**(`value`: _any_): _boolean_

isNative 的基本实现没有错误的填充检查

**`since`** 0.0.1

**`example`**

```js
baseIsNative(Array.prototype.push); // => true
baseIsNative(_); // => false
```

#### Parameters:

| Name    | Type  | Description |
| ------- | ----- | ----------- |
| `value` | _any_ | 要检测的值  |

**Returns:** _boolean_

是否是内置函数

Defined in: baseIsNative.ts:29

---

### funcToString

▸ `Const`**funcToString**(): _string_

Function 原型链

**`since`** 0.0.1

**`constant`** Function.prototype

**Returns:** _string_

Defined in: constant.ts:88

---

### getPrototypeOf

▸ `Const`**getPrototypeOf**(`o`: _any_): _any_

返回对象的原型

**`since`** 0.0.1

**`constant`** Object.getPrototypeOf

**`example`**

```js
nativeGetPrototypeOf(obj) === Object.prototype; // => true
nativeGetPrototypeOf([]) === Array.prototype; // => true
```

#### Parameters:

| Name | Type  |
| ---- | ----- |
| `o`  | _any_ |

**Returns:** _any_

Defined in: constant.ts:74

---

### hasOwnProperty

▸ `Const`**hasOwnProperty**(`v`: _string_ \| _number_ \| _symbol_): _boolean_

基于 Object 原型链上的 hasOwnProperty 方法，检测属性值是否存在

**`since`** 0.0.1

**`constant`** Object.prototype.hasOwnProperty

**`example`**

```js
const obj = { a: 1, b: 2 };
objectHasOwnProperty.call(obj, 'a'); // true
objectHasOwnProperty.call(obj, 'toString'); // false
```

#### Parameters:

| Name | Type                             |
| ---- | -------------------------------- |
| `v`  | _string_ \| _number_ \| _symbol_ |

**Returns:** _boolean_

Defined in: constant.ts:50

---

### isMaskable

▸ `Const`**isMaskable**(`value`: _any_): _boolean_

检测参数的源码是否能够被屏蔽

**`since`** 0.0.1

#### Parameters:

| Name    | Type  | Description  |
| ------- | ----- | ------------ |
| `value` | _any_ | 要检测的参数 |

**Returns:** _boolean_

如果参数能够被屏蔽, 返回 true, 否则返回 false

Defined in: isMaskable.ts:10

---

### objectToString

▸ `Const`**objectToString**(): _string_

基于 Object 原型链上的 toString 方法，获取对象的类型

**`since`** 0.0.1

**`example`**

```js
objectToString.call({}); // [object Object]
objectToString.call([]); // [object Array]
objectToString.call(function () {}); // [object Function]
```

**Returns:** _string_

Defined in: constant.ts:62
