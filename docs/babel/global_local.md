---
layout: default
title: 전체 설정 파일과 지역 설정 파일
parent: babel
nav_order: 4
permalink: /babel/global_local
---

# 전체 설정 파일과 지역 설정 파일
바벨 설정 파일은 크게 두 가지 종류로 나눌 수 있습니다.
- 모든 js 파일에 적용되는 전체(project-wide) 설정 파일입니다. 바벨 버전7에 추가된 `babel.config.js` 파일이 전체 설정 파일입니다.
- js 파일의 경로에 따라 결정되는 지역(file-relative) 설정 파일입니다. `.babelrc`, `.babelrc.js` 파일과 바벨 설정이 있는 `package.json`파일이 지역 설정 파일입니다.

여기서 잠시 전체 설정 파일, 지역 설정 파일의 차이점을 알아보겠습니다.

```
mkdir test-babel-config-file
cd test-babel-config-file
npm init -y
npm install @babel/core @babel/cli @babel/plugin-transform-arrow-functions @babel/plugin-transform-template-literals @babel/preset-react
```

> babel.config.js
``` js
const presets = ['@babel/preset-react'];
const plugins = [
    [
        '@babel/plugin-transform-template-literals',
        {
            loose: true,
        },
    ],
];
module.exports = { presets, plugins };
```

> src/service1/.babelrc
``` js
{
    "plugins": [
        "@babel/plugin-transform-arrow-functions",
        "@babel/plugin-transform-template-literals"
    ]
}
```

service1 폴더 밑에 code.js 파일을 만들고 test-babel-config 프로젝트에서 작성했던 code.js 파일의 코드를 그대로 입력합니다.
`src/service1/code.js`파일을 위한 설정은 다음과 같이 결정됩니다.
- `package.json`, `.babelrc`, `.babelrc.js`파일을 만날 때까지 부모 폴더로 이동합니다. `src/service1/.babelrc`파일을 만났고, 그 파일이 지역 설정 파일입니다.
- 프로젝트 루트의 `babel.config.js`파일이 전체 설정 파일입니다.
- 전체 설정 파일과 지역 설정 파일을 병합합니다.

`npx babel src`로 바벨을 실행합니다.

> 두 설정 파일이 병합되어 컴파일된 결과
``` js
const element = React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type); // loose옵션 적용X
const add = function (a, b) { // 지역 설정의 화살표 함수 플러그인 적용
    return a + b;
};
```
전체 설정 파일의 loose 옵션이 적용되지 않은 것을 확인할 수 있습니다. 이는 지역 설정이 전체 설정을 덮어쓰기 때문입니다.

src 폴더 밑에 service2 폴더를 만들고 다음과 같은 구조로 폴더와 파일을 생성합니다. `.babelrc`, `code.js`파일은 service1 폴더의 내용을 복붙합니다. 그리고 `package.json`파일은 `npm init -y`명령어로 생성합니다.

```
test-babel-config-file
|-- babel.config.js
|-- package.json
|-- src
    |-- service1
        |-- .babelrc
        |-- code.js
    |-- service2
        |-- .babelrc
        |-- folder1
            |-- code.js
            |-- package.json
```

src/service2/folder1/code.js 파일을 위한 설정은 다음과 같이 결정됩니다.
- package.json 파일을 만났고 package.json 파일에 babel 속성이 없으므로 지역 설정 파일은 없습니다.
- 프로젝트 루트의 babel.config.js파일이 전체 설정 파일입니다.

`npx babel src`로 콘솔에 출력되는 내용을 확인해보면 전체 설정 파일만 적용된 것을 확인할 수 있습니다.