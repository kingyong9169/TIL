---
layout: page
title: Array 비우는 방법
parent: javascript
nav_order: 14
has_children: false
permalink: /js/clear_array/
---

# Array 비우는 방법
배열을 비우는 방법을 소개합니다!

## 배열을 크기가 0인 새 배열로 초기화
``` js
let Arr = [1,2,3,4];
Arr = [];
```
가장 빠른 방법입니다. 다른 위치에서 원래 배열(Arr)에 대한 참조가 없으면 간단합니다.

``` js
let Arr1 = [1,2,3,4,5,6];
let Arr2 = Arr1;
Arr1 = [];
console.log({Arr1, Arr2});

// 출력
// {
//   Arr1: [],
//   Arr2: [1, 2, 3, 4, 5, 6]
// }
```

이렇게 하면 참조가 업데이트되지 않으며 해당 위치는 이전 배열을 계속 사용합니다. 이는 곧 이전 배열 내용에 대한 참조가 **여전히 메모리에 유지되어 메모리 누수가 발생한다는 것**을 의미합니다.
따라서 원래 변수 `Arr1`으로 배열을 참조하는 경우에만 사용해야 합니다.

## length 속성을 사용하여 배열 비우기
``` js
Arr1.length = 0;
```
길이를 0으로 설정하여 기존 배열을 지웁니다. 배열의 길이 속성은 읽기/쓰기 속성이므로 ECMAScript 5에서 엄격 모드를 사용할 때도 작동합니다.

이 방법은 배열의 모든 항목을 삭제하여 다른 참조에 영향을 미치기 때문에 **메모리 누수가 발생하지 않습니다.** 다음 예시와 같습니다.

``` js
let foo1 = [1,2,3];
let bar1 = [1,2,3];
let foo2 = foo1;
let bar2 = bar1;
foo1 = [];
bar1.length = 0;
console.log({foo1, bar1, foo2, bar2}); 

// 출력
// {
//   bar1: [],
//   bar2: [],
//   foo1: [],
//   foo2: [1, 2, 3]
// }
```

## splice() 메서드를 사용하여 JavaScript에서 배열 비우기
``` js
let Arr1 = ["Tomato", "Letcuce", "Spinash", "Cucumber"];
Arr1.splice(0, Arr1.length);
console.log(Arr1);

// 출력
// []
```

## 네이티브 프로토타입 수정
``` js
var arr = [1, 2, 3, 4, 5, 6];

Array.prototype.remove =
  Array.prototype.remove ||
  function() {
    this.splice(0, this.length);
  };

arr.remove();
console.log(arr);

// 출력
// []
```

다음과 같이 Array의 네이티브 프로토타입을 수정하여 새로운 함수를 만들 수 있습니다. 이렇게 하면 모든 Array에서 remove를 사용할 수 있습니다. 하지만 좋지 않은 방법입니다.

**프로토타입은 전역으로 영향을 미치기 때문에** 프로토타입을 조작하면 기존 코드와 충돌이 날 가능성이 큽니다. 두 라이브러리에서 동시에 Array.prototype.remove 메서드를 추가하면 한 라이브러리의 메서드가 다른 라이브러리의 메서드를 덮어씁니다.

이런 이유로 네이티브 프로토타입을 수정하는 것은 추천하지 않습니다.[모던 자바스크립트](https://ko.javascript.info/native-prototypes)

모던 프로그래밍에서 네이티브 프로토타입 변경을 유일하게 허용하는 경우는 폴리필을 만드는 경우입니다. 더 자세한 내용은 네이티브 프로토타입에서 소개할 예정입니다.