---
layout: page
title: 성능 최적화 시작하기 2
parent: 웹 성능 최적화
nav_order: 2
has_children: false
permalink: /optimization/start2
---

# 성능 최적화 시작하기 2

1. 렌더링 성능 최적화
- 애니메이션 최적화(reflow, repaint)

2. 로딩 성능 최적화
- 컴포넌트 lazy loading
- 컴포넌트 preloading
- 이미지 preloading

## 애니메이션 최적화
유저 컴퓨터는 초당 `60Frame(60FPS)`를 그리는데, 브라우저도 마찬가지로 `60FPS`로 그려야 자연스러운 애니메이션이 일어나게 된다. 하지만 `30FPS`, `20FPS`로 작아지면 유저는 느리다고 느끼게 된다. 그래서 `60FPS`를 유지하기 위해서는 애니메이션 최적화가 필요하다. 이러한 현상을 **쟁크 현상**, 애니메이션이 버벅이는 현상 이라고 한다.

이유를 알기 위해서는 브라우저 렌더링 과정을 알아야 한다.

1. `HTML`, `CSS`를 가공해서 `DOM + CSSOM`을 만들게 된다.
- 각 `html, css`를 `Object Model` 즉, 객체로 트리 구조로 만든다.
2. `DOM + CSSOM`를 조합해서 **렌더 트리**로 만든다.
- `DOM` 요소에 `css`를 적용한 것이다.
3. `Layout`을 만든다(화면의 레이아웃을 잡는다.). 이 단계에서는 실제 위치, 크기를 계산한다.
- `viewport size, width, height, padding, margin`과 같은 속성들이다.
4. 레이아웃이 그려진 화면 위에 `Paint` 단계가 일어난다. 이 단계에서는 실제 색상을 체운다.
- `color, box-shadow`와 같은 속성들이다.
5. 각 레이어들을 합성(`Composite`)한다.
- 위 단계들은 각 레이어로 쪼개져서 진행한다.
- 쪼개진 레이어를 합성해서 최종 화면을 만든다.

전체적인 과정을 `CRP, Critical Rendering Path`, `Pixel Pipeline`이라고 부른다.

만약 여기서 일부 스타일(`width`, `height`와 같은 속성)이 변경되면, `DOM + CSSOM`을 다시 만들어야 한다. 즉, 모두 재실행해야 한다. 그러면 `Render tree`, `Layout`과 `Paint`가 다시 일어나게 된다. 이러한 과정을 `reflow`라고 부른다.

애니메이션의 관점에서는 부드럽게 보이기 위해서는 `60FPS`로 화면을 재빠르게 보여줘야 한다. 이 짧은 시간동안 위 단계들을 거치려다 보니 일부 화면들을 생략하게 되며 브라우저가 버벅이는 현상이 일어난다.

즉, 화면이 보여져야 하는 시점에 아직 브라우저 렌더링 과정을 미처 다 수행하지 못한 것이다. 따라서 이전 화면을 보여주게 되어 버벅이는 것처럼 보이는 것이다.

but `color`, `background-color`와 같은 색깔을 변경하는 작업이 일어나게 되면, `Layout`과정을 생략하게 된다. 이를 `repaint`라고 한다.

또한, `reflow`, `repaint` 모두 피하는 방법이 있다. 즉, `Layout`, `Paint`과정을 생략하는 방법이다. `transform, opacity(GPU가 관여할 수 있는 속성)`으로 변경하는 것이다.

<img width="500" alt="각 속성에 대한 영향도" src="https://user-images.githubusercontent.com/62797441/209995823-5e834e37-3381-40d8-95d0-b383ca663450.png">

위 사진에서 오른쪽으로 갈 수록 애니메이션을 최적화할 수 있는 것이다.

만약 이전에 `width`, `height`와 같은 속성으로 애니메이션을 사용했다면 `transform` 속성을 지원하는 `translate`, `scaleX`속성을 사용하여 최적화하면 된다.

