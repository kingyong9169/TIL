---
layout: default
title: 웹팩 실행하기
parent: webpack
nav_order: 2
permalink: /webpack/execution
---

# 웹팩 실행하기
webpack-cli를 이용하면 CLI(command line interface)에서 웹팩을 실행할 수 있습니다.
webpack-cli를 이용하지 않고 코드를 통해 직접 실행할 수도 있습니다. **cra혹은 next.js같은 프레임워크에서는 세밀하게 웹팩을 다뤄야 하므로 webpack-cli를 이용하지 않고 코드에서 직접 실행합니다.** 하지만 여기서는 webpack-cli를 이용해서 웹팩을 실행하는 방법만 설명합니다.

> 프로젝트 생성
```
mkdir webpack-init
cd webpack-init
npm init -y
npm install webpack webpack-cli
```

> src/util.js
``` js
export function sayHello(name){
    console.log('hello', name);
}
```

> src/index.js
``` js
import { sayHello } from './util';
function myFunc() {
    sayHello('mike');
    console.log('myFunc');
}
myFunc();
```
`npx webpack`으로 웹팩을 실행하면 dist 폴더가 만들어지고 그 밑에 main.js 번들 파일이 생성됩니다. index.js 모듈과 util.js 모듈이 main.js 번들 파일로 합쳐졌습니다. 이처럼 별다른 설정 없이 웹팩을 실행하면 `./src/util.js` 모듈을 입력으로 받아서 `./dist/main.js` 번들 파일을 만듭니다.

## 설정 파일 이용하기

> 프로젝트 루트의 webpack.config.js
``` js
const path = require('path');
module.exports = {
    entry: './src/index.js', // 1
    output: { // 2
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production', // 3
    optimization: { minimizer: [] }, // 4
};
```

1. index.js 모듈을 입력 파일로 사용합니다.
2. dist 폴더 밑에 main.js 번들 파일을 생성합니다.
3. production 모드로 설정하면 js 코드 압축을 포함한 여러 가지 최적화 기능이 기본으로 들어갑니다.
4. 번들 파일의 내용을 쉽게 확인하기 위해 압축하지 않도록 설정합니다.

> npx webpack 후 생성된 dist/main.js
``` js
(function(modules) { // (1)
    var installedModules = {}; // (2)
    function __webpack_require__(moduleId) {/* ... */}
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function(exports, name, getter) {/* ... */}
    __webpack_require__.r = function(name, getter) {/* ... */}
    __webpack_require__.t = function(value, mode) {/* ... */}
    __webpack_require__.n = function(module) {/* ... */}
    __webpack_require__.o = function(object, property) {/* ... */}
    __webpack_require__.p = '';
    return __webpack_require__((__webpack_require__.s = 0));
})([
    function(module, __webpack_exports__, __webpack_require__) {
        'use strict';
        __webpack_require__.r(__webpack_exports__);
        function sayHello(name){ // (3)
            console.log('hello', name);
        }
        function myFunc() {
            sayHello('mike');
            console.log('myFunc');
        }
        myFunc();
    },
]);
```

1. 번들 파일 전체가 즉시 실행 함수로 묶여 있습니다.
2. 모듈을 관리하는 웹팩 런타임 코드입니다. 설정 파일에서 entry 파일을 여러 개 입력하면 각 entry에 의해 생성되는 번들 파일에는 웹팩 런타임 코드가 들어갑니다.
3. 우리가 작성한 코드입니다. 우리가 작성한 코드는 (1) 즉시 실행 함수의 매개변수로 입력됩니다. window, global 등의 전역 변수를 사용하는지, commonJS, AMD 등의 모듈 시스템을 사용하는지의 여부에 따라 번들 파일의 내용은 달라질 수 있습니다.

# 로더 사용하기
로더(loader)는 **모듈을 입력으로 받아서 원하는 형태로 변환한 후 새로운 모듈을 출력해 주는 함수**입니다.
js 파일뿐만 아니라 이미지, css, csv 파일 등 모든 파일은 모듈이 될 수 있습니다.

> 프로젝트 생성
```
mkdir webpack-loader
cd webpack-loader
npm init -y
npm install webpack webpack-cli
```

## js 파일 처리하기
가장 먼저 js파일을 처리하는 `babel-loader`를 알아봅니다.
`npm install babel-loader @babel/core @babel/preset-react react react-dom`

이는 js 코드에서 jsx문법으로 작성된 리액트 코드를 처리하기 위해 필요한 패키지들입니다.

> src/index.js
``` js
import React from 'react';
import ReactDOM from 'react-dom';
function App() {
    return (
        <div className="container">
            <h3 className="title">webpack example</h3>
        </div>
    );
}
ReactDOM.render(<App />, document.getElementById('root'));
```

> 프로젝트 루트의 babel.config.js
``` js
const presets = ['@babel/preset-react'];
module.exports = { presets };
```

> 프로젝트 루트의 webpack.config.js, babel-loader 설정하기
``` js
const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: { // (1) 아래 끝까지
        rules: [
            {
                test: \.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    mode: 'production',
};
```

1. js 확장자를 갖는 모듈은 babel-loader가 처리하도록 설정합니다.

> index.html
``` html
<html>
    <body>
        <div id="root"/>
        <script src="./main.js"></script>
    </body>
</html>
```
index.html 파일을 브라우저에서 실행해 보면 의도한 대로 잘 동작하는 것을 확인할 수 있습니다. 만약 babel-loader를 설정하지 않고 웹팩을 실행하면 웹팩이 jsx문법을 이해하지 못하기 때문에 에러가 발생합니다.

