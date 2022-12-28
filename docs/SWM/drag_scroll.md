---
layout: default
title: 마우스, 터치 좌우 드래그 스크롤 만들기
parent: SW Maestro
has-children: false
nav_order: 19
permalink: /swm/drag_scroll/
---

# 마우스, 터치 좌우 드래그 스크롤 만들기
요즘 웹사이트에서는 가로 스크롤을 직접 움직이는 대신 어플리케이션처럼 마우스로 컨텐츠를 움직이는 좌우 드래그 스크롤 기능을 제공하는 사이트들이 많다. 따라서 이 기능을 구현해 보았다.

## 위치 속성
1. clientX, clientY
- 브라우저 페이지의 왼쪽 상단 모서리를 기준으로 하는 X좌표, Y좌표를 반환한다.
- 뷰포트의 왼쪽 가장자리를 클릭하면, 페이지가 수평으로 스크롤 되든 말든 항상 clientX가 0으로 나온다.
- 즉, 스크롤하기 전에는 보이지 않는 영역을 고려하지 않는다.
2. offsetX, offsetY
- 이벤트가 발생한 대상 요소가 기준이 된다.
- 해당 요소의 왼쪽 상단을 기준으로 한 X, Y좌표이다.
3. pageX, pageY
- 페이지의 왼쪽 상단 모서리를 기준으로 하는 X, Y좌표이다.
- 사용자가 브라우저 내에서 스크롤 막대를 움직여도 해당 X, Y좌표는 변하지 않는다.
- 뷰포트의 왼쪽 가장자리를 클릭하면, 페이지가 수평으로 스크롤된 만큼 clientX가 증가해서 나온다.
- 즉, 스크롤하기 전에는 보이지 않는 영역까지 모두 고려를 한 좌표이다.
4. screenX, screenY
- 실제 화면, 즉 모니터 왼쪽 상단을 기준으로 하는 X, Y좌표의 위치를 의미한다.
- 브라우저 화면이 아니라 모니터 전체 화면을 기준으로 한 위치 좌표이다.
- 모니터의 수나 모니터 해상도를 바꿀 때에만 변한다.

## 마우스 이벤트
1. click 
- 사용자가 해당 element를 클릭했을 때(버튼을 눌렀다가 떼었을 때) 발생합니다.
2. mousedown 
- 사용자가 해당 element에서 마우스 버튼을 눌렀을 때 발생합니다.
3. mouseup 
- 사용자가 해당 element에서 눌렀던 마우스 버튼을 떼었을 때 발생합니다.
4. dblclick 
- 사용자가 해당 element에서 마우스 버튼을 더블 클릭했을 때 발생합니다.
5. mousemove 
- 사용자가 해당 element에서 마우스를 움직였을 때 발생합니다.
6. mouseover 
- 사용자가 마우스를 해당 element 바깥에서 안으로 옮겼을 때 발생합니다.
7. mouseout 
- 사용자가 마우스를 해당 element 안에서 바깥으로 옮겼을 때 발생합니다.
8. mouseenter 
- 사용자가 마우스를 해당 element 바깥에서 안으로 옮겼을 때 발생합니다.
- **버블링이 발생하지 않습니다.**
9. mouseleave 
- 사용자가 마우스를 해당 element 안에서 바깥으로 옮겼을 때 발생합니다.
- **버블링이 발생하지 않습니다.**
10. contextmenu 
- 마우스 오른쪽 버튼을 눌렀을 때 발생합니다.

이 기능에서 사용할 마우스 이벤트는 `mousedown, mouseup, mousemove, mouseleave`입니다.

## 터치 이벤트
1. touchstart
- 스크린에 손가락이 닿을 때 발생합니다.
2. touchmove
- 스크린에 손가락이 닿은 채로 움직일 때 발생합니다.
3. touchend
- 스크린에서 손가락을 뗄 때 발생합니다.
4. touchcancel
- 시스템에서 이벤트를 취소할 때 발생합니다. 정확한 발생 조건은 브라우저마다 다릅니다. 터치를 취소한다는 것에 대한 표준이 정의되지 않아 각 브라우저마다 다르게 발생하여 touchend이벤트로 간주해도 무방합니다.

## 활용할 속성
- 스크롤을 포함한 브라우저 화면을 기준으로 하는 `pageX`
- 실제 이벤트가 발생한 대상의 요소의 X좌표인 `offsetX`
- `mousedown, mouseup, mousemove, mouseleave`
- `touchstart, touchmove, touchend, touchcancel`

