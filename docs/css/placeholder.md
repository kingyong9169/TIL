---
layout: default
title: placeholder 수직 정렬
parent: css
nav_order: 5
has_children: false
permalink: /css/placeholder/
---

# 데베시 프로젝트 placeholder 수직 가운데 정렬

[참조 링크](https://css-tricks.com/almanac/selectors/p/placeholder/)

수직 가운데 정렬을 하려고 구글링을 하는데.. 우선 min-height는 지원을 안해준다고 한다.

``` css
input[type='text']{
  min-height: 45px;
  line-height: 45px;
}
input[type='text']::-webkit-input-placeholder {
  font-size: 25px;
  line-height: 30px;
  text-transform: uppercase;
  vertical-align: middle;
}
```
이렇게 하면 된다는데.. 안돼서 다 빼고 `transform: transelateY(-4px);`
로 해결했다..

## line-height
줄 높이를 정하는 속성입니다.

예를 들어 글자크기가 40px일 때 line-height의 값을 1.5로 하면, 줄 높이는 40의 1.5배인 60px가 됩니다. 줄 높이는 60px인데 글자 크기는 40px이므로, 글자 위와 아래에 각각 10px의 여백이 생깁니다. 줄 높이가 글자 크기보다 작으면 세로 방향으로 글자가 겹치게 됩니다.

## min-height
요소의 최소 높이를 설정합니다. min-height가 height, max-height보다 커지면 요소의 높이는 min-height의 값을 사용합니다.

## transform
js를 사용하지 않고 요소를 애니메이션 시키거나 시각적 및 상호 작용 효과를 제공합니다.

그 중 translate 함수는 X, Y축을 따라 지정된 거리만큼 요소를 이동시킬 때 사용합니다.

``` css
[translate()]
translate (x, y) 함수는 요소를 왼쪽에서부터 x거리, 위에서부터 x 거리만큼 상대적으로 위치를 정하거나, 이동 및 재배치를 지정합니다. Y 방향의 거리는 생략할 수 있지만, 이 경우의 Y방향의 거리는 "0"이 됩니다.

[translateX()]
translateX(거리) 함수는 좌우(수평 방향)의 이동 거리 값을 지정합니다.

[translateY()]
translateY(거리) 함수는 상하(수직 방향)의 이동 거리 값을 지정하십시오.

[translateZ()]
translateZ(거리) 함수는 Z 방향의 거리로 이동을 지정합니다. 이 함수는 백분율 값으로 지정할 수 없습니다. 백분율로 값을 지정해도 "0"이 됩니다.
```

나중에 line-height를 사용하여 해결해보자..

input에서 수정 후 완료 버튼을 누르면 p로 바뀌도록 했는데 위로 조금 올라가는 느낌이다.. 원인은 input focus일 때 shadow DOM이 문제인 것 같다..

input focus에서 마우스 커서 굵기를 바꿀 수는 없을까?..