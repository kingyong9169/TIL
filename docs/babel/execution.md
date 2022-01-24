---
layout: default
title: 바벨을 실행하는 여러 가지 방법
parent: babel
nav_order: 2
permalink: /babel/execution
---

# 바벨을 실행하는 여러 가지 방법
- `@babel/cli`로 실행하기
- 웹팩에서 `babel-loader`로 실행하기
- `@babel/core`를 직접 실행하기
- `@babel/register`로 실행하기

`@babel/register`를 이용하면 Node.js에서 require코드가 실행될 때 동적으로 바벨이 실행되게 할 수 있습니다. 하지만 리액트를 `@babel/register`와 함께 사용하는 경우는 많지 않으므로 `@babel/register`를 제외한 나머지 세 방식을 설명할 예정입니다.

먼저 필요한 패키지를 설치합니다.
`npm install @babel/core @babel/cli @babel/plugin-transform-arrow-functions @babel/plugin-transform-template-literals @babel/preset-react`

**바벨을 실행하기 위해서는 @babel/core를 필수로 설치**해야 합니다. 두 개의 플러그인과 프리셋 하나를 추가로 설치했습니다.

> code.js
``` js
const element = <div>babel test</div>;
const text = `element type is ${element.type}`;
const add = (a, b) => a + b;
```

## 1. @babel/cli로 실행하기
다음 명령어를 실행해 봅니다.
`npx babel src/code.js --presets=@babel/preset-react --plugins=@babel/plugin-transform-template-literals, @babel/plugin-transform-arrow-functions`

> 바벨 실행 후 콘솔에 출력되는 내용
``` js
const element = React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);
const add = function (a, b) {
    return a + b;
};
```

1. jsx 문법은 createElement 함수 호출로 변환됩니다.
2. 템플릿 리터럴은 문자열의 concat 메소드 호출로 변환됩니다.
3. 화살표 함수는 일반 함수로 변환됩니다.

`@babel/cli`로 거의 모든 설정값을 표현할 수 있지만, 설정할 내용이 많거나 실행 환경에 따라 설정값이 다른 경우에는 설정 파일을 따로 만드는게 좋습니다. 바벨6까지는 `.babelrc`파일로 설정값을 관리했지만, 바벨7부터는 `babel.config.js`파일로 관리하는 것을 추천합니다. 두 파일의 차이점은 뒤에서 설명합니다.

> babel.config.js
``` js
const presets = ['@babel/preset-react'];
const plugins = [
    '@babel/plugin-transform-template-literals',
    '@babel/plugin-transform-arrow-functions',
]

module.exports = { presets, plugins };
```

위의 `@babel/cli` 명령어로 입력했던 설정과 같은 내용입니다. js파일이기 때문에 동적으로 설정값을 만들 수 있습니다. 참고로 바벨6에서는 `.babelrc.js`파일로 위 코드처럼 작성할 수 있습니다. 이제 명령어는 아래와 같이 간소화됩니다.
`npx babel src/code.js`

컴파일된 결과를 파일로 저장하고 싶다면 다음과 같이 입력해봅니다.
``` js
npx babel src/code.js --out-file dist.js // 파일 단위로 처리
npx babel src --out-dir dist // 폴더 단위로 처리
```

## 2. 웹팩의 `babel-loader`로 실행하기
웹팩을 이용하기 위해 추가로 패키지를 설치해 봅니다.
`npm install webpack webpack-cli babel-loader`

> webpack.config.js
``` js
const path = require('path');
module.exports = {
    entry: './src/code.js', // 웹팩으로 번들링할 파일을 지정합니다.
    output: { // 번들링된 결과를 dist/code.bundle.js로 저장합니다.
        path: path.resolve(__dirname, 'dist'),
        filename: 'code.bundle.js',
    },
    module: { // js파일을 bebel-loader가 처리하도록 설정합니다.
        rules: [{ test: /\.js$/, use: 'babel-loader' }], // babel-loader는 바벨의 설정 파일을 이용하므로 이전에 만들어 놓은 babel.config.js 파일의 내용이 설정값으로 사용됩니다.
    },
    optimization: { minimizer: [] }, // 웹팩은 기본적으로 js파일을 압축합니다. 그렇지만 바벨이 제대로 실행됐는지 확인하기 위해 압축 기능을 잠시 끄기로 합니다.
};
```