# 문제 해결
![IMG_5D2199D660F9-1](https://user-images.githubusercontent.com/62797441/180196710-8f1852c5-a9f8-40d8-847d-e8394cb65ec5.jpeg)

여기서 중요한 것은 walk이다. 사용자가 마우스 혹은 터치 이벤트를 통해 실제로 움직인 거리가 된다. 위 그림처럼 사용자가 현재 이미지 왼쪽에 있는 이미지를 보기 위해 마우스를 왼쪽에서 오른쪽으로 끌어당기는 상황이다. 이 상황에서 start, current는 다음과 같고 walk는 current에서 start를 뺀 값이다.

여기서 스크롤바의 위치를 옮기기 위해 마우스를 클릭했던 지점의 스크롤 위치 `startScrollLeft`에서 `walk`를 빼주면 해결된다.

반대의 상황도 마찬가지이며 이를 코드로 구현하면 아래와 같다.

# 전체 코드
``` ts
import { RefObject, useEffect } from 'react';

export default function useDragScroll(dragRef: RefObject<HTMLElement>) {
  let isDown = false; // 사용자가 마우스를 눌렀는지 판단할 변수 선언
  let startX: number; // 사용자가 마우스를 누른 시작 지점 변수 선언
  let startScrollLeft: number; // 사용자가 마우스를 눌렀을 때 scrollLeft의 위치 변수 선언

  const mouseTouchDown = (e: MouseEvent | TouchEvent) => { // 마우스를 눌렀을 때 이벤트 함수
    const ref = dragRef.current; // dragRef.current가 아래에서 반복적으로 사용되기에 선언
    if (ref) {
      isDown = true; // 마우스가 눌림
      if (e.type === 'mousedown' && 'pageX' in e) { // 이벤트 타입이 mousedown이고 e객체에 pageX 속성이 있을 때, 즉, 마우스이벤트를 실행했을 때
        startX = e.pageX - ref.offsetLeft; // 마우스를 누른 시작 지점에 pageX - offsetLeft 할당
      } else if (e.type === 'touchstart' && 'touches' in e) { // 이벤트 타입이 touchstart이고 e객체에 touches 속성이 있을 때, 즉, 터치이벤트를 실행했을 때
        startX = e.touches[0].pageX - ref.offsetLeft; // 마우스를 누른 시작 지점에 pageX - offsetLeft 할당
      }
      startScrollLeft = ref.scrollLeft; // 마우스를 눌렀을 때 scrollLeft의 위치는 ref의 scorllLeft로 할당
    }
  };
  const mouseTouchLeave = (e: MouseEvent | TouchEvent) => { // 마우스가 해당 target을 벗어났을 때 실행하는 이벤트 함수
    isDown = false; // 마우스를 뗐다고 판단
  };
  const mouseTouchUp = (e: MouseEvent | TouchEvent) => { // 마우스를 뗐을 때 실행하는 이벤트 함수
    isDown = false; // 마우스를 뗐다고 판단
  };
  const mouseTouchMove = (e: MouseEvent | TouchEvent) => { // 마우스를 target 내에서 움직일 때 실행하는 이벤트 함수
    const ref = dragRef.current; // dragRef.current가 아래에서 반복적으로 사용되기에 선언

    if (!isDown) return; // 마우스가 눌린 상태라면 리턴
    if (e.cancelable) e.preventDefault(); // 이벤트 취소가 가능할 때, 마우스를 움직이면서 지나가는 경로에 있는 다른 이벤트를 발생하는 현상을 방지

    if (ref) {
      if (e.type === 'mousemove' && 'pageX' in e) {
        const currentX = e.pageX - ref.offsetLeft; // 현재 위치는 pageX에서 offsetLeft를 뺀 값
        const walk = currentX - startX; // 변위 즉, 움직인 거리는 현재 위치에서 시작 위치를 뺀 값
        ref.scrollLeft = startScrollLeft - walk; // ref의 scrollLeft 위치에 마우스를 누를 때 scrollLeft 값에서 움직인 거리만큼 뺀다.
      } else if (e.type === 'touchmove' && 'touches' in e) {
        const currentX = e.touches[0].pageX - ref.offsetLeft;
        const walk = currentX - startX;
        ref.scrollLeft = startScrollLeft - walk;
      }
    }
  };

  useEffect(() => {
    const ref = dragRef.current; // dragRef.current가 아래에서 반복적으로 사용되기에 선언
    if (ref) { // 마운트 시에 이벤트를 등록
      ref.addEventListener('mousedown', mouseTouchDown);
      ref.addEventListener('mouseleave', mouseTouchLeave);
      ref.addEventListener('mouseup', mouseTouchUp);
      ref.addEventListener('mousemove', mouseTouchMove);
      ref.addEventListener('touchstart', mouseTouchDown);
      ref.addEventListener('touchcancel', mouseTouchLeave);
      ref.addEventListener('touchend', mouseTouchUp);
      ref.addEventListener('touchmove', mouseTouchMove);
    }

    return () => {
      if (ref) { // 언마운트 시에 이벤트 삭제
        ref.removeEventListener('mousedown', mouseTouchDown);
        ref.removeEventListener('mouseleave', mouseTouchLeave);
        ref.removeEventListener('mouseup', mouseTouchUp);
        ref.removeEventListener('mousemove', mouseTouchMove);
        ref.removeEventListener('touchstart', mouseTouchDown);
        ref.removeEventListener('touchcancel', mouseTouchLeave);
        ref.removeEventListener('touchend', mouseTouchUp);
        ref.removeEventListener('touchmove', mouseTouchMove);
      }
    };
  }, [dragRef]);
}
```

# addEventListener로 구현한 이유
상태를 이용하여 이 로직을 구현하게 되면 불필요한 렌더링이 정말 수도 없이 일어나게 된다. 이 렌더링을 최적화하기 위해 `debounce, throttle`을 사용하게 되면 UX에 악영향을 미치게 된다. 따라서 ref를 이용한 DOM 조작을 통해 불필요한 렌더링이 발생하지 않도록 했다.
