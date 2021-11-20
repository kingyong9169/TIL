---
layout: page
title: splice VS slice
parent: javascript
nav_order: 2
has_children: false
permalink: /javascript/splice-VS-slice/
---

# ⚔️ 배열 다루는 메소드 splice vs slice 비교

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
// removed [], 삭제되지 않았다.
```

splice의 반환 값은 제거한 요소를 담은 배열. 아무 값도 제거하지 않았으면 빈 배열을 반환합니다.

만약 `myFish.splice(-2, 1)`의 경우 -2번째 인덱스 즉, 뒤에서 두번째 인덱스부터 1개의 요소를 제거합니다.

## 🗡 slice
