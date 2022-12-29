---
layout: page
title: 크롬 퍼포먼스 탭 사용하기
parent: 웹 성능 최적화
nav_order: 3
has_children: false
permalink: /optimization/
---

# 크롬 퍼포먼스 탭 사용하기
웹 페이지의 런타임 성능을 측정하는 것이다. 스크롤 혹은 드래그를 하면 원하는 부분에 대한 정보를 보여준다.

## 상단 버튼
- `record` 버튼을 누르면 녹화가 시작된다. 녹화가 끝나면 `stop` 버튼을 누르면 된다.
  - 버튼을 누른 시점에서 페이지를 조작하고 그 때 성능을 측정한다.
- `reload` 버튼을 누르면 페이지를 새로고침한다. 즉, 페이지가 로드되는 시점부터 성능을 측정한다.
- `clear` 버튼을 누르면 성능 측정 결과를 지운다.
- `setting` 버튼을 누르면 세부 설정을 할 수 있다.
  - `Disable JS samples`: 사소한 JS 우리가 알 필요 없는 것들을 제외하고 보여준다.
  - `Enable advanced paint instrumentation(slow)`: `paint, composite`과 같은 레이어에 대한 것을 상세하게 보여준다.
  - `Network throttling`: `bottleneck`을 설정하여 성능을 측정한다.
  - `CPU throttling`: CPU 성능을 제한한다.

## 타임라인
퍼포먼스 탭이 분석한 전체를 그래프로 보여준다.

1. **노란색**: `JS` 실행영역
2. **보라색**: `Layout` 작업 영역
3. **초록색**: `Paint, Composite` 작업 영역

## 네트워크 타임라인
네트워크의 요청 순서, 언제 받았는지, 언제 처리되었는지 보여준다.

- **왼쪽 가느다란 선**: 네트워크 요청을 보내기 전에 `connection`을 준비하는 시간을 의미
- **밝은 회색**: 요청을 보내고 기다리는 시간
- **진한 회색**: 컨텐츠를 다운로드하는 시간
- **오른쪽 가느다란 선**: 다운로드한 컨텐츠를 메인 스레드에서 처리하는 시간

## Timings
- `DOMContentLoaded(DCL)`: DOM이 로드되는 시간
- `First Paint(FP)`: 첫번째 페인트가 발생하는 시간
- `First Contentful Paint(FCP)`: 첫번째 컨텐츠가 표시되는 시간
- `Load(L)`: 페이지가 완전히 로드되는 시간

## Main - CPU에서 실제로 어떤 동작을 했는지 보여주는 부분
퍼포먼스 탭에서 가장 중요한 부분, 메인 스레드에서 `JavaScript`가 작업되는 영역을 보여준다.

`Main` 스레드 작업을 클릭하면 다음과 같은 항목을 보여준다.

### Summary
`Loading, Scripting, Rendering, Painting, System, Idle, Other`과 같이 어떤 작업들이 이루어졌는지 도넛형 그래프로 보여준다.

### Bottom-Up
가장 최하위에 있는 작업들을 역순으로 보여준다. 트리를 타고 올라가면 root 태스크가 나오게 된다.

### Call Tree
정상적인 순서로 작업들을 보여준다.

### Event Log
어떤 이벤트가 발생했는지 보여준다.

### Layers
`Enable advanced paint instrumentation(slow)`를 키면 레이어가 어떻게 그려졌는지 시각적으로 보여준다.

### Paint Profiler
`Main`에서 `Paint` 부분을 클릭하면 `Layout`이 끝나고 어떤 식으로 `Paint`가 되었는지 보여준다.
