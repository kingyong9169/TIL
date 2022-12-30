---
layout: page
title: 사용하지 않는 CSS 제거하기
parent: 웹 성능 최적화
nav_order: 8
has_children: false
permalink: /optimization/remove_css
---

# 사용하지 않는 CSS 제거하기
크롬 개발자 도구의 Coverage 탭을 이용하여 사용되지 않는 파일이 얼마나 되는지 확인할 수 있다.

여기서 빨간색 비율이 높으면 높을수록 사용되지 않는 파일이 많다는 뜻이다. 해당 파일을 더블 클릭하면 source 탭에서 빨간 부분을 확인할 수 있고 아래 사진과 같다.

<img src="https://user-images.githubusercontent.com/62797441/210112902-ed182231-46d4-4fa2-bfcb-db2171033bb9.png" width="700" />

이를 자동화할 수 있는 방법이 있다. `purgeCSS` 같은 라이브러리를 사용할 수 있다. `js, html`에 있는 문자열을 확인하여 `css`에 있는 `className`과 비교하여 사용되지 않는 `className`을 제거해준다.

1. `purgeCSS` 설치하기

```bash
npm install purgecss --save-dev
```

2. script 작성

``` json
"purge": "purgecss --css ./build/static/css/*.css --output ./build/static/css/  --content ./build/index.html ./build/static/js/*.js"
```

모든 css파일들과 html, js 파일들을 비교해서 결과를 css 폴더에 저장한다는 의미이다.

하지만 purgeCSS가 완전히 다 없애주지는 않는다. 정확하게 className만 비교하는 것이 아니라 문자열을 비교하기 때문이다.

3. purgecss.config.js 작성
정규표현식을 통해 일치하는 문자열을 찾아서 제거해준다.

``` js
module.exports = {
  defaultExtractor: (content) => content.match(/[\w\:\-%]+/g) || [], // 문자,:,-,%
};
```
