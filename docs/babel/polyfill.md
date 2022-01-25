---
layout: default
title: 바벨과 폴리필
parent: babel
nav_order: 5
permalink: /babel/polyfill
---

# 바벨과 폴리필
자바스크립트의 최신 기능을 모두 사용하면서 오래된 브라우저를 지원하려면 바벨로 코드 문법을 변환하는 동시에 폴리필도 사용해야 합니다. 폴리필은 **런타임에 기능을 주입하는 것**을 말합니다. 런타임에 기능이 존재하는지 검사해서 기능이 없는 경우에만 주입합니다. 바벨을 사용하면 최신 자바스크립트 표준에 추가된 모든 기능을 사용할 수 있다고 오해하기 쉽습니다. 하지만 바벨을 사용하더라도 폴리필에 대한 설정은 별도로 해야 합니다.

한 가지 예로 ES8에 추가된 String.padStart 메소드는 폴리필을 이용해서 추가할 수 있습니다. 반면에 `async, await`은 폴리필로 추가할 수 없으며, 컴파일 타임에 코드 변환을 해야 합니다.

> 폴리필 코드의 예
``` js
if(!String.prototype.padStart){
    String.prototype.padStart = func; // func는 padStart 폴리필 함수
}
```
padStart 메소드가 있는지 검사해서 없는 경우에만 기능을 주입합니다.

## core-js 모듈의 모든 폴리필 사용하기
`core-js`는 바벨에서 폴리필을 위해 공식적으로 지원하는 패키지입니다. 가장 간단한 사용법은 `core-js`모듈을 js 코드로 불러오는 것입니다.

> core-js 모듈의 사용 예시
``` js
import 'core-js';
const p = Promise.resolve(10);
const obj = {
    a: 10,
    b: 20,
    c: 30,
};
const arr = Object.values(obj);
const exist = arr.includes(20);
```
`core-js` 모듈을 가져오면 해당 모듈의 모든 폴리필이 포함됩니다. 따라서 낮은 버전의 브라우저에서도 Promise, Object.values, includes 메소드를 사용할 수 있습니다.

웹팩을 사용하는 경우에는 아래와 같이 `entry` 속성에 `core-js`모듈을 넣습니다.

> 웹팩에서 core-js 모듈을 사용한 예
``` js
module.exports = {
    entry: ['core-js', './src/index.js'],
    //...
}
```
`core-js` 모듈은 **사용법이 간단하지만, 필요하지 않은 폴리필까지 포함되므로 번들 파일의 크기가 커집니다.** 이 말은 반대로 **번들 파일의 크기에 민감하지 않은 프로젝트에서 사용하기 좋다**는 의미이기도 합니다.

## core-js 모듈에서 필요한 폴리필만 가져오기
core-js로부터 직접 필요한 폴리필만 가져오면 번들 파일의 크기를 줄일 수 있습니다.

> core-js에서 필요한 폴리필을 직접 넣는 코드
``` js
import 'core-js/features/promise';
import 'core-js/features/object/values';
import 'core-js/features/array/includes';
const p = Promise.resolve(10);
const obj = {
    a: 10,
    b: 20,
    c: 30,
};
const arr = Object.values(obj);
const exist = arr.includes(20);
```

core-js 모듈은 폴리필을 추가하는 과정이 번거롭고, 필요한 폴리필을 깜빡하고 포함시키지 않는 실수를 할 수 있습니다. 하지만 **번들 파일의 크기를 최소화할 수 있는 방법이므로 크기에 민감한 프로젝트에 적합합니다.**

## @babel/preset-env 프리셋 이용하기
@babel/preset-env 프리셋은 실행 환경에 대한 정보를 설정해 주면 자동으로 필요한 기능을 주입해 줍니다. 예를 들어, `babel.config.js` 파일에 아래 내용을 입력하면 **특정 버전의 브라우저를 위한 플러그인만 포함됩니다.**

> @babel/preset-env 설정 예
``` js
const presets = [
    [
        '@babel/preset-env',
        {
            targets: '> 0.25%, not dead',
        },
    ],
];
module.exports = { presets };
```

