---
layout: default
title: scss VS sass
parent: scss
grand_parent: css
nav_order: 1
has_children: false
permalink: /css/scss/scssVSsass
---

# Sass란?
CSS를 쓰고 쓰다보면 엄청나게 꼬일수도 있다.. 따라서 반복되는 내용은 줄이고 보다 효율적으로 스타일시트를 관리할 수 있는 `SASS(Syntactically Awesome Style Sheets)`이다.

Sass를 쓰면 `$main-color: red;` 와 같이 변수를 만들 수 있습니다.
그럼 이걸 `h1 { color: $main-color; }` 나 `div { background: $main-color }` 와 같이 돌려쓸 수가 있습니다.

수정이 필요해지면 변수의 값만 바꾸면 되니 유지보수가 훨씬 편해지죠.

CSS를 awesome하게 만들어 주는 것이 바로 Sass입니다.

Scss는 CSS전처리기라고도 합니다. CSS가 만들어지기 전에 이런저런 일들을 먼저 처리해주기 때문입니다. `$main-color`이 변수가 그 예시입니다. 뿐만 아니라 `@for`(반복문), `@if`(조건문) 같은 흐름 제어문이나 내장함수 등 다양한 문법들을 사용할 수 있습니다.

이처럼 Sass가 변수를 일반 텍스트로 바꿔주고, 반복문을 하나하나 작성해주는 일을 해줍니다. 개발자-브라우저 중간에 껴서 일을 해주는 CSS전처리기의 역할을 합니다.

## Sass Scss의 차이
사실 `Scss = Sass`라고 봐도 무관합니다. 문법이 살짝 다르다는 차이점이 존재합니다.

Sass 3버전에서 좀 더 CSS에 호환될 수 있도록 도입된 것이 SCSS문법입니다. 그래서 SCSS를 쓰면 CSS를 쓰던 방식과 유사하게 Sass의 기능을 사용할 수 있습니다. 실제로 실무에서도 SCSS를 많이 사용하고, 공식문서도 SCSS를 기준으로 설명하고 있습니다.

## node-sass
우리가 편하게 쓴 scss코드를 브라우저가 읽을 수 있는 코드(CSS)로 바꿔줄 필요가 있습니다. 이를 위해 컴파일러 설치가 필요합니다. 대표적으로, react와 같은 `node.js`환경에서 쓸 수 있게 만든 `node-sass`가 있습니다.