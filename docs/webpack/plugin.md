---
layout: default
title: 플러그인 사용하기
parent: webpack
nav_order: 3
permalink: /webpack/plugin
---

# 플러그인 사용하기
플러그인은 로더보다 강력한 기능을 갖습니다. **로더는 특정 모듈에 대한 처리만 담당**하지만 **플러그인은 웹팩이 실행되는 전체 과정에 개입**할 수 있습니다.

> 프로젝트 생성
```
mkdir webpack-plugin
cd webpack-plugin
npm init -y
npm install webpack webpack-cli
```

> src/index.js
``` js
import React from 'react';
import ReactDOM from 'react-dom';
function App() {
    return (
        <div>
            <h3>Hello, webpack plugin example</h3>
            <p>html-webpack-plugin 플러그인을 사용합니다.</p>
        </div>
    );
}
ReactDOM.render(<App />, document.getElementById('root'));
```

패키지 설치
`npm install babel-loader @babel/core @babel/preset-react react react-dom`

> 프로젝트 루트의 webpack.config.js, babel-loader 설정하기
``` js
const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[chunkhash].js', // (1)
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: \.js$/, // (2) 아래 끝까지
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                    },
                },
            },
        ],
    },
    mode: 'production',
};
```

1. `chunkhash`를 사용하면 파일의 내용이 수정될 때마다 파일 이름이 변경되도록 할 수 있습니다.
2. js 모듈을 처리하도록 `babel-loader`를 설정합니다.
`babel.config.js` 파일로 바벨을 설정할 수도 있지만 여기처럼 `babel-loader`에서 직접 바벨 설정을 할 수도 있습니다.

## html-webpack-plugin
웹팩을 실행해서 나오는 결과물을 확인하기 위해서는 이전처럼 HTML 파일을 수동으로 작성해야 합니다. 여기서는 번들 파일 이름에 `chunkhash` 옵션을 설정했기 때문에 파일의 내용이 변경될 때마다 HTML 파일의 내용도 수정해야 합니다. 이 작업을 하는 것이 html-webpack-plugin입니다.

`npm install clean-webpack-plugin html-webpack-plugin`

clean-webpack-plugin은 **웹팩을 실행할 때마다 dist 폴더를 정리**합니다.
여기서는 번들 파일의 내용이 변경될 때마다 파일 이름도 변경되기 때문에 이전에 생성된 번들 파일을 정리하는 용도로 사용합니다.

> webpack.config.js 파일에 플러그인 설정 추가
``` js
// ...
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    // ...
    plugins: [
        new CleanWebpackPlugin(), // (1)
        new HtmlWebpackPlugin({ // (2)
            template: './template/index.html',
        }),
    ],
    // ...
```

1. 웹팩이 실행될 때마다 dist 폴더를 정리하도록 `clean-webpack-plugin`을 설정합니다.
2. index.html 파일이 자동으로 생성되도록 `html-webpack-plugin`을 설정합니다. 이때 우리가 원하는 형태를 기반으로 index.html 파일이 생성되도록 template 옵션을 설정합니다.

`html-webpack-plugin`이 생성하는 HTML에 포함시킬 내용을 index.html 파일에 추가합니다.

> template/index.html
``` html
<html>
    <head>
        <title>웹팩 플러그인 예제</title>
    </head>
    <body>
        <div id="root" />
    </body>
</html>
```

리액트에서 사용될 div 요소를 정의합니다.
기타 필요한 태그를 이 파일에 추가하면 `html-webpack-plugin`이 생성하는 새로운 HTML 파일에 같이 포함됩니다.

웹팩을 실행하면 dist 폴더 밑에 index.html파일이 생성됩니다.

> html-webpack-plugin이 생성한 HTML 파일 dist/index.html
``` html
<html>
    <head>
        <title>웹팩 플러그인 예제</title>
    </head>
    <body>
        <div id="root" />
        <script type="text/javascript" src="main.8d77122044eebd82d355.js"></script>
    </body>
</html>
```

