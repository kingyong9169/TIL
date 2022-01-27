---
layout: default
title: 나무 흔들기
parent: webpack
nav_order: 4
permalink: /webpack/tree_shaking
---

# 웹팩 고급편
지금까지 웹팩의 기본적인 사용법을 알아보았습니다. 이제 웹팩을 이용해서 애플리케이션의 번들 파일을 최적화하는 몇 가지 방법을 살펴보겠습니다. 그리고 로더와 플러그인을 직접 제작해 보면서 웹팩이 내부적으로 어떻게 동작하는지 이해해 보겠습니다.

# 나무 흔들기(tree shaking)
나무 흔들기는 불필요한 코드를 제거해 주는 기능입니다. 나무를 흔들어서 말라 죽은 잎을 떨어뜨리는 것을 비유해서 지은 이름입니다. **웹팩은 기본적으로 나무 흔들기 기능을 제공합니다. 단, 웹팩이 알아서 모든 경우를 잘 처리해주면 좋겠지만 제대로 동작하지 않는 경우도 있습니다.** 따라서 나무 흔들기를 잘 이해하고 있어야 번들 파일 크기를 최소로 유지할 수 있습니다.

> 프로젝트 생성
```
mkdir webpack-tree-shaking
cd webpack-tree-shaking
npm init -y
npm install webpack webpack-cli
```

> src/util_esm.js
``` js
export function func1() {
    console.log('func1');
}
export function func2() {
    console.log('func2');
}
```

ESM(ECMAScript Modules) 문법을 사용하는 코드입니다. ESM은 js 표준 모듈 시스템입니다. ESM에서는 import, export 등의 키워드를 사용합니다.

> src/util_commonjs.js
``` js
function func1() {
    console.log('func1');
}
function func2() {
    console.log('func2');
}
module.exports = { func1, func2 };
```

commonJS에서는 module.exports, require 등의 키워드를 사용합니다. commonJS 문법은 Node.js에서 많이 사용합니다.

> src/index.js을 만들고 util_esm.js 모듈로부터 함수를 가져오는 코드를 입력
``` js
import { func1 } from './util_esm';
func1();
```

func1 함수만 사용하고 func2 함수는 사용하지 않습니다.

웹팩 실행 후 번들 파일을 열어 보면 func2 함수가 보이지 않습니다. 나무 흔들기 덕분에 func2 함수가 제거된 것을 확인할 수 있습니다.

## 나무 흔들기가 실패하는 경우
> src/index.js에서 util_commonjs.js 모듈로부터 함수를 가져오는 코드를 입력
``` js
import { func1 } from './util_commonjs';
func1();
```

commonJS 문법으로 작성된 모듈을 ESM 문법으로 가져오고 있습니다.

웹팩 실행 후 번들 파일을 열어 보면 func2 함수가 보입니다.

**나무 흔들기는 다음과 같은 경우에 동작하지 않습니다.**
- 사용되는 모듈이 ESM이 아닌 경우
- 사용하는 쪽에서 ESM이 아닌 다른 모듈 시스템을 사용하는 경우
- 동적 임포트(dynamic import)를 사용하는 경우

위 코드의 경우 사용되는 util_commonjs.js 모듈이 ESM이 아니기 때문에 나무 흔들기가 동작하지 않았습니다.
**사용되는 쪽, 사용하는 쪽 모두 ESM 문법을 사용하면 나무 흔들기가 제대로 동작합니다.**

> 동적 임포트를 사용하는 코드
``` js
import('./util_esm').then(util => util.func1());
```
동적 임포트를 사용하면 나무 흔들기가 동작하지 않습니다. 동적 임포트는 뒤에서 자세히 설명하겠습니다.

util_esm.js 모듈의 func2 함수를 사용하지 않는다고 무조건 코드를 제거하면 문제가 될 수 있습니다. 예를 들어, 다음과 같이 **모듈 내부에서 자신의 함수를 호출하는 경우에는 웹팩이 해당 함수를 제거하지 않습니다.**

> 모듈 내부에서 자신의 함수를 호출하는 코드
``` js
const arr = [];
export function func1() {
    console.log('func1', arr.length);
}
export function func2() {
    arr.push(10);
    console.log('func2');
}
func(); // (1)
```

1. 모듈이 평가될 때 func2 함수가 실행됩니다. 모듈은 최초로 사용될 때 한 번 평가되는데, 이때 전역 변수 arr이 변경됩니다. 만약 나무 흔들기 단계에서 func2 함수가 제거되면 func1 함수는 의도한 대로 동작하지 않습니다.

**다행히 웹팩은 (1)과 같이 모듈이 평가되는 시점에 호출되는 함수를 제거하지 않습니다.**

## 외부 패키지의 나무 흔들기
외부 패키지에 대해서도 나무 흔들기가 적용됩니다. 하지만 외부 패키지는 저마다 다양한 방식의 모듈 시스템을 사용하기 때문에 나무 흔들기가 제대로 동작하지 않을 수 있습니다.

예를 들어, lodash 패키지는 ESM으로 되어 있지 않기 때문에 나무 흔들기로 코드가 제거되지 않습니다.

``` js
import { fill } from 'lodash';
const arr = [1, 2, 3];
fill(arr, 'a');
```

이 코드에서 fill 함수만 사용하지만 웹팩으로 만들어진 번들 파일에는 로다시의 모든 코드가 포함되어 있습니다.

lodash는 각 함수를 별도의 파일로 만들어서 제공해 줍니다. 따라서 아래와 같이 특정 함수의 모듈을 가져올 수 있습니다.

> lodash 모듈을 잘 사용한 예(1)
``` js
import fill from 'lodash/fill';
// ...
```

위 코드와 함께 웹팩을 실행하면 번들 파일에는 fill 함수의 코드만 포함됩니다. lodash에서는 ESM 모듈 시스템을 사용하는 lodash-es 패키지를 별도로 제공합니다.

> lodash 모듈을 잘 사용한 예(2)
``` js
import { fill } from 'lodash-es';
// ...
```

lodash-es 모듈을 가져오는 경우에는 나무 흔들기가 제대로 적용됩니다.

이처럼 **본인이 사용하는 패키지에 적용된 모듈 시스템이 무엇인지, ESM이 아니라면 각 기능을 별도의 파일로 제공하는지 여부를 파악해야 번들 크기를 줄일 수 있습니다.**

## 바벨 사용 시 주의할 점
한 가지 주의할 점은 우리가 작성한 코드를 바벨로 컴파일한 이후에도 ESM 문법으로 남아 있어야 한다는 것입니다.
만약 @babel/preset-env 플러그인을 사용한다면 babel.config.js 파일에서 다음과 같이 설정해야 합니다.
``` js
const presets = [
    [
        '@babel/preset-env',
        {
            // ...
            modules: false, // (1)
        },
    ],
    // ...
];
// ...
```

1. **모듈 시스템을 변경하지 않도록 설정**합니다. **ESM 문법으로 컴파일된 코드는 웹팩에서 자체적으로 사용 후 제거**되기 때문에 오래된 브라우저에 대한 걱정은 하지 않아도 됩니다.