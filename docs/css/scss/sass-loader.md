---
layout: default
title: sass-loader
parent: scss
grand_parent: css
nav_order: 2
has_children: false
permalink: /css/scss/loader
---

sass-loader을 활용하기 위해서는 node-sass 패키지의 버전이 ^4.0.0 이거나 ^5.0.0 이어야 하는데, 현재 제가 설치한 node-sass의 버전은 6.0.1이기 때문에 문제가 발생했습니다. 이 문제는 node-sass 패키지의 버전을 낮춰서 설치하면 해결됩니다.

``` javascript
yarn
1. yarn remove node-sass
2. yarn add node-sass@5.0.0
```

``` javascript
npm
1. npm uninstall node-sass
2. npm install node-sass@5.0.0
```