번들 파일이 script 태그로 등록됩니다.

## DefinePlugin
모듈 내부에 있는 문자열을 대체해 주는 `DefinePlugin`을 사용해 봅니다.
이 플러그인은 웹팩에 내장된 플러그인이기 때문에 별도로 설치할 필요는 없습니다.

> DefinePlugin으로 대체할 문자열을 index.js 파일에 추가
``` js
// ...
    <div>
        // ...
        <p>{`앱 버전은 ${APP_VERSION}입니다.`}</p>
        <p>{`10 * 10 = ${TEN * TEN}`}</p>
    </div>
// ...
```

APP_VERSION, TEN 문자열을 우리가 원하는 문자열로 대체합니다.

> webpack.config.js 파일에 코드 추가
``` js
// ...
const webpack = require('webpack');
module.exports = {
    // ...
    plugins: [
        // ...
        new webpack.DefinePlugin({ // (1)
            APP_VERSION: '"1.2.3"', // 또는 JSON.stringify('1.2.3'), (2)
            TEN: '10', // (3)
        }),
        // ...
```

1. DefinePlugin은 웹팩 모듈에 포함되어 있습니다.
2. APP_VERSION 문자열을 '1.2.3'으로 대체합니다.
3. TEN 문자열을 10으로 대체합니다.

웹팩 실행 후 번들 파일의 내용을 확인해 봅니다. 코드가 압축된 상태에서 확인이 쉽지는 않지만 다음과 같은 코드를 확인할 수 있습니다.

``` js
o.a.createElement(
    'div',
    null,
    o.a.createElement('h3', null, 'Hello, webpack plugin example'),
    o.a.createElement('p', null, 'html-webpack-plugin 플러그인을 사용합니다.'),
    o.a.createElement('p', null, '앱 버전은 "1.2.3"입니다.'),
    o.a.createElement('p', null, '10 * 10 = 100'),
)
```

프로덕션 모드로 웹팩을 실행했기 때문에 미리 계산된 결과가 번들 파일에 포함됐습니다.

## ProvidePlugin
자주 사용되는 모듈은 import 키워드를 사용해서 가져오는 것이 귀찮을 수 있습니다.
아래는 자주 사용되는 대표적인 모듈의 예시입니다.

``` js
import React from 'react'; // (1)
import $ from 'jquery';
```

1. jsx 문법을 사용하면 리액트 모듈을 사용하지 않는 것처럼 느껴질 수 있습니다. 사실은 바벨이 `jsx` 문법을 `React.createElement` 코드로 변환해 주기 때문에 리액트 모듈이 필요합니다. 따라서 `jsx` 문법을 사용하는 파일을 작성한다면 (1)번 코드를 상단에 반드시 적어야 합니다.

ProvidePlugin을 사용하면 미리 설정한 모듈을 자동으로 등록해 줍니다. 이 플러그인은 웹팩에 기본으로 포함되어 있기 때문에 별도로 설치할 필요는 없습니다.

> src/index.js 수정
``` js
// import React from 'react';
import ReactDOM from 'react-dom';
// ...
ReactDOM.render(<App />, $('#root')[0]); // (1)
```

1. jquery를 사용해서 돔 요소를 가져옵니다. jquery모듈을 가져오는 import 코드는 작성하지 않아도 됩니다.

> webpack.config.js에서 ProvidePlugin 설정
``` js
// ...
    plugins: [
        // ...
        new webpack.ProvidePlugin({ // (1)
            React: 'react',
            $: 'jquery',
        }),
    ],
    // ...
```

react, jquery 모듈을 ProvidePlugin 설정에 추가합니다.

`npm install jquery`로 설치하고 웹팩을 실행해 보면 에러 없이 번들 파일이 생성되는 것을 확인할 수 있습니다.