`npx webpack // 웹팩 실행`

> code.bundle.js
``` js
// ... -> 파일의 앞부분에는 웹팩의 런타임 코드가 추가됩니다.
const element = React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);
const add = function (a, b) {
    return a + b;
};
// ... -> 파일의 뒷부분에서는 바벨이 생성한 코드를 확인할 수 있습니다.
```

## 3. `@babel/core`를 직접 실행하기
이전에 살펴봤던 `@babel/cli`, `babel-loader`는 모두 `@babel/core`를 이용해서 바벨을 실행합니다. 이번에는 직접 `@babel/core`를 사용하는 코드를 작성해서 바벨을 실행해 봅니다.

> runBabel.js
``` js
const babel = require('@babel/cli'); // @babel/cli 모듈을 가져옵니다.
const fs = require('fs');

const filename = './src/code.js';
const source = fs.readFileSync(filename, 'utf8'); // 컴파일할 파일의 내용을 가져옵니다.
const presets = ['@babel/preset-react']; // 바벨의 플러그인과 프리셋을 설정합니다.
const plugins = [
    '@babel/plugin-transform-template-literals',
    '@babel/plugin-transform-arrow-functions',
]
const { code } = babel.transformSync(source, { // transformSync함수를 호출해서 바벨을 실행합니다.
    filename,
    presets,
    plugins,
    configFile: false, // babel.config.js 설정 파일을 사용하지 않도록 합니다.
});
console.log(code); // 콘솔에 출력, 파일로 저장하기 원한다면 fs 모듈을 이용하면 됩니다.
```

`node runBabel.js`로 실행합니다.

`@babel/core` 모듈을 직접 사용하는 방식은 자유도가 높다는 장점이 있습니다. 같은 코드에 대해 다음과 같이 두 가지 설정을 적용한다고 생각해 봅니다.

``` js
// 설정 1
const presets = ['@babel/preset-react'];
const plugins = ['@babel/plugin-transform-template-literals'];

// 설정 2
const presets = ['@babel/preset-react'];
const plugins = ['@babel/plugin-transform-arrow-functions'];
```

`@babel/cli`, `babel-loader`를 이용한다면 바벨을 두 번 실행해야 합니다. 하지만 `@babel/core`를 사용하면 바벨을 좀 더 효율적으로 실행할 수 있습니다. 바벨은 컴파일 시 다음 세 단계를 거칩니다.
- 파싱 단계: 입력된 코드로부터 AST(abstract syntax tree)를 생성합니다.
- 변환 단계: AST를 원하는 형태로 변환합니다.
- 생성 단계: AST를 코드로 출력합니다.

AST는 코드의 구문이 분석된 결과를 담고 있는 구조체입니다. 코드가 같다면 AST도 같기 때문에 같은 코드에 대해서 하나의 AST를 만들어 놓고 재사용할 수 있습니다.

> runBabel2.js
``` js
const babel = require('@babel/cli'); // @babel/cli 모듈을 가져옵니다.
const fs = require('fs');

const filename = './src/code.js';
const source = fs.readFileSync(filename, 'utf8'); // 컴파일할 파일의 내용을 가져옵니다.
const presets = ['@babel/preset-react']; // 바벨의 플러그인과 프리셋을 설정합니다.

const { ast } = babel.transformSync(source, {
    filename,
    ast: true,
    code: false, // 코드는 생성하지 않고 AST만 생성합니다. 프리셋은 두 가지 설정 모두 같으므로 AST를 만들 때 해당 프리셋을 미리 적용합니다.
    presets,
    configFile: false,
});

const { code: code1 } = babel.transformFromAstSync(ast, source, {
    filename,
    plugins: ['@babel/plugin-transform-template-literals'], // 만들어진 AST로부터 첫 번째 설정의 플러그인이 반영된 코드를 생성합니다.
    configFile: false,
});
const { code: code2 } = babel.transformFromAstSync(ast, source, { // 두 번째 설정이 적용된 코드를 생성합니다.
    filename,
    plugins: ['@babel/plugin-transform-arrow-functions'],
    configFile: false,
});
```
설정이 많아질수록 이 방식의 효율은 높아집니다.