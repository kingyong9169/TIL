---
layout: default
title: 플러그인 제작하기
parent: webpack
nav_order: 7
permalink: /webpack/create_plugin
---

# 플러그인 제작하기
플러그인은 웹팩의 처리 과정을 이해해야 작성할 수 있기 때문에 로더보다 작성하기 까다롭습니다. DefinePlugin처럼 플러그인은 모듈의 내용도 수정할 수 있기 때문에 로더가 할 수 있는 거의 모든 일을 할 수 있습니다. 따라서 플러그인을 제대로 이해하고 작성하면 매우 강력한 도구가 될 수 있습니다.

웹팩이 생성하는 번들 파일의 목록과 각 파일의 크기 정보를 파일로 저장해주는 플러그인을 제작해 보겠습니다.

> 프로젝트 생성
```
mkdir webpack-custom-plugin
cd webpack-custom-plugin
npm init -y
npm install webpack webpack-cli
```

> src/index1.js src/index2.js
``` js
// index1.js
function index1() {
    console.log('this is index1');
}
index1();

// index2.js
function index2() {
    console.log('this is index2');
    console.log('this file size is bigger than index1.js');
}
index2();
```

> 프로젝트 루트의 webpack.config.js
``` js
const path = require('path');
const MyPlugin = require('./my-plugin'); // (1)
module.exports = {
    entry: {
        app1: './src/index1.js', // (2)
        app2: './src/index2.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [ new MyPlugin({ showSize: true }) ], // (3)
    mode: 'production',
};
```

1. 우리가 만들 플러그인을 불러옵니다.
2. 두 개의 번들 파일을 만들도록 설정합니다.
3. 우리가 만들 플러그인을 사용하도록 설정합니다. 플러그인에서는 showSize라는 옵션을 입력으로 받아서 처리합니다.

> 프로젝트 루트의 my-plugin.js
``` js
class MyPlugin { // (1)
    constructor(options) { // (2)
        this.options = options;
    }
    apply(compiler) { // (3)
        compiler.hooks.done.tap('MyPlugin', () => { // (4)
            console.log('bundling completed');
        });
        compiler.hooks.emit.tap('MyPlugin', compilation => { // (5)
            let result = '';
            for(const filename in compilation.assets) { // (6)
                if(this.options.showSize) {
                    const size = compilation.assets[filename].size();
                    result += `${filename}(${size})\n`;
                } else {
                    result += `${filename}\n`;
                }
            }
            compilation.assets['fileList.txt'] = { // (7)
                source: function() {
                    return result;
                },
                size: function() {
                    return result.length;
                },
            }
        });
    }
}
module.exports = MyPlugin;
```

1. 플러그인은 클래스로 정의할 수 있습니다.
2. 설정 파일에서 입력한 옵션이 생성자의 매개변수로 넘어옵니다. 이 플러그인은 showSize 옵션을 처리할 수 있습니다.
3. apply 메소드에서는 웹팩의 각 처리 단계에서 호출될 콜백 함수를 등록할 수 있습니다. 콜백 함수를 등록할 수 있는 처리 단계가 무수히 많기 때문에 플러그인으로 할 수 있는 일도 그만큼 다양합니다.
4. 웹팩의 실행이 완료됐을 때 호출되는 콜백 함수를 등록합니다.
5. 웹팩이 결과 파일을 생성하기 직전에 호출되는 콜백 함수를 등록합니다.
6. compilation.assets 에는 웹팩이 생성할 파일의 목록이 들어 있습니다.
7. fileList.txt 파일이 생성되도록 설정합니다.

웹팩을 실행해 보면 dist 폴더 밑에 fileList.txt 파일이 생성되는 것을 확인할 수 있습니다.

> fileList.txt
``` txt
app1.js(959)
app2.js(1015)
```