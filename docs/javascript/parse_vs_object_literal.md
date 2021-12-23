---
layout: page
title: JSON.parse()와 객체 리터럴의 성능 비교
parent: javascript
nav_order: 3
has_children: false
permalink: /js/parse_vs_object_literal/
---

# JSON.parse()와 객체 리터럴의 성능 비교
[참조 링크](https://wormwlrm.github.io/2019/12/04/Why-JSON-parse-is-faster-than-object-literal.html)

# JSON.parse()
일반적으로 js를 활용한 웹 어플리케이션에서는 상태 혹은 기타 데이터들을 저장하고 활용하기 위해서 흔히 객체(Object)를 사용하곤 합니다. React, Redux와 같은 라이브러리를 이용하여 구현된 웹 어플리케이션의 경우 용량이 수 KB나 되는 큰 객체를 쉽게 볼 수 있습니다.

안타깝게도 웹 어플리케이션들은 대부분 이러한 데이터를 기반으로 DOM을 만들게 됩니다. 따라서 js객체는 DOM의 렌더링에 있어 중요한 역할을 하게 되므로 사용자들은 모든 데이터가 js 엔진에 의해 로드, 파싱, 컴파일 및 실행이 완료되기까지 빈 화면을 마주할 수 밖에 없습니다.

그러면 이 과정을 어떻게 하면 빠르게 할 수 있을까요?

이를 해결하기 위한 방법 중 하나는 `SSR(서버 사이드 렌더링)`을 이용하는 것입니다. SSR은 서버에서 데이터의 연산과 처리를 끝낸 후 정적인 HTML문서만을 사용자에게 제공하므로 웹 어플리케이션의 초기 로드에 js가 필요하지 않습니다. 즉, js에서 용량이 큰 객체를 사용하지 않아도 됩니다.

일반적으로 데이터를 나타내기 위한 객체의 프로퍼티로 `Date`, `BigInt`, `Map`, `Set`처럼 JSON형식으로 명확하게 나타낼 수 없는 값을 잘 사용하지 않습니다.

``` javascript
// 객체 리터럴 방식
const data = {
  foo: 42,
  bar: 1337,
  ...
};

// JSON.parse 메소드를 이용하는 방식
const data = JSON.parse('{"foo":42,"bar":1337,...}');

// 두 예시는 동등한 객체를 생성합니다.
```
이러한 경우, js 코드에 객체를 직접 선언하는 객체 리터럴 대신, 객체의 내용을 JSON형태로 직렬화하고 js문자열으로 변환한 후 내장된 `JSON.parse`메소드를 이용하는 방법으로도 객체를 생성할 수 있습니다. 또한, 이 메소드로 객체를 생성하는 법이 훨씬 빠르답니다.

더 빠른 이유는 다음과 같습니다.

## JSON이 읽고 분석하기 더 쉽다.
첫 번째 이유는 js엔진에게 있어서 JSON을 읽고 분석하는 것은 매우 간단하기 때문입니다. js파서에게 있어서 위의 코드는 단일 인수를 갖은 `호출식(CallExpression)`일 뿐입니다. 즉, 거대한 양의 데이터는 사실 `단일 문자열 리터럴(StringLiteral)`토큰으로 여겨질 뿐입니다.

하지만 객체 리터럴로 객체를 생성할 경우, 보다 많은 토큰이 필요합니다. 일반적으로 객체의 프로퍼티명은 식별자 토큰 또는 문자열로 취급되는 리터럴로 구성되고 프로퍼티의 값(value)에는 숫자(NumericLiteral)나 문자열(StringLiteral), 불리언(BooleanLiteral), 배열(ArrayLiteral), 객체(ObjectLiteral)처럼 훨씬 다양한 리터럴이 올 수 있습니다. 만약 프로퍼티의 값이 중첩된 객체나 배열일 경우에는 훨씬 더 많은 토큰이 필요합니다.

즉, JSON.parse와 비교했을 때, js파서는 객체 리터럴 코드를 올바르게 토큰화하기 위해서 더 많은 리소스를 필요로 합니다.

## js는 경우의 수가 훨 씬 많습니다.
js객체 리터럴이 읽고 분석하기에 더 어려운 두 번째 이유는, **js문법 상 파서가 객체 리터럴이라는 것을 쉽게 알아채기가 어렵기 때문**입니다.

``` javascript
JSON.parse('{

// 1. 객체의 시작
// JSON.parse('{"foo":42,"bar":1337,...}')

// 2. 유효하지 않은 JSON
// JSON.parse('{"foo"}')
```

js 파서의 입장에서 생각해보면 문맥을 파악하기 위해 소스 코드를 한 글자씩 읽어 나갑니다. 만약 위처럼 `JSON.parse`를 처리하는 도중 중괄호가 열리는 코드를 만났다면 파서의 입장에서는 두 가지 선택을 생각할 수 있습니다.

- 1. 객체의 시작
- 2. 유효하지 않은 JSON

하지만 js 객체 리터럴에서는 훨씬 더 많은 경우의 수가 있습니다.

``` javascript
const x = 42;

const y = ({ x } // 무엇을 의미할까요?
```

위의 예시에서 두 번째 줄에 괄호가 닫히지 않은 채 열려 있습니다. 우리는 이것이 객체 리터럴인지 아닌지 판단할 수 있을까요? 그리고 두 번째 줄의 x가 무엇을 참조하는지 짐작할 수 있을까요? 첫 번째 줄의 바인딩을 참조하는 걸까요?, 아니면 또 다른 것일까요?

코드의 나머지 부분을 보지 않고는 이런 질문에 대답을 할 수 없습니다.
``` javascript
const x = 42;

const y = ({ x }); // 객체 리터럴
```
이 경우 두 번째 줄은 객체 리터럴을 만들고, x는 첫 번째 줄의 변수 x를 참조하는 것을 알 수 있습니다.

``` javascript
const x = 42;

const y = ({ x } = { x: 21 }); // 객체 비구조화
```
하지만 위와 같은 경우에는 객체 비구조화 할당 문법을 이용한 것이기 때문에 첫 번째 줄을 참조하지 않습니다.

``` javascript
const x = 42;

const y = ({ x }) => x; // 화살표 함수
```
이 경우는 x로 명명된 파라미터를 비구조화하고 리턴하는 화살표 함수입니다. 역시 첫 번째 줄을 참조하지 않습니다.

이처럼 js는 문맥에 민감하기 때문에 js를 파싱하는 것은 까다롭지만, json은 그런 문제가 없기 때문에 JSON을 파싱하는 것이 훨씬 간단하다는 것입니다. 따라서 크기가 큰 객체의 경우, js객체 리터럴을 사용하는 것보다 JSON.parse를 사용하는 것이 더 빠릅니다.

## 실제로 적용하기
수동으로 적용하는 방법은 비효율적입니다. 소스 코드에서는 객체 리터럴 방식의 가독성이 더 좋기 때문에, 객체 리터럴 방식을 사용하는 것이 좋습니다.

대신 빌드 도중에 용량이 큰 객체 리터럴을 자동으로 `JSON.parse`로 변환하는 도구를 사용하는 것이 좋습니다.
- webpack
- babel