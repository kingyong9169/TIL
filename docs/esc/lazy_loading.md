---
layout: page
title: lazy loading
parent: ESC 프로젝트 기록
nav_order: 1
has_children: false
permalink: /esc/lazy_loading
---

# lazy loading
기본적으로 이미지를 지연 로딩하기 위해서는 스크롤을 이용하여 이미지가 있는 곳까지 스크롤이 왔는지 판단하여 처리한다.<br>
but 단점이 있는데 스크롤할 때마다 함수를 호출한다. 오히려 성능 저하가 생길 수 있다. 하지만 이를 `Intersection Observer`로 해결할 수 있다.

참고로 `Intersection Observer`에 등록한 `callback`은 지정한 엘리먼트가 화면에서 보이는 순간, 나가는 순간, 생성된 순간 이렇게 총 3번 호출된다. 따라서 사용하고 `unobserve`할 필요성이 있다.

``` js
useEffect(() => {
  const option = {};
  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log('is intersecting');
        entry.target.src = entry.target.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  };
  const observer = new IntersectionObserver(callback, option);
  observer.observe(imgRef.current);
}, []);
```
이와 같이 훅을 이용하여 observer가 intersecting할 때마다 즉, 해당 이미지가 화면에 보이는 그 시점에 콜백 함수를 실행하여 지연 로딩을 구현한다.

``` js
<img data-src={props.image} ref={imgRef} />
```
이미지 지연 로딩시에는 `src`를 사용하지 않고 `data-src`속성을 사용한다. 이렇게 하면 어떠한 이미지 리소스도 로드하지 않으며 가만히 공간만 차지한 채 떠있는 상태가 된다.

``` js
entry.target.src = entry.target.dataset.src;
```
그리고 이 코드를 통해 `src`속성에 값을 넣어줌으로써 그때 이미지 소스를 로드한다.

``` js
observer.unobserve(entry.target);
```
한 번 `observe`한 이미지는 다시 `observe`할 필요가 없기 때문에 `unobserve`를 해준다.
