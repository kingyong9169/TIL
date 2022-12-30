---
layout: page
title: 동영상 사이즈 최적화
parent: 웹 성능 최적화
nav_order: 6
has_children: false
permalink: /optimization/video
---

# 동영상 사이즈 최적화
동영상의 화질을 낮추는 것. 동영상이 메인 컨텐츠인 서비스에서는 사용하는 것은 비추.

1. [media.io](https://www.media.io/)를 통해 동영상 압축.
2. 해상도, 크기, 형식을 선택하여 압축 진행
3.`webm` 형식이 동영상 확장자에서 효율이 좋음(구글 피셜) but 지원하지 않는 브라우저도 있음.

``` html
<video controls width="250">
  <source src="/media/cc0-videos/flower.webm" type="video/webm">
  <source src="/media/cc0-videos/flower.mp4" type="video/mp4">
</video>
```
처럼 webm을 먼저 로드해보고 안되면 mp4로 로드하도록 한다.

화질을 저하시키므로 사용자에게 불편함을 줄 수 있다. 따라서 동영상의 사이즈, 화질을 고려해야 한다.

좋은 방법은 몇 가지가 있다.
1. 동영상의 길이를 짧게 반복적으로 만들면 화질은 올리고 사이즈는 줄일 수 있다.
2. 동영상의 화질을 줄이고 동영상 위에 패턴을 덮어서 사용자에게 화질이 저하됐다는 것을 숨긴다.
3. `css`의 `filter: blur()` 속성을 통해 화질이 저하됐다는 것을 숨긴다.

이처럼 동영상 사이즈 최적화도 결국은 노가다 작업이다. 서비스에서 동영상이 많다면 이를 자동화할 수 있는 방법을 고민해봐야 한다.

## 참고자료
- 인프런 프론트엔드 개발자를 위한, 실전 웹 성능 최적화(feat.React) - Part 2