시장 점유율이 0.25% 이상이고 업데이트가 종료되지 않은 브라우저를 target으로 설정했습니다. 브라우저 정보는 `browerlist`라는 패키지의 문법을 사용하므로 자세한 설정은 공식 문서를 참조하면 됩니다.

실습을 위해 프로젝트를 생성합니다.
```
mkdir test-babel-env
cd test-babel-env
npm init -y
npm install @babel/core @babel/cli @babel/preset-env core-js
```

> 프로젝트 루트의 babel.config.js 파일
``` js
const presets = [
    [
        '@babel/preset-env',
        {
            targets: {
                chrome: '40', // 크롬 버전 최소 40 이상
            },
            useBuiltIns: 'entry', // 지원하는 브라우저에서 필요한 폴리필만 포함시킵니다.
            corejs: { version: 3, proposals: true }, // 바벨에게 core-js 버전을 알려 줍니다.
        },
    ],
];
module.exports = { presets };
```

> src/code.js
``` js
import 'core-js'; // useBuiltIns 속성에 entry를 입력하면 core-js 모듈을 가져오는 코드는 각 폴리필 모듈을 가져오는 여러 줄의 코드로 변환됩니다.
const p = Promise.resolve(10);
const obj = {
    a: 10,
    b: 20,
    c: 30,
};
const arr = Object.values(obj);
const exist = arr.includes(20);
```

`npx babel src/code.js`로 바벨을 실행합니다.

> useBuiltIns 속성을 entry로 입력 후 컴파일한 결과
``` js
"use strict";
require("core-js/modules/es.symbol");
require("core-js/modules/es.symbol.description");
// ...
require("core-js/modules/web.url-search-params");
let p = Promise.resolve(10);
const obj = {
    a: 10,
    b: 20,
    c: 30,
};
const arr = Object.values(obj);
const exist = arr.includes(20);
```

모듈을 가져오는 코드가 수십 줄에 걸쳐서 출력됩니다. **여기에 출력되는 폴리필은 크롬 버전 40에 없는 기능을 위한 것입니다.**
실제로 사용한 기능은 Promise, Object.values, includes 메소드밖에 없는데 **불필요하게 많은 폴리필 코드가 추가됐습니다.**

`useBuiltIns` 속성에 `usage`를 입력하면 코드에서 사용된 기능의 폴리필만 추가됩니다.

`babel.config.js`파일에서 `useBuiltIns` 속성값을 `usage`로 입력합니다.

`usage`를 입력할 때는 `core-js`모듈을 가져오는 코드가 필요하지 않습니다.
`src/code.js`파일에서 `core-js`모듈을 가져오는 코드를 제거하고 `npx babel src/code.js`을 실행해 봅니다.

> usage 옵션으로 컴파일한 결과
``` js
"use strict";
require("core-js/modules/es.array.includes"); // 1
require("core-js/modules/es.object.values"); // 1
require("core-js/modules/es.promise"); // 1
require("core-js/modules/es.string.includes"); // 2
require("core-js/modules/es.object.to-string");
let p = Promise.resolve(10);
const obj = {
    a: 10,
    b: 20,
    c: 30,
};
const arr = Object.values(obj);
const exist = arr.includes(20);
```

1. 이 파일의 코드와 관련된 세 개의 폴리필이 추가됐습니다.
2. 문자열의 `includes` 폴리필이 불필요하게 추가됐습니다. 이는 **바벨이 코드에서 사용된 변수의 타입을 추론하지 못하기 때문**입니다. 따라서 바벨 입장에서는 보수적으로 폴리필을 추가할 수밖에 없다.

js는 동적 타입 언어이기 때문에 바벨 입장에서 타입 추론은 까다로운 문제입니다. ts와 같은 정적 타입 언어를 사용한다면 이런 문제를 비교적 쉽게 해결할 수 있습니다.

번들 파일의 크기를 최적화할 목적이라면 필요한 폴리필을 직접 추가하는 방식이 가장 좋습니다. 만약 적당한 번들 파일 크기를 유지하면서 폴리필 추가를 깜빡하는 실수를 막고 싶다면 `@babel/preset-env`가 좋은 선택이 될 수 있습니다.