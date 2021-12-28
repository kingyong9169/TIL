---
layout: page
title: forEach메소드
parent: javascript
nav_order: 12
has_children: false
permalink: /js/forEach/
---

# forEach 메소드

``` js
board.forEach((row, i) => board[i] = row.split(''));
```

여기서 `board[i]`의 값을 바꾸려는데 `row = row.split('');`을 안 한 이유가 있습니다.
row는 board의 현재 요소의 값을 가져오기 때문에 값에 의한 참조입니다.

따라서 원본 배열 `board[i]`의 값을 바꾸기 위해서는 인덱스를 통해 해당 주소에 직접 접근해야 합니다.