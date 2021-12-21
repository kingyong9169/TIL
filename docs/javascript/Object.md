---
layout: page
title: Object 함수
parent: javascript
nav_order: 4
has_children: false
permalink: /js/Object/
---

# Object 함수

## Object.entries()
- Parameters: 객체 자체의 열거 가능한 문자열 키를 가진 속성 `[key, value]` 쌍이 반환되는 객체입니다.
- Return value: 지정된 객체 자체의 열거 가능한 문자속성 `[key, value] 쌍의 배열`입니다.

``` js
const object1 = {
  a: 'somestring',
  b: 42
};

for (const [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
}

// expected output:
// "a: somestring"
// "b: 42"
```

## Object.keys()
``` js
const object1 = {
  a: 'somestring',
  b: 42,
  c: false
};

console.log(Object.keys(object1));
// expected output: Array ["a", "b", "c"]
```

``` js
Object.keys(obj)
```

- Parameters:
  - obj: 열거할 수 있는 속성 이름들을 반환 받을 객체
- Return value: 전달된 객체의 열거할 수 있는 모든 속성 이름들을 나타내는 문자열 배열
- description: Object.keys() 는 전달된 객체에서 직접 찾은 열거할 수 있는 속성 이름에 해당하는 문자열 배열을 반환합니다. 속성 이름의 순서는 객체의 속성을 수동으로 반복하여 지정하는 것과 동일합니다.

## Object.values()
``` js
const object1 = {
  a: 'somestring',
  b: 42,
  c: false
};

console.log(Object.values(object1));
// expected output: Array ["somestring", 42, false]
```

``` js
Object.values(obj)
```

- Parameters:
  - obj: 배열로 변환할 열거 가능한 속성을 가지는 객체
- Return value: 전달된 객체의 속성 값들을 포함하는 배열
- description: Object.values() 는 파라매터로 전달된 객체가 가지는 열거 가능한 속성의 값들로 구성된 배열을 반환합니다. 배열의 값들이 순서는 오브젝트의 속성을 for in 구문등으로 반복한 결과와 동일합니다. (참고로 for in 구문은 순서를 보장하지 않습니다)

## Object.assign()

``` js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }
```

``` js
Object.assign(target, ...sources)
```

- Parameters
  - target: 목표 객체. 출처 객체의 속성을 복사해 반영한 후 반환할 객체입니다.
  - sources: 출처 객체. 목표 객체에 반영하고자 하는 속성들을 갖고 있는 객체들입니다.
- Return value: 목표 객체(target)
- description: 
  - 목표 객체의 속성 중 출처 객체와 동일한 키를 갖는 속성의 경우, 그 속성 값은 출처 객체의 속성 값으로 덮어씁니다. 출처 객체들의 속성 중에서도 키가 겹칠 경우 뒤쪽 객체의 속성 값이 앞쪽 객체의 속성 값보다 우선합니다.
  - Object.assign() 메서드는 출처 객체의 '열거 가능한 자체 속성'만 목표 객체로 복사합니다. 출처 객체에서 속성 값을 가져올 땐 Get, 목표 객체에 속성 값을 지정할 땐 Set을 사용하므로 각각 접근자와 설정자를 호출합니다. 그러므로 Object.assign()은 속성을 단순히 복사하거나 새로 정의하는 것이 아니라, 할당(assign)하는 것입니다. 따라서 출처 객체가 접근자를 포함하는 경우, 프로토타입에 새로운 속성을 추가하는 용도로는 적합하지 않을 수도 있습니다.

- Object.assign()만으로는 깊은 복사를 수행하려면 다른 방법을 사용해야 합니다.(포스팅에 정리 완료!)

## Object.create()
