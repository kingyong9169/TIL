---
layout: page
title: then, catch에 대해
parent: javascript
nav_order: 7
has_children: false
permalink: /js/then_catch/
---

# then, catch에 대해

## Promise.prototype.then()
then() 메서드는 Promise를 리턴하고 두 개의 콜백 함수를 인수로 받습니다. 하나는 Promise가 이행했을 때, 다른 하나는 거부했을 때를 위한 콜백 함수입니다.

``` js
const promise1 = new Promise((resolve, reject) => {
  resolve('Success!');
});

promise1.then((value) => {
  console.log(value);
  // expected output: "Success!"
});
```

``` js
p.then(onFulfilled, onRejected);

p.then(function(value) {
  // 이행
}, function(reason) {
  // 거부
});
```

- parameter
  - onFulfilled: Promise가 수행될 때 호출되는 Function으로, 이행 값(fulfillment value) 하나를 인수로 받습니다.
  - onRejected: Promise가 거부될 때 호출되는 Function으로, 거부 이유(rejection reason) 하나를 인수로 받습니다.

- return value: Promise가 이행하거나 거부했을 때, 각각에 해당하는 핸들러 함수(onFulfilled나 onRejected)가 비동기적으로 실행됩니다. 핸들러 함수는 다음 규칙을 따라 실행됩니다.
  - 함수가 값을 반환할 경우, then에서 반환한 프로미스는 그 반환값을 자신의 결과값으로 하여 이행합니다.
  - 값을 반환하지 않을 경우, then에서 반환한 프로미스는 undefined를 결과값으로 하여 이행합니다.
  - 오류가 발생할 경우, then에서 반환한 프로미스는 그 오류를 자신의 결과값으로 하여 거부합니다.
  - 이미 이행한 프로미스를 반환할 경우, then에서 반환한 프로미스는 그 프로미스의 결과값을 자신의 결과값으로 하여 이행합니다.
  - 이미 거부한 프로미스를 반환할 경우, then에서 반환한 프로미스는 그 프로미스의 결과값을 자신의 결과값으로 하여 거부합니다.
  - 대기 중인 프로미스를 반환할 경우, then에서 반환한 프로미스는 그 프로미스의 이행 여부와 결과값을 따릅니다.

## Promise.prototype.catch()
이 catch()메서드는 Promise거부된 사례만 반환 하고 처리합니다. 호출하는 것과 동일하게 동작합니다.

``` js
const promise1 = new Promise((resolve, reject) => {
  throw 'Uh-oh!';
});

promise1.catch((error) => {
  console.error(error);
});
// expected output: Uh-oh!
```

``` js
p.catch(onRejected);

p.catch(function(reason) {
   // rejection
});
```

- parameter
  - onRejected: Promise가 거부되면 Function A가 호출됩니다.
    - reason: 거부 이유입니다.
- return value: 내부적으로 Promise.prototype.then을 호출하여 매개변수로 (undefined, onRejected)를 전달하여 해당 호출의 값을 반환합니다.