---
layout: page
title: call, apply, bind
parent: javascript
nav_order: 17
has_children: false
permalink: /js/call_apply_bind/
---

# call, apply, bind
[참고 블로그](https://www.zerocho.com/category/JavaScript/post/57433645a48729787807c3fd)
함수를 호출하는 방법에는 함수명 뒤에 ()를 붙여 호출하는 방법과 `call, apply`를 사용하여 호출하는 방법이 있습니다.

그 방법을 알아보도록 하겠습니다.

## Function.prototype.call()
`func.call(thisArg[, arg1[, arg2[, ...]]])`
- thisArg: func호출에 제공되는 this의 값
- arg1, arg2, ... : func가 호출할 인수들

``` js
let person1 = {
    name: 'Jo'
};

let person2 = {
    name: 'Kim',
    study: function() {
        console.log(this.name + '이/가 공부를 하고 있습니다.');
    }
};

person2.study(); // Kim이/가 공부를 하고 있습니다.

// call()
person2.study.call(person1); // Jo이/가 공부를 하고 있습니다.
```

예시를 보면 person2의 study메소드에서 this는 person2를 가리키고 있습니다. 그 이유는 [this]()게시물을 보시면 알 수 있습니다. 하지만 call을 통해 this를 person1으로 넣어주고 있기 때문에 person1을 가리키게 됩니다.

## Function.prototype.apply()
`func.apply(thisArg, [argsArray])`
- thisArg: func호출에 제공되는 this의 값
- arg1, arg2, ... : func가 호출할 인수를 지정하는 유사 배열 객체
- 반환값: 지정한 `this` 값과 인수들로 호출한 함수의 결과

첫 번째 매개변수는 `call`과 동일합니다. 하지만 두 번째 매개변수를 배열 혹은 유사 배열 객체로 넣는다는 차이점이 있습니다.

### apply 와 내장함수 사용
`apply` 를 보다 효과적으로 이용하면 일부 내장 함수는 어떤 작업에 대해서는 배열과 루프없이 쉽게 처리됩니다. 다음 예제에서는 배열에서 최대값과 최소값을 구하기 위해 `Math.max/Math.min` 함수를 이용하고 있습니다.
``` js
// min/max number in an array
var numbers = [5, 6, 2, 3, 7];

// using Math.min/Math.max apply
var max = Math.max.apply(null, numbers);
// 이는 Math.max(numbers[0], ...) 또는 Math.max(5, 6, ...)
// 와 거의 같음

var min = Math.min.apply(null, numbers);

// vs. simple loop based algorithm
max = -Infinity, min = +Infinity;

for (var i = 0; i < numbers.length; i++) {
  if (numbers[i] > max) {
    max = numbers[i];
  }
  if (numbers[i] < min) {
    min = numbers[i];
  }
}
```
하지만 이러한 방식으로 `apply` 를 사용하는 경우 주의해야 합니다. `JavaScript` 엔진의 인수 길이 제한을 초과하는 위험성에 대해 이해할 필요가 있습니다. 함수에 너무 많은(대략 몇 만개 이상) 인수를 줄 때의 상황은 엔진마다 다른데(예를 들어 `JavaScriptCore`의 경우 인수의 개수 제한은 `65536`), 상한이 특별히 정해져 있지 않기 때문입니다. 어떤 엔진은 예외를 던집니다. 더 심한 경우는 실제 함수에 인수를 전달했음에도 불구하고 참조할 수 있는 인수의 수를 제한하고 있는 경우도 있습니다(이러한 엔진에 대해 더 자세히 설명하면, 그 엔진이 `arguments`의 상한을 4개로 했다고 하면[실제 상한은 물론 더 위일 것입니다], 위 예제 코드의 전체 배열이 아니라 `5, 6, 2, 3` 만 `apply` 에 전달되어 온 것처럼 작동합니다).

만약 사용하는 배열 변수의 수가 수만을 초과하는 경우에는 복합적인 전략을 강구해야할 것입니다:한 번에 전달할 배열을 분할하여 사용하기:
``` js
function minOfArray(arr) {
  var min = Infinity;
  var QUANTUM = 32768;

  for (var i = 0, len = arr.length; i < len; i += QUANTUM) {
    var submin = Math.min.apply(null,
                                arr.slice(i, Math.min(i + QUANTUM, len)));
    min = Math.min(submin, min);
  }

  return min;
}

var min = minOfArray([5, 6, 2, 3, 7]);
```

## Function.prototype.bind()
`func.bind(thisArg[, arg1[, arg2[, ...]]])`
- thisArg: 바인딩 함수가 타겟 함수의 this에 전달하는 값
- arg1, arg2, ... : func가 호출할 인수들

`bind()`는 새롭게 바인딩한 함수를 만듭니다. 바인딩한 함수는 원본 함수 객체를 감싸는 함수입니다. `bind()`는 `call(), apply()`와 같이 함수가 가리키고 있는 this를 바꾸지만 호출되지는 않습니다.따라서 변수를 할당하여 호출하는 형태로 사용합니다.

``` js
let person1 = {
    name: 'Jo'
};

let person2 = {
    name: 'Kim',
    study: function() {
        console.log(this.name + '이/가 공부를 하고 있습니다.');
    }
};

person2.study(); // Kim이/가 공부를 하고 있습니다.

// bind()
let student = person2.study.bind(person1);

student(); // Jo이/가 공부를 하고 있습니다.
```

## arguments 조작
위 메소드들을 쓰는 예로, 함수의 arguments를 조작할 때 사용합니다.
arguments는 함수라면 처음부터 갖고 있는 숨겨진 속성인데 바로 함수에 들어온 인자를 배열 형식으로(배열X, **유사 배열**) 반환합니다.

``` js
function example() {
  console.log(arguments.join());
}
example(1, 'string', true); // Uncaught TypeError: arguments.join is not a function
```
형태는 배열이지만, 배열이 아니라 유사 배열이기 때문에, 배열의 메소드는 쓸 수 없습니다.
이 때 call이나 apply를 사용할 수 있습니다.

``` js
function example3() {
  console.log(Array.prototype.join.call(arguments));
}
example3(1, 'string', true); // '1,string,true'
```
배열의 프로토타입에 있는 join 함수를 빌려 쓰는 것입니다. this는 arguments를 가리키게 합니다. join외에도 다른 메소드를 이 방식으로 사용할 수 있습니다.