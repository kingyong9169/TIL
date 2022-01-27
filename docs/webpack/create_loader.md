---
layout: default
title: 로더 제작하기
parent: webpack
nav_order: 6
permalink: /webpack/create_loader
---

# 로더 제작하기
**로더는 모듈을 입력으로 받아서 원하는 형태로 변경 후 js 코드를 반환**합니다. 로더가 js 코드를 반환하기 때문에 웹팩은 css, png, csv 확장자를 갖는 모듈도 처리할 수 있습니다.

여러 로더가 협력 관계에 있을 때는 **중간 과정에서 처리되는 css-loader** 처럼 js가 아닌 다른 형태의 데이터를 반환할 수도 있습니다. 하지만 **style-loader처럼 가장 마지막에 처리되는 로더는 항상 js 코드를 반환합니다.**

> 프로젝트 생성
```
mkdir webpack-custom-loader
cd webpack-custom-loader
npm init -y
npm install webpack webpack-cli
```

> src/member.csv
``` csv
index,name,age
1,mike,23
2,jone,26
```

> src/index.js
``` js
import members from './member.csv';
for(const row of members.rows) {
    const name = row[1];
    const age = row[2];
    console.log(`${name} is ${age} years old`);
}
```

> 프로젝트 루트의 webpack.config.js
``` js
const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.csv$/,
                use: './my-csv-loader',
            },
        ],
    },
    mode: 'production',
};
```

./my-csv-loader가 우리가 만들 로더 파일의 이름입니다. 이 로더는 csv 모듈을 처리합니다.

> 프로젝트 루트의 my-csv-loader.
``` js
module.exports = function(source) { // (1)
    const result = { header: undefined, rows: [] }; // (2)
    const rows = source.split('\n'); // (3)
    for(const row of rows) {
        const cols = row.split(',')
        if(!result.header) {
            result.header = cols;
        } else {
            result.rows.push(cols);
        }
    }
    return `export default ${JSON.stringify(result)}`; // (4)
}
```

1. 로더는 모듈의 내용을 문자열로 입력받는 함수입니다.
2. 모듈을 사용하는 쪽에서 받게 될 데이터입니다.
3. 문자열로 입력된 csv모듈의 내용을 파싱해서 result 객체에 저장합니다.
4. result 객체의 내용이 담긴 js 코드를 반환합니다.

`node dist/main.js`로 의도한 대로 잘 동작하는 것을 확인할 수 있습니다.