---
layout: default
title: sidebar
parent: css
nav_order: 6
has_children: false
permalink: /css/sidebar/
---

# 사이드바 구현하기

<img width="800" alt="스크린샷 2021-12-10 오전 1 26 24" src="https://user-images.githubusercontent.com/62797441/145435827-f0f24ae9-031d-44f2-922b-bafe22e05df7.png">

다음과 같이 사이드바와 메인 컨텐츠를 나누어 구현하였습니다.
먼저, 구글링을 했더니 사이드바를 구현할 때 `position: fixed`를 사용하였고 메인 컨텐츠에서 `margin-left: 사이드바의 width`와 같이 구현하는 것을 볼 수 있었습니다. 하지만 저는 조금 다르게 구현하였습니다. 사이드바와 메인컨텐츠는 화면 상에서 서로 `flex-direction: row`처럼 보였기 때문입니다.

먼저, 사이드바와 메인 컨텐츠를 감싸는 컨테이너를 만들었고 
``` css
display: flex;
flex-direction: row;
```
다음과 같이 하였습니다. 그런 다음 사이드바에서는

``` css
display: block;
width: 200px;
```
로 하여 사이드바에서는 레이아웃에 대해 조금 덜 생각하도록 했습니다.

하지만 메인컨텐츠에서는 달랐습니다.
`flex-direction: row` 이기에 디폴트는 `fit-content`이며 사이드바를 제외하고 화면을 꽉 채우기 위해 따로 width를 설정해야했습니다.

``` css
width: calc(100% - 260px);
```
다음과 같이 따로 width를 설정해주었습니다. 메인컨텐츠의 padding, margin 그리고 사이드바의 width를 고려하여 메인컨텐츠의 width를 정해주어야 제가 원하는 꽉 찬 width가 나왔습니다. 여기까지 구현하는 것은 어렵지 않았지만 한 가지의 삽질을 했습니다.

``` css
width: calc(100%-260px);
```
위와 같이 calc함수를 사용할 때, -, + 등 기호 양쪽으로 공백을 넣지 않으면 웹 브라우저에서 적용되지 않는다는 사실을 간과하고 "왜 안될까?" 계속 고민하였습니다...

단순히 `position: fixed`를 사용하면 더 빠르게 구현했을텐데.. 라는 생각은 있지만 조금 더 화면 레이아웃에 대해 생각하여 의미 있는 시간이었고 이렇게 하나씩 알게 되어 뿌듯하다고 생각합니다.