## css파일 처리하기
`npm install css-loader`

> src/App.css
``` css
.container {
    border: 1px solid blue;
}
.title {
    color: red;
}
```

> index.js에 코드 추가
``` js
// ...
import Style from './App.css'; // js 모듈에서 css 모듈을 불러옵니다.
console.log({ Style });
// ...
```

현재는 css모듈을 처리하는 로더가 없기 때문에 **웹팩을 실행하면 에러가 발생합니다.**

> webpack.config.js 파일에 코드 추가
``` js
// ...
module: {
    rules: [
        // ...
        {
            test: /\.css$/, // css 확장자를 갖는 모듈은 css-loader가 처리하도록 설정합니다.
            use: 'css-loader',
        },
    ],
    // ...
}
```

웹팩 실행 후 index.html을 브라우저에서 확인하면 콘솔에서 css 모듈의 내용이 보입니다. 하지만 화면에 보이는 DOM 요소의 스타일은 변경되지 않았습니다. 스타일을 실제로 적용하기 위해서는 `style-loader`가 필요합니다.

`npm install style-loader`

> webpack.config.js 파일에 style-loader를 사용하도록 설정하기
``` js
{
    test: /\.css$/,
    use: ['style-loader', 'css-loader'], // (1)
},
```

1. **로더를 배열로 입력하면 오른쪽 로더부터 실행됩니다.** style-loader는 css-loader가 생성한 css데이터를 style 태그로 만들어서 HTML head에 삽입합니다. style-loader는 번들 파일이 브라우저에서 실행될 때 style 태그를 삽입합니다. 따라서 번들 파일이 실행되다가 에러가 발생하면 style 태그가 삽입되지 않을 수 있습니다.

css-module기능을 이용하면 스타일 코드를 지역화할 수 있습니다. 사실 css-module은 css-loader가 제공해주는 기능입니다. css-loader는 이 외에도 css 코드에서 사용된 @import, url() 등의 처리를 도와줍니다.

## 기타 파일 처리하기

먼저임의의 PNG 파일을 src 폴더 밑에 icon.png파일로 저장합니다.

> src/data.json
``` json
{
    "name": "mike",
    "age": 23
}
```

> src/index.js 코드 추가
``` js
// ...
import './App.css';
import Icon from './icon.png';
import Json from './data.json';
import Text from './data.txt';
export function App() {
    return (
        <div className="container">
            <h3 className="title">webpack example</h3>
            <div>{`name: ${Json.name}, age: ${Json.age}`}</div> // (1) 아래 3줄까지
            <div>{`text: ${Text}`}</div>
            <img src={Icon} />
        </div>
    );
}
// ...
```

1. JSON, TXT, PNG 모듈을 사용합니다.
JSON 모듈은 웹팩에서 기본적으로 처리해 주기 때문에 별도의 로더를 설치하지 않아도 됩니다. TXT 모듈과 PNG 모듈을 처리하기 위해 `npm install file-loader raw-loader`를 입력하여 패키지를 설치합니다.

`file-loader`는 모듈의 내용을 그대로 복사해서 dist 폴더 밑에 복사본을 만듭니다. 그리고 **모듈을 사용하는 쪽에는 해당 모듈의 경로를 넘겨줍니다.**

`raw-loader`는 모듈의 내용을 그대로 js 코드로 가져옵니다.

> webpack.config.js 파일에 코드 추가
``` js
// ...
module: {
    rules: [
        // ...
        {
            test: /\.(png|jpg|gif)$/, // PNG 모듈은 file-loader가 처리하도록 설정합니다.
            use: 'file-loader',
        },
        {
            test: /\.txt$/, // TXT 모듈은 raw-loader가 처리하도록 설정합니다.
            use: 'raw-loader',
        },
        // ...
}
```

**웹팩 실행 후 dist 폴더에 생성된 이미지 파일의 이름에는 해시값이 포함되어 있습니다.** 이 해시값은 **이미지 파일을 수정하는 경우에만 변경**되기 때문에 사용자에게 전달된 이미지 파일은 **브라우저의 캐싱 효과를 최대한 활용할 수 있습니다.**

## 이미지 파일의 요청 횟수 줄이기
이미지 파일을 번들 파일에 포함시키면 브라우저의 파일 요청 횟수를 줄일 수 있습니다. 이때 **번들 파일 크기가 너무 커지면 js가 늦게 실행되므로 작은 이미지 파일만 포함시키는게 좋습니다.** `url-loader`를 사용해서 크기가 작은 이미지 파일만 번들 파일에 포함시켜 보겠습니다.

`npm install url-laoder`

이전에 작성했던 file-loader 설정을 지우고 아래와 같이 변경해줍니다.

> webpack.config.js 코드 수정
``` js
// ...
module: {
    rules: [
        // ...
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192, // (1)
                        // ... (모든 괄호 닫기)
}
```

1. url-loader는 파일 크기가 이 값보다 작은 경우에는 번들 파일에 파일의 내용을 포함시킵니다. 만약 파일 크기가 이 값보다 큰 경우에는 다른 로더가 처리할 수 있도록 fallback 옵션을 제공합니다. fallback 옵션을 입력하지 않으면 기본적으로 file-loader가 처리하게 되어 있습니다.

limit 옵션에 icon.png파일보다 큰 값을 입력하고 웹팩을 실행하여 브라우저에서 img 태그의 **src 속성값을 확인해 보면 파일의 경로가 아니라 데이터가 입력된 것을 확인할 수 있습니다.**