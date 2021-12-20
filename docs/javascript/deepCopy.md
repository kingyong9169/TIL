---
layout: page
title: 깊은 복사 vs 얕은 복사
parent: javascript
nav_order: 6
has_children: false
permalink: /js/copy/
---

# 깊은 복사 vs 얕은 복사

## 원시값과 참조값
js에서 값은 원시값, 참조값으로 나뉩니다.

### 원시값
- Number
- String
- Boolean
- Null
- Undefined

### 참조값
- Object
- Array
- Function
- Symbol
- etc..

원시값은 값을 복사할 때 복사된 값을 다른 메모리에 할당하기 때문에 원래의 값과 복사된 값이 서로에게 영향을 미치지 않습니다.

``` javascript
const a = 1;
let b = a;

b = 2

console.log(a); //1
console.log(b); //2
```

하지만 참조값은 변수가 객체의 주소를 가리키는 값이기 때문에 복사된 값(주소)이 같은 값을 가리킵니다.

``` javascript
const a = {number: 1};
let b = a;

b.number = 2

console.log(a); // {number: 2}
console.log(b); // {number: 2}
```

이러한 객체의 특징 때문에 객체를 복사하는 방법은 크게 2가지로 나뉩니다.

## 얕은 복사
객체를 복사할 때 위의 예시처럼 원래값과 복사된 값이 같은 참조를 가리키고 있는 것을 말합니ㅏ.
객체 안에 객체가 있을 경우 한 개의 객체라도 원본 객체를 참조하고 있다면 이를 얕은 복사라고 합니다.

### 1. Object.assign()
Object.assign()은 첫 번째 인자에 들어온 객체에 다음 인자로 들어온 객체를 복사해줍니다.

``` javascript
const obj = {
  a: 1,
  b: {
    c: 2,
  },
};

const copiedObj = Object.assign({}, obj);

copiedObj.b.c = 3

console.log(obj === copiedObj) // false
console.log(obj.b.c === copiedObj.b.c) // true
console.log(obj.b === copiedObj.b); // true
```

### 2.스프레드 연산자(...)
``` javascript
const obj = {
  a: 1,
  b: {
    c: 2,
  },
};

const copiedObj = {...obj}

copiedObj.b.c = 3

console.log(obj === copiedObj) // false
console.log(obj.b.c === copiedObj.b.c) // true
console.log(obj.b === copiedObj.b); // true
```

## 깊은 복사
깊은 복사된 객체는 객체 안에 객체가 있을 경우에도 원본과의 참조가 완전히 끊어진 객체를 말합니다.

### 1. 재귀함수
``` javascript
const obj = {
  a: 1,
  b: {
    c: 2,
  },
};

function deepObj(obj) {
  const result = {};

  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = deepObj(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }

  return result;
}

const copiedObj = deepObj(obj);

copiedObj.b.c = 3

console.log(obj === copiedObj) // false
console.log(obj.b.c === copiedObj.b.c) // false
console.log(obj.b === copiedObj.b); // false
```

### 2. JSON.stringify()
객체를 json문자열로 변환하여 이 과정에서 원본 객체와의 참조가 모두 끊어집니다.
객체를 json 문자열로 변환 후 JSON.parse()를 이용해 다시 js 객체로 만들어주면 깊은 복사가 됩니다.
간단하지만 다른 방법에 비해 아주 느리다고 알려져 있습니다.

``` javascript
const obj = {
  a: 1,
  b: {
    c: 2,
  },
};

const copiedObj = JSON.parse(JSON.stringify(obj));

copiedObj.b.c = 3

console.log(obj === copiedObj) // false
console.log(obj.b.c === copiedObj.b.c) // false
console.log(obj.b === copiedObj.b); // false
```

### 3. lodash모듈의 cloneDeep()
`lodash` 모듈의 `cloneDeep()` 메소드를 이용하여 객체의 깊은 복사가 가능하다.
`yarn add lodash` 명령어로 해당 모듈을 설치해줍니다.

``` javascript
const lodash = require("lodash");

const obj = {
  a: 1,
  b: {
    c: 2,
  },
  func: function () {
    return this.a;
  },
};

const newObj = lodash.cloneDeep(obj);

newObj.b.c = 3;
console.log(obj); // { a: 1, b: { c: 2 }, func: [Function: func] }
console.log(obj === copiedObj) // false
console.log(obj.b.c === copiedObj.b.c) // false
console.log(obj.b === copiedObj.b); // false
```

이와 같이 간단하게 깊은 복사를 구현할 수 있습니다.