또한, `transform` 속성으로 인해 비율이 무너졌다면 `transform-origin` 속성을 사용하여 비율을 원하는대로 조정할 수 있다.

<img width="500" alt="최적화 전후 비교" src="https://user-images.githubusercontent.com/62797441/209996448-803790c4-6dd4-4d05-bfae-f5e8f9fe6b7a.png">

위 사진을 통해 전후 비교를 할 수 있다. 보라색 영역이 애니메이션이 일어나는 영역이다. 왼쪽 사진이 오른쪽 사진에 비해 보라색 영역을 많이 차지하며 이는 메인 스레드가 굉장히 많은 일을 담당하고 있다는 사실을 알 수 있다.

`width`를 사용했을 때, 가운데에 있는 `FPS`를 보면 `60FPS`에서 `FPS`가 떨어지는 것을 볼 수 있다. 반면 `transform`을 사용했을 때, 가운데에 있는 FPS를 보면 `width`를 사용했을 때보다 `FPS`가 떨어지지 않는 것을 볼 수 있다.

## 컴포넌트 lazy loading
모달과 같이 처음 페이지에 진입했을 때, 보여줄 필요가 없는 부분을 `lazy loading`하는 것이다. 

하지만 모달을 클릭한 순간 모달 관련 js가 로드되며 이를 `javascript evaluate`하는 시간이 소요된다. 즉, 모달을 띄울 때는 오히려 성능이 느려졌다.

이를 최적화하기 위해 `컴포넌트 preload`를 하는 것이다. 컴포넌트를 클릭하기 전에 `preload`를 하여 `javascript evaluate`하는 시간을 줄이는 것이다. 문제는 언제 미리 로드할지 결정하는 것이다.

## 컴포넌트 preload

### 타이밍
1. 버튼 위에 마우스를 올려 놨을 때
2. 최초 페이지 로드가 되고, 모든 컴포넌트의 마운트가 끝났을 때

의 경우가 있다.

``` jsx
function lazyWithPreload(importFunction) {
  const Component = React.lazy(importFunction);
  Component.preload = importFunction;
  return Component;
}

const LazyImageModal = lazyWithPreload(() => import('./Modal'));

function ImageGallery() {
  const handleMouseEnter = () => {
    LazyImageModal.preload();
  }

  return <button onMouseEnter={handleMouseEnter}>...</button>
}

```

와 같이 마우스를 올렸을 때, `import`하면 된다.

하지만 파일의 크기가 큰 경우에는 마우스를 올렸을 때보다 먼저 로드할 필요가 있다. 그런 경우 `2번의 경우`를 사용하면 된다.

``` jsx

function ImageGallery() {
  useEffect(() => {
    LazyImageModal.preload();
  }, []);
}
```

와 같이 `useEffect`를 사용하여 최초 페이지 로드가 되고, 모든 컴포넌트의 마운트가 끝났을 때 `import`하면 된다. 이를 통해 최초 페이지 접속 시 번들 파일의 크기를 줄여 더 빠르게 성능을 높일 수 있다.

## 이미지 preload
컴포넌트를 lazy load했기에 컴포넌트 내에 있는 이미지들도 lazy load된다.
이미지가 늦게 로드되면 위 모달이 `preload`돼도 화면이 완성되지 않았기 때문에 사용자는 느리다고 느낄 수 있다. 이를 해결하기 위해 이미지를 `preload`하는 것이다.

``` jsx
function ImageGallery() {
  useEffect(() => {
    LazyImageModal.preload();
    const img = new Image();
    img.src = 'https://example.com/image.jpg';
  }, []);
}
```
와 같이 마운트가 끝났을 때, 이미지를 `preload`하면 된다.

하지만 모달에 있는 모든 이미지를 `preload`하는 것은 비효율적이다. 모달을 띄울 때, 모달에 바로 보여지는 이미지만 `preload`하는 것이 좋다. 이를 위해 `IntersectionObserver`를 활용한다.
