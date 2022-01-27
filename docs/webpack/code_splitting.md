---
layout: default
title: 코드 분할
parent: webpack
nav_order: 5
permalink: /webpack/code_splitting
---

# 코드 분할
애플리케이션의 전체 코드를 하나의 번들 파일로 만드는 것은 좋은 생각이 아닐 수 있습니다. 불필요한 코드까지 전송되어 사용자의 요청으로부터 페이지가 렌더링되기까지 오랜 시간이 걸릴 수 있기 때문입니다.(번들 파일을 하나만 만들면 관리 부담이 적어지므로 회사 내부 직원용 애플리케이션을 만들 때는 좋은 선택이 될 수 있습니다.) **많은 수의 사용자를 대상으로 하는 서비스라면 응답 시간을 최소화기 위해 코드를 분할하는 것이 좋습니다.**

> 프로젝트 생성
```
mkdir webpack-split
cd webpack-split
npm init -y
npm install webpack webpack-cli react lodash
```

코드를 분할하는 가장 직관적인 방법은 **웹팩의 `entry` 설정값에 페이지별로 파일을 입력하는 것**입니다.

> src/index1.js
``` js
import { Component } from 'react';
import { fill } from 'lodash';
import { add } from './util';
const result = fill([1, 2, 3], add(10, 20));
console.log('this is index1', { result, Component });
```

> src/index2.js
``` js
import { Component } from 'react';
import { fill } from 'lodash';
import { add } from './util';
const result = fill([1, 2, 3], add(10, 20));
console.log('this is index2', { result, Component });
```

두 파일 모두 같은 종류의 모듈을 사용하고 있습니다.

> src/util.js
``` js
export function add(a, b) {
    console.log('this is function');
    return a + b;
}
```

`npm install clean-webpack-plugin`

> 프로젝트 루트의 webpack.config.js 페이지별로 entry 설정
``` js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: { // (1)
        page1: './src/index1.js',
        page2: './src/index2.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [ new CleanWebpackPlugin() ], // (2)
    mode: 'production',
};
```

1. 각 페이지의 js 파일을 entry로 입력합니다.
2. dist 폴더를 정리하기 위해 clean-webpack-plugin을 사용합니다.

웹팩을 실행해 보면 page1.js, page2.js 두 파일이 생성됩니다. 하지만 **두 파일 모두 같은 모듈의 내용을 포함하고 있기 때문에 비효율적입니다.**

## SplitChunksPlugin
웹팩에서는 코드 분할을 위해 **기본적으로 SplitChunksPlugin을 내장**하고 있습니다. 별도의 패키지를 설치하지 않고 설정 파일을 조금 수정하는 것만으로 코드 분할을 할 수 있습니다.

> SplitChunksPlugin을 사용하도록 webpack.config.js 파일 수정
``` js
// ...
module.exports = {
    entry: {
        page1: './src/index1.js',
    },
    // ...
    optimization: {
        splitChunks: { // (1)
            chunks: 'all', // (2)
            name: 'vendor',
        },
    },
    // ...
};
```

1. `optimization`의 `splitChunks`속성을 이용하면 코드를 분할할 수 있습니다.
2. `chunks` 속성의 **기본값은 동적 임포트만 분할하는 `async`** 입니다. 우리는 동적 임포트가 아니더라도 코드가 분할되도록 all 로 설정합니다.

이 상태로 웹팩을 빌드하면 `lodash`와 `react` 모듈은 `vendor.js`파일로 만들어집니다. util.js 모듈은 파일의 크기가 작기 때문에 page1.js 파일에 포함됩니다.

`splitChunks` 속성을 제대로 이해하기 위해서는 먼저 기본값의 형태를 이해해야 합니다.

> splitChunks 속성의 기본값
``` js
module.exports = {
    // ...
    optimization: {
        splitChunks: {
            chunks: 'async', // (1)
            minSize: 30000, // (2)
            minChunks: 1, // (3)
            // ...
            cacheGroups: { // (4)
                default: {
                    minChunks: 2, // (5)
                    priority: -20,
                    reuseExistingChunk: true,
                },
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    // ... (모든 괄호 닫기)
```

1. 동적 임포트만 코드를 분할하도록 설정되어 있습니다.
2. 파일 크기가 30kb이상인 모듈만 분할 대상으로 합니다.
3. 한 개 이상의 청크에 포함되어 있어야 합니다. 청크는 웹팩에서 내부적으로 사용되는 용어로 대개 번들 파일이라고 이해해도 괜찮습니다.
4. 파일 분할은 그룹별로 이뤄집니다. 기본적으로 외부 모듈(vendors)과 내부 모듈(default) 두 그룹으로 설정되어 있습니다. 외부 모듈은 내부 모듈보다 비교적 낮은 비율로 코드가 변경되기 때문에 브라우저에 오래 캐싱될 수 있다는 장점이 있습니다.
5. 내부 모듈은 두 개 이상의 번들 파일에 포함되어야 분할됩니다.

> util.js 모듈을 내부 모듈 그룹으로 분할되도록 설정하기
``` js
// ...
module.exports = {
    // ...
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 10, // (1)
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: 2,
                    name: 'vendors',
                }
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                defaultVendors: {
                    minChunks: 1, // (2)
                    priority: 1,
                    name: 'default',
                    // ... (모든 괄호 닫기)
```

1. 파일 크기 제한에 걸리지 않도록 낮은 값을 설정합니다.
2. 청크 개수 제한을 최소 한 개로 설정합니다.

이 상태로 웹팩을 실행하면 page1.js, vendors.js, default.js 세 개의 번들 파일이 생성됩니다. util.js 모듈은 default.js 번들 파일에 포함됩니다.

새로운 그룹을 추가해서 리액트 패키지만 별도의 번들 파일로 분할해보겠습니다.

