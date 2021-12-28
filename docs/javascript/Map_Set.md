---
layout: page
title: Map객체와 Set객체
parent: javascript
nav_order: 10
has_children: false
permalink: /js/map_set/
---

# Map객체와 Set객체

## Map 객체
키가 있는 데이터를 저장한다는 점에서 `Object`와 유사합니다. 다만, Map은 **키에 다양한 자료형을 허용한다는 점**에서 차이가 있습니다.

## 생성
- `new Map()` – 맵을 만듭니다.

## 속성
- `map.size`: 요소의 개수를 반환합니다.

## 메소드
- `map.set(key, value)`: key를 이용해 value를 저장합니다.
- `map.get(key)`: key에 해당하는 값을 반환합니다. key가 존재하지 않으면 undefined를 반환합니다.
- `map.has(key)`: key가 존재하면 true, 존재하지 않으면 false를 반환합니다.
- `map.delete(key)`: key에 해당하는 값을 삭제합니다.
- `map.clear()`: 맵 안의 모든 요소를 제거합니다.

``` js
const map = new Map();

map.set('1', 'str1');   // 문자형 키
    .set(1, 'num1');     // 숫자형 키
    .set(true, 'bool1'); // 불린형 키

// Set의 add와 마찬가지로 체이닝이 가능합니다.
// 객체는 키를 문자형으로 변환한다는 걸 기억하고 계신가요?
// 맵은 키의 타입을 변환시키지 않고 그대로 유지합니다. 따라서 아래의 코드는 출력되는 값이 다릅니다.
alert(map.get(1)); // 'num1'
alert(map.get('1')); // 'str1'

alert(map.size); // 3
```

## 맵은 키로 객체를 허용합니다.
``` js
const john = { name: "John" };

// 고객의 가게 방문 횟수를 세본다고 가정해 봅시다.
const visitsCountMap = new Map();

// john을 맵의 키로 사용하겠습니다.
visitsCountMap.set(john, 123);

alert( visitsCountMap.get(john) ); // 123
```

객체형 키를 Object에 써봅니다.
``` js
const john = { name: "John" };

const visitsCountObj = {}; // 객체를 하나 만듭니다.

visitsCountObj[john] = 123; // 객체(john)를 키로 해서 객체에 값(123)을 저장해봅시다.

// 원하는 값(123)을 얻으려면 아래와 같이 키가 들어갈 자리에 `object Object`를 써줘야합니다.
alert( visitsCountObj["[object Object]"] ); // 123
```
`visitsCountObj`는 객체이기 때문에 모든 키를 문자형으로 변환시킵니다. 이 과정에서 `john`은 문자형으로 변환되어 "[object Object]"가 됩니다.

## 맵이 키를 비교하는 방식
`===`와 거의 유사한 방식으로 Set과 마찬가지로 `Nan === Nan`으로 취급합니다. Nan을 키로 쓸 수 있습니다.

## 맵의 요소에 반복 작업하기
- `map.keys()`: 각 요소의 키를 모은 반복 가능한(iterable, 이터러블) 객체를 반환합니다.
- `map.values()`: 각 요소의 값을 모은 이터러블 객체를 반환합니다.
- `map.entries()`: 요소의 `[키, 값]`을 한 쌍으로 하는 이터러블 객체를 반환합니다. 이 이터러블 객체는 `for..of`반복문의 기초로 쓰입니다.
- `map.forEach()`: 맵 요소 각각에 대해 삽입 순서대로 실행합니다.
``` js
recipeMap.forEach( (value, key, map) => {
  alert(`${key}: ${value}`); // cucumber: 500 ...
});
```
여기서 콜백의 각 인수는 다음과 같습니다.
- 요소 값(value)
- 요소 키(key)
- 순회 중인 `Map` 객체

## 객체를 맵으로 바꾸기
``` js
// 각 요소가 [키, 값] 쌍인 배열
const map = new Map([
  ['1',  'str1'],
  [1,    'num1'],
  [true, 'bool1']
]);

alert( map.get('1') ); // str1

const obj = {
  name: "John",
  age: 30
};

const map = new Map(Object.entries(obj));
// [ ["name","John"], ["age", 30] ]

alert( map.get('name') ); // John

```

## 맵을 객체로 바꾸기

``` js
const prices = Object.fromEntries([
  ['banana', 1],
  ['orange', 2],
  ['meat', 4]
]);

// now prices = { banana: 1, orange: 2, meat: 4 }

alert(prices.orange); // 2

const map = new Map();
map.set('banana', 1);
    .set('orange', 2);
    .set('meat', 4);

const obj = Object.fromEntries(map.entries()); // 맵을 일반 객체로 변환 (*)

// 맵이 객체가 되었습니다!
// obj = { banana: 1, orange: 2, meat: 4 }

alert(obj.orange); // 2
```

