---
layout: default
title: 확장성과 유연성을 고려한 바벨 설정 방법
parent: babel
nav_order: 3
permalink: /babel/attribute
---

# 확장성과 유연성을 고려한 바벨 설정 방법
바벨 설정 파일에서 사용할 수 있는 다양한 속성 중에서 `extends`,  `env`, `overrides`속성을 알아봅니다. `extend`속성을 이용하면 다른 설정 파일을 가져와서 확장할 수 있고, `env`또는 `overrides`속성을 이용하면 환경별 또는 파일별로 다른 설정을 적용할 수 있습니다.

## extends 속성으로 다른 설정 파일 가져오기
> common/.babelrc
``` js
{
    "presets": ["@babel/preset-react"],
    "plugins": [
        [ // 해당 플러그인에 옵션을 설정할 때는 배열로 만들어서 두 번째 자리에 옵션을 넣습니다.
            "@babel/plugin-transform-template-literals",
            {
                "loose": true // 템플릿 플러그인에 loose 옵션을 주면 문자열을 연결할 때 concat메소드 대신 + 연산자를 사용합니다.
            }
        ]
    ]
}
```

babel.config.js 파일을 만들지 않고 .babelrc 파일을 만든 이유는 다음 게시글에서 설명할 두 파일의 차이를 보면 이해할 수 있습니다.

> src/example-extends/.babelrc
``` js
{
    "extends": "../../common/.babelrc", // extends 속성을 이용해서 다른 파일에 있는 설정을 가져옵니다.
    "plugins": [ // 가져온 설정에 플러그인을 추가합니다.
        "@babel/plugin-transform-arrow-functions",
        "@babel/plugin-transform-template-literals" // 템플릿 리터럴 플러그인은 가져온 설정에 이미 존재합니다.
    ]
}
```
**이 때 플러그인 옵션은 현재 파일의 옵션으로 결정됩니다. 따라서 기존에 설정했던 loose 옵션은 사라집니다.**

> src/example-extends/code.js
``` js
const element = <div>babel test</div>;
const text = `element type is ${element.type}`;
const add = (a, b) => a + b;
```

`npx babel src/example-extends/code.js`로 바벨을 실행합니다.

> 실행 결과
``` js
const element = React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type); // loose옵션 적용X
const add = function (a, b) {
    return a + b;
};
```

## env속성으로 환경별로 설정하기

> src/example-env/.babelrc
``` js
{
    "presets": ["@babel/preset-react"],
    "plugins": [
        "@babel/plugin-transform-arrow-functions",
        "@babel/plugin-transform-template-literals"
    ],
    "env": { // 환경별로 다른 설정을 줄 수 있습니다.
        "production": { // 프로덕션 환경에서는
            "presets": ["minify"] // 압축 프리셋을 사용하도록 설정합니다.
        }
    }
}
```
**앞에서 설정한 리액트 프리셋은 유지되고 압축 프리셋이 추가되는 형태가 됩니다.**

> src/example-env/code.js
위의 example-extends의 코드와 동일합니다.

바벨에서 현재 환경은 다음과 같이 결정됩니다.
`process.env.BABEL_ENV || process.env.NODE_ENV || "development"`

다음과 같이 프로덕션 환경으로 바벨을 실행해 봅니다.
- 맥: `NODE_ENV=production npx babel ./src/example-env`
- 윈도우: `set NODE_ENV=production && npx babel ./src/example-env`

> 콘솔에 출력되는 내용
``` js
const element = React.createElement("div", null, "babel test"),
text = "element type is ".concat(element.type), add = function (a, b) {return a + b};
```

여기서는 압축 프리셋이 적용되어 코드를 읽기가 힘듭니다. 이번에는 개발 환경에서 바벨을 실행해 봅니다.

`npx babel ./src/example-env`

NODE_ENV 환경 변수를 설정하지 않으면 기본값 development가 사용됩니다. 콘솔에 출력하면 위에서 출력되었던 내용과 동일합니다.

## overrides 속성으로 파일별로 설정하기

> src/example-overrides/.babelrc
``` js
"presets": ["@babel/preset-react"], // 리액트 프리셋과 템플릿 리터럴 플러그인을 설정합니다.
    "plugins": ["@babel/plugin-transform-template-literals"],
    "overrides": [ // overrides 속성을 이용하면 파일별로 다른 설정을 할 수 있습니다.
        {
            "include": "./service1", // service1 폴더 밑에 있는 파일에는 아래 플러그인 설정을 적용합니다.
            "exclude": "./service1/code2.js", // 이 파일에는 아래 플러그인 설정을 적용하지 않습니다.
            // 따라서 service1 폴더 하위에서 code2.js 파일을 제외한 모든 파일에 화살표 함수 플러그인을 적용합니다.
            "plugins": ["@babel/plugin-transform-arrow-functions"]
        }
    ]
```