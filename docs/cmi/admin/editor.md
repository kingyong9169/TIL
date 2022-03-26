---
layout: page
title: editor 개발기록
parent: admin 개발
grand_parent: CMI 프로젝트 기록
nav_order: 2
has_children: false
permalink: /cmi/admin/editor
---

# editor 개발기록

## 이슈1
에디터 DOM 구조
```
editorContainer
|-- quill
|--|-- ql-toolbar
|--|-- ql-container
|-- preview
```

`quill`의 `height`값 고정시키고 `ql-container`의 `max-height`값을 지정한 상태에서 사용자 윈도우 크기에 따라 `ql-toolbar`의 `height`값이 바뀌면 `ql-container`가 `ql-container`의 `height`값이 `ql-toolbar`의 `height`가 늘어나거나 줄은 만큼 바뀌는 것이 아니고 `ql-container`의 `max-height`값으로 고정되어 있어

`quill`의 `height` = `ql-toolbar`의 `height`값 + `ql-container`의 `max-height`값

으로 `quill`밖으로 `div`가 삐져나오는 상황

### 해결방법
`quill`의 `height`값 제거 -> `ql-toolbar`의 `max-height`값 제거 -> `ql-container`의 `height`값 고정

이렇게 하면 `ql-container`의 `height`값은 고정되고 `ql-toolbar`의 `height`값이 바뀌어도 부모인 `quill`의 `height`값은 자식의 `height`값의 합으로 동적으로 바뀐다. 또한, `quill`의 값이 동적으로 바뀌기 때문에 그에 맞춰 `editorContainer`값 또한 자식의 `height`값으로 바뀌어 `quill`의 형제인 `preview`까지 같이 바뀐다.