> 리액트 패키지는 별도로 분할되도록 설정하기
``` js
module.exports = {
    // ...
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 10, // (1)
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: 1,
                    name: 'vendors',
                },
                reactBundle: {
                    test: /[\\/]node_modules[\\/](react | react-dom)[\\/]/,
                    name: 'react.bundle',
                    priority: 2, // (1)
                    minSize: 100,
                    // ... (모든 괄호 닫기)
```

1. 이 그룹의 우선순위가 높아야 리액트 모듈이 vendors 그룹에 들어가지 않습니다.

위와 같이 설정하면 리액트 패키지는 react.bundle.js 파일로 분할됩니다.

## 동적 임포트
동적 임포트는 동적으로 모듈을 가져올 수 있는 기능입니다. **웹팩에서 동적 임포트를 사용하면 해당 모듈의 코드는 자동으로 분할**되며, 오래된 브라우저에서도 잘 동작합니다.

> src/index3.js
``` js
function myFunc() {
    import('./util').then(({ add }) => 
        import('lodash').then(({ default: _ }) =>
            console.log('value', _.fill([1, 2, 3], add(10, 20))),
        ),
    );
}
myFunc();
```

import 함수는 프로미스 객체를 반환하기 때문에 then 메소드로 연결할 수 있습니다.

> index3.js 파일 번들링을 위해 webpack.config.js 파일 수정
``` js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: {
        page3: './src/index3.js',
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js', // (1)
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [ new CleanWebpackPlugin() ],
    mode: 'production',
};
```

chunkFilename 속성을 이용해서 동적 임포트로 만들어지는 번들 파일의 이름을 설정합니다.

웹팩을 실행하면 page3.js, 1.chunk.js, 2.chunk.js 3 파일이 생성됩니다. 두 청크 파일에는 util.js 모듈과 lodash 모듈의 코드가 들어갑니다. 참고로 **웹팩 런타임 코드는 page3.js 파일에만 들어갑니다.**

``` html
<html>
    <body>
        <script type="text/javascript" src="./page3.js"></script>
    </body>
</html>
```

page3.js 파일의 script 태그만 만들어도 됩니다. **page3.js 파일이 생성되면서 동적으로 나머지 두 파일을 가져옵니다.**

> 두 모듈을 동시에 가져오는 코드
``` js
async function myFunc() {
    const [{ add }, { default: _ }] = await Promise.all([
        import('./util'),
        import('lodash'),
    ]);
    console.log('value', _.filee([1, 2, 3], add(30, 20)));
}
myFunc();
```

Promise.all을 이용하여 두 모듈을 동시에 가져옵니다.

## 분할된 파일을 prefetch, preload로 빠르게 가져오기
만약 myFunc 함수가 버튼의 이벤트 처리 함수로 사용된다면 버튼을 클릭하기 전에는 두 모듈을 가져오지 않습니다. 이는 꼭 필요할 때만 모듈을 가져오기 때문에 **lazy loading**으로 불립니다. 게으른 로딩은 번들 파일의 크기가 큰 경우에는 응답 속도가 느리다는 단점이 있습니다.

웹팩에서는 동적 임포트를 사용할 때 HTML의 prefetch, preload 기능을 활용할 수 있도록 옵션을 제공합니다.
**`prefetch`는 가까운 미래에 필요한 파일이라고 브라우저에게 알려 주는 기능입니다.** HTML에서 prefetch로 설정된 파일은 브라우저가 바쁘지 않을 때 미리 다운로드됩니다. 따라서 prefetch는 게으른 로딩의 단점을 보완해줄 수 있습니다.

**`preload`는 지금 당장 필요한 파일이라고 브라우저에게 알리는 기능입니다.** HTML에서 preload로 설정된 파일은 첫 페이지 로딩 시 즉시 다운로드됩니다. 따라서 preload를 남발하면 첫 페이지 로딩 속도에 부정적인 영향을 줄 수 있으므로 주의해야 합니다.

> prefetch, preload 설정하기
``` js
await new Promise(res => setTimeout(res, 1000)); // (1)
const [{ add }, { default: _ }] = await Promise.all([
    import(/*webpackPreload: true*/ './util'),
    import(/*webpackPrefetch: true*/ 'lodash'),
]);
// ...
```

1. 너무 빠르게 처리하면 prefetch 효과를 확인할 수 없으므로 1초 기다립니다.
2. util.js 모듈은 preload로 설정합니다.
3. lodash 모듈은 prefetch로 설정합니다.

웹팩 실행 후 브라우저에서 결과를 확인해봅니다.
``` html
<html>
    <head>
        <link rel="prefetch" as="script" href="1.chunk.js">
        <script charset="utf-8" src="1.chunk.js"></script>
        <script charset="utf-8" src="2.chunk.js"></script>
    </head>
    <body>
        <script type="text/javascript" src="./page3.js"></script>
    </body>
</html>
```

1.chunk.js 파일은 prefetch가 적용됐습니다. link 태그는 page3.js 파일이 실행되면서 웹팩에 의해서 삽입됩니다.
script 태그도 myFunc 함수가 실행될 때 웹팩에 의해서 삽입됩니다.

그런데 이상한 점이 있습니다. 분명 preload 기능을 이용한다고 했는데, preload설정이 HTML코드가 반영되지 않은 것입니다. 사실 preload는 첫 페이지 요청 시 **전달된 HTML 태그 안에 미리 설정되어 있어야 하므로 웹팩이 지원할 수 있는 기능은 아닙니다.** 대신 **웹팩은 page3.js 파일이 평가될 때 2.chunk.js 파일을 즉시 다운로드함으로써 어느 정도는 preload 기능을 흉내 낼 수 있습니다.**