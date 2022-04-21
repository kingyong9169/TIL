---
layout: default
title: transform, transition, animation
parent: css
nav_order: 10
has_children: false
permalink: /css/animation/
---

# transform
``` css
.transform {
  tranform: rotate(45deg); /* 회전, 음수도 가능, 45도 회전 */
  transfrom: scale(2, 3); /*확대 축소, width 2배, height 3배 */
}
```

``` css
.transform {
  tranform: skew(10deg, 20deg); /* 각도 변경, x축, y축 기준으로 입력한 각도만큼 비틂 */
  transfrom: translate(100px, 200px) /* 위치 변경, 선택한 오브젝트의 x, y좌표 변경 */
}
```

# transition
배경색이 빨간색에서 파란색으로 바뀌는 상황을 가정했을 때, 이를 자연스럽게 변하도록 해주는 속성

- transition-property: 효과를 적용하고자 하는 css 속성
- transition-duration: 효과가 나타나는데 걸리는 시간

``` css
.transition {
  transition-property: width;
  transition-duration: 2s;
}
```

- transition-timing-function: 효과의 속도, linear은 `일정하게` 라는 의미
- transition-delay: 특정 조건 하에서 효과 발동, `1s`는 `1초 후`라는 의미
``` css
.transition {
  transition-timing-function: linear;
  transition-delay: 1s;
}
```

가상 선택자: hover -> 마우스를 올렸을 때 라는 조건
``` css
.transition:hover {
  width: 300px;
}
```

종합
property, duration, function, delay 순
``` css
.transition {
  transition: width 2s linear 1s;
}
.transition:hover {
  width: 300px;
}
```
마우스를 올리면 `1초 후에` `width`값이 `300px`로, 2초 동안, 속도 일정하게 변하는 애니메이션 효과 발동

숫자가 하나인 경우에는 -> `duration`이다.

# animation
name, duration, function, delay, count direction 순

delay는 생략 가능!

``` css
.animation {
  animation-name: changeWidth; /* 임의로 작성가능 */
  animation-duration: 3s; /* 애니메이션이 실행되는 시간 설정 */
  animation-timing-function: linear; /* 애니메이션 속도 곡선 제어 */
  animation-delay: 1s; /* 애니메이션 시작하기 전 딜레이 시간 */
  animation-iteration-count: 6; /* 애니메이션 반복 횟수 */
  animation-direction: alternate; /* 애니메이션 진행 방향 */

  /* alternate: from -> to -> from */
  /* normal: from ->to, from -> to */
  /* reverse: to -> from, to -> from */
}

@keyframes changeWidth {
  from { width: 300px; }
  to { width: 600px; }
}
```

## transform & animation

``` css
.box1 {
  animation: rotation 1.5s linear infinite alternate; /* 무한 반복 */
}

@keyframes rotation {
  from { transform: rotate(-10deg); }
  to { transform: rotate(10deg); }
}
```

속성에 prefix를 넣었다면 keyframes에도 prefix에도 넣어야 한다.
``` css
.box1 {
  animation: rotation 3s linear 1s 6 alternate; /* 무한 반복 */
}

@-webkit-keyframes rotation {
  from { -webkit-transfrom: rotate(-10deg); }
  to { -webkit-transfrom: rotate(10deg); }
}
```

본문 영역에 마우스호버 시 배경색이 달라지고 이미지가 커지는 효과
``` css
#main article.one {
  transition: background-color 1s;
}
#main article.one:hover {
  background-color: #8683bd;
}

#main article img {
  transition: all 1s; // 모든 영역을 1초 동안 변하게 한다.
}
#main article img:hover {
  transfrom: scale(1.1);
}
```
