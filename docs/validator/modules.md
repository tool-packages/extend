---
id: 'modules'
title: 'API'
---

# @roshin/extend-validator

## Functions

### getTag

▸ `Let`**getTag**(`arg`: _any_): _string_

获取参数的数据的类型

**`since`** 0.0.1

**`example`**

```js
getTag(null); // => 'Null'
getTag(void 0); // => 'Undefined'
getTag(NaN); // => 'Number'

class MyObject {}
getTag(new MyObject()); // => 'MyObject'

class ValidatorClass {
  get [Symbol.toStringTag]() {
    return 'test';
  }
}
getTag(new ValidatorClass()); // => 'test'

const obj = {};
Object.defineProperty(obj, Symbol.toStringTag, { value: 'customObj' });
getTag(obj); // => 'customObj'

const obj2 = {};
obj2[Symbol.toStringTag] = 'test';
getTag(obj2); // => 'Object'
```

#### Parameters:

| Name  | Type  |
| ----- | ----- |
| `arg` | _any_ |

**Returns:** _string_

数据类型名称 Null | Undefined | Number | Object | ...

Defined in: getTag.ts:48

---

### isFunction

▸ `Const`**isFunction**<T\>(`value`: _any_): value is T

检测参数是否为函数类型

**`since`** 0.0.1

**`example`**

```js
isFunction(class Any {}); // => true
isFunction(() => {}); // => true
isFunction(async () => {}); // => true
isFunction(function* Any() {}); // => true
isFunction(Math.round); // => true
isFunction(/abc/); // => false
isFunction(null); // => false
```

#### Type parameters:

| Name | Default  |
| ---- | -------- |
| `T`  | Function |

#### Parameters:

| Name    | Type  | Description  |
| ------- | ----- | ------------ |
| `value` | _any_ | 要检测的参数 |

**Returns:** value is T

如果参数是 Function，返回 true，否则返回 false

Defined in: isFunction.ts:20

---

### isNative

▸ `Const`**isNative**(`value`: _any_): _boolean_

检测参数是否是内置函数
::: warning 注意
这个方法在 core-js 包的环境下探测内置函数不可靠，因为 core-js 绕过了这类检测方法。
尽管有多个请求，但是 core-js 维护者很清楚地声明：任何试图修复探测方法都会被阻止。
因此，我们别无选择只能抛出错误。
不幸的是，这样还是会影响那些依赖于 core-js 的包，例如 babel-polyfil
:::

**`since`** 0.0.1

**`throws`** This method is not supported with core-js. Try https://github.com/es-shims.

**`example`**

```js
isNative(Array.prototype.push); // => true
isNative(_); // => false
```

#### Parameters:

| Name    | Type  | Description  |
| ------- | ----- | ------------ |
| `value` | _any_ | 要检测的参数 |

**Returns:** _boolean_

如果参数是内置函数，返回 true,否则返回 false

Defined in: isNative.ts:21

---

### isNil

▸ `Const`**isNil**(`value`: _any_): value is undefined \| null

测试参数是否为 null | undefined

**`since`** 0.0.1

**`example`**

```js
isNil(null); // => true
isNil(void 0); // => true
isNil(NaN); // => false
```

#### Parameters:

| Name    | Type  | Description  |
| ------- | ----- | ------------ |
| `value` | _any_ | 要检测的参数 |

**Returns:** value is undefined \| null

如果参数是 null 或者 undefined 返回 true，否则返回 false

Defined in: isNil.ts:13

---

### isNumber

▸ `Const`**isNumber**(`value`: _any_): value is number

检测参数是否为数字

**`since`** 0.0.1

**`example`**

```js
isNumber(3); // => true
isNumber(Number.MIN_VALUE); // => true
isNumber(Infinity); // => true
isNumber(NaN); // => true
isNumber(new Number(2)); // => true
isNumber('3'); // => false
```

#### Parameters:

| Name    | Type  | Description  |
| ------- | ----- | ------------ |
| `value` | _any_ | 要检测的参数 |

**Returns:** value is number

如果参数是数字，返回 true，否则返回 false

Defined in: isNumber.ts:19

---

### isObject

▸ `Const`**isObject**<T\>(`value`: _any_): value is T

检测参数是否属于 `Object` (例如：arrays, functions, objects, regexes, `new Number(0)`, `new String('')`)

**`since`** 0.0.1

**`example`**

```js
isObject({}); // => true
isObject([1, 2, 3]); // => true
isObject(function fn() {}); // => true
isObject(null); // => false
```

#### Type parameters:

| Name | Default  |
| ---- | -------- |
| `T`  | _object_ |

#### Parameters:

| Name    | Type  | Description  |
| ------- | ----- | ------------ |
| `value` | _any_ | 要检测的参数 |

**Returns:** value is T

如果参数属于 `Object`，返回 true，否则返回 false

Defined in: isObject.ts:14

---

### isObjectHost

▸ `Const`**isObjectHost**(`value`: _any_): _boolean_

检测参数是否是 IE < 9 中的宿主对象(window/document...)

**`since`** 0.0.1

**`example`**

```js
isHostObject(window); // => ie < 9: true, other: false
isHostObject(document); // => ie < 9: true, other: false
isHostObject({}); // => ie < 9: false, other: false
isHostObject(Object); // => ie < 9: false, other: false
```

#### Parameters:

| Name    | Type  | Description  |
| ------- | ----- | ------------ |
| `value` | _any_ | 要检测的参数 |

**Returns:** _boolean_

如果参数是宿主对象返回 true，否则返回 false

Defined in: isObjectHost.ts:14

---

### isObjectLike

▸ `Const`**isObjectLike**<T\>(`value`: _any_): value is T

检测参数是否为类对象(所有 不为 null 且 typeof 后的结果是 "object" 的对象)

**`since`** 0.0.1

**`example`**

```js
isObjectLike({}); // => true
isObjectLike([1, 2, 3]); // => true
isObjectLike(Function); // => false
isObjectLike(undefined); // => false
isObjectLike(null); // => false
```

#### Type parameters:

| Name | Default  |
| ---- | -------- |
| `T`  | _object_ |

#### Parameters:

| Name    | Type  |
| ------- | ----- |
| `value` | _any_ |

**Returns:** value is T

如果参数是类对象，返回 true，否则返回 false

Defined in: isObjectLike.ts:15

---

### isObjectPlain

▸ `Const`**isObjectPlain**(`value`: _any_): value is object

检测参数是否为普通对象

**`since`** 0.0.1

**`example`**

```js
class Foo {
  a = 1;
}
isPlainObject(new Foo()); // => false
isPlainObject([1, 2, 3]); // => false
isPlainObject({ x: 0, y: 0 }); // => true
isPlainObject(Object.create(null)); // => true
```

#### Parameters:

| Name    | Type  | Description  |
| ------- | ----- | ------------ |
| `value` | _any_ | 要检测的参数 |

**Returns:** value is object

如果参数是普通对象，返回 true，否则返回 false

Defined in: isObjectPlain.ts:20
