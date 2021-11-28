---
layout: default
title: scroll
parent: css
nav_order: 4
has_children: false
permalink: /css/scroll/
---

# 스크롤 항상 없애기, 항상 표시하기

## 스크롤 항상 없애기
``` css
body {
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

## 스크롤 항상 표시하기
``` css
body {
  overflow-y: scroll;
}
```

이번 데베시 체크메이트 관리자 사이트에서는 항상 스크롤을 표시하려고 한다. 이유는 마우스의 스크롤 기능이 고장난 유저도 분명 존재하기 때문이다.
또한, 홈페이지를 만들다가 페이지를 이동할 때 화면이 덜컬덜컥 거리는 듯한 느낌을 받을 때, 가장 먼저 스크롤바를 의심해야 한다.

어떤 페이지는 내용이 길게 있어서 스크롤바가 생기지만 어떤 페이지에서는 내용이 짧아 스크롤바가 생기지 않는다면 페이지 이동 시 화면이 덜컥 거린다는 느낌을 받을 수 있다. 따라서 항상 없애거나 항상 표시하는 것이 좋다.