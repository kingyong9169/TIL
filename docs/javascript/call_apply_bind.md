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

첫 번째 매개변수는 `call`과 동일합니다. 하지만 두 번째 매개변수를 배열 혹은 유사 배열 객체로 넣는다는 차이점이 있습니다.

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