## Set 객체
- 자료형에 관계 없이 원시 값과 객체 참조 모두 유일한 값을 저장할 수 있습니다.
- 삽입 순서대로 요소를 순회할 수 있고 `Set` 내에서 하나의 값은 한 번만 나타날 수 있습니다.(중복을 제거합니다.)
- `Set` 내의 값은 유일해야 하기 때문에 값이 같은지 검사를 수행합니다. `+0 === -0`으로 간주됩니다.
- `Nan, undefined`도 `Set`에 저장할 수 있습니다. `Nan !== Nan`이지만 Set에서는 같은 것으로 간주됩니다.

## 생성
- `new Set(iterable)` – 셋을 만듭니다. 이터러블 객체를 전달받으면(대개 배열을 전달받음) 그 안의 값을 복사해 셋에 넣어줍니다.
- `const set1 = new Set([iterable])`
  - `iterable`: 반복 가능한 객체(`Array, Map, Set, String, TypedArray, arguments 객체 등`)가 전달된 경우, 그 요소는 모두 새로운 `Set`에 추가됩니다.

## 속성
- `Set.length`: 값이 항상 0입니다.
- `Set.size`: `Set`객체의 원소 수를 반환합니다.

## 메소드 요약

- `set.add(value)`: 값을 추가하고 셋 자신을 반환합니다.
- `set.delete(value)`: 값을 제거합니다. 호출 시점에 셋 내에 값이 있어서 제거에 성공하면 true, 아니면 false를 반환합니다.
- `set.has(value)`: 셋 내에 값이 존재하면 true, 아니면 false를 반환합니다.
- `set.clear()`: 셋을 비웁니다.
- `set.forEach()`: 셋의 값을 대상으로 반복 작업을 수행할 수 있습니다.
- `set.keys()`: 셋 내의 모든 값을 포함하는 이터러블 객체를 반환합니다.
- `set.values()`: set.keys와 동일한 작업을 합니다. 맵과의 호환성을 위해 만들어진 메서드입니다.
- `set.entries()`: 셋 내의 각 값을 이용해 만든 [value, value] 배열을 포함하는 이터러블 객체를 반환합니다. 맵과의 호환성을 위해 만들어졌습니다.


1. `add`: 새로운 값을 추가합니다.
``` js
const mySet = new Set();

mySet.add(1);
mySet.add(5).add('어떤 문자열'); // 계속 붙일 수 있음

console.log(...mySet);
// 1, 5, "어떤 문자열"

```
2. `clear`: `Set`객체를 비웁니다. `mySet.clear();`
3. `delete`: 지정한 요소를 Set 객체에서 제거합니다.
``` js
function removeDuplicated(){
    const itemsFound = {};
    for(const x of [...removeSet]) {
        if(itemsFound[x]) {
            removeSet.delete(x);
            continue;
        }
        itemsFound[x] = true;
        board[x[0]][x[1]] = '';
    }
}
```

``` js
mySet.delete(value); // value: Set 객체에서 제거할 요소의 값

제거했으면 true, 아니면 false 반환
```
4. `entries`: 삽입 순서대로 객체의 각 요소의 대한 배열을 반환합니다. 이때, 각 요소는 `[key, value]` 형태로 반환되며 `key === value`입니다.
``` js
const set1 = new Set();
set1.add(42);
set1.add('forty two');

const iterator1 = set1.entries();

for (const entry of iterator1) {
  console.log(entry);
  // expected output: [42, 42]
  // expected output: ["forty two", "forty two"]
}
```
5. `forEach`: Set 요소 각각에 대해 삽입 순서대로 실행합니다.
``` js
function logSetElements(value1, value2, set) {
  console.log(`s[${value1}] = ${value2}`);
}

new Set(['foo', 'bar', undefined]).forEach(logSetElements);

// expected output: "s[foo] = foo"
// expected output: "s[bar] = bar"
// expected output: "s[undefined] = undefined"
```
여기서 콜백의 각 인수는 다음과 같습니다.
- 요소 값(value)
- 요소 키(key)
- 순회 중인 `Set` 객체

6. `has`: Set 객체에 주어진 요소가 존재하는지 여부를 판별해 반환합니다.
``` js
const set1 = new Set([1, 2, 3, 4, 5]);

console.log(set1.has(1));
// expected output: true

console.log(set1.has(5));
// expected output: true

console.log(set1.has(6));
// expected output: false
```
- value: Set 객체에서 존재 여부를 판별할 값
- 반환 값: 값이 존재하면 true, 아니면 false

7. `values`: Set 객체에 요소가 삽입된 순서대로 각 요소의 값을 순환할 수 있는 Iterator 객체를 반환합니다.
keys()와 동일합니다.

``` js
const set1 = new Set();
set1.add(42);
set1.add('forty two');

const iterator1 = set1.values();

console.log(iterator1.next().value);
// expected output: 42

console.log(iterator1.next().value);
// expected output: "forty two"
```