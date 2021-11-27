---
layout: default
title: plugin
parent: eslint
grand_parent: project
nav_order: 1
has_children: false
permalink: /project/eslint/plugin
---

# plugin

``` javascript
"resolutions": {
    "eslint-plugin-react": "^7.27.1",
    "eslint-plugin-react": "^2.25.3"
  }
```

eslint를 적용하니 굉장히 많은 lint오류가 발생했다.. 구글링을 하다가 `devDependencies`에 있던 `eslint-plugin-react`, `eslint-plugin-react`를 `resolutions`으로 옮겨 `yarn install` 하니 오류가 해결됐다..