---
layout: page
title: splice VS slice
parent: javascript
nav_order: 2
has_children: false
permalink: /js/splice-VS-slice/
---

# ⚔️ Array를 다루는 메소드 splice vs slice 비교

## 🔪 splice
``` javascript
const months = ['Jan', 'March', 'April', 'June'];
months.splice(1, 0, 'Feb');
// 인덱스 1번에 추가
console.log(months);
// 결과 : Array ["Jan", "Feb", "March", "April", "June"]
```
위와 같이 `months.splice(idx, 개수)`처럼 idx부터 개수만큼 원본 배열을 삭제하는 것입니다.

``` javascript
const myFish = ['angel', 'clown', 'mandarin', 'sturgeon'];
const removed = myFish.splice(2, 0, 'drum');
// myFish ["angel", "clown", "drum", "mandarin", "sturgeon"]
// removed [], 삭제되지 않음.
```

splice의 반환 값은 제거한 요소를 담은 배열. 아무 값도 제거하지 않았으면 빈 배열을 반환합니다.

만약 `myFish.splice(-2, 1)`의 경우 -2번째 인덱스 즉, 뒤에서 두번째 인덱스부터 1개의 요소를 제거합니다.

## 🗡 slice
``` javascript
const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

console.log(animals.slice(2));
// output: ["camel", "duck", "elephant"]

console.log(animals.slice(2, 4));
// output: ["camel", "duck"]

console.log(animals.slice(1, 5));
// output: ["bison", "camel", "duck", "elephant"]

console.log(animals.slice(-2));
// output: ["duck", "elephant"]

console.log(animals.slice(2, -1));
// output: ["camel", "duck"]
end가 -1이면 -2번째 즉 끝에서 두 번째까지의 요소를 추출하여 새로운 배열 반환
```
위와 같이 `animals.slice(begin, end)`처럼 `begin` 인덱스 부터 `end - 1` 인덱스까지의 배열 요소를 추출하여 `새로운 배열을 반환`합니다.

`animals.slice(2)`처럼 `end`를 생략하면 배열의 끝까지(`animals.length`) 추출합니다.
또한, end 값이 배열의 길이보다 크다면, 배열의 끝까지(`animals.length`) 추출합니다.