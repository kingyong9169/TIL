---
layout: default
title: history API
parent: React
has-children: false
nav_order: 2
permalink: /react/history/
---

# history API

## Window 객체
- 브라우저의 요소들과 자바스크립트 엔진, 모든 변수를 담고 있는 객체입니다.
- 브라우저 전체를 담당하는 것이 `Window`객체이며 웹사이트만 담당하는 것이 `Document`객체입니다. Document도 Window객체 안에 들어있습니다.
- 모든 객체의 조상으로 전역객체라고도 합니다. 모든 객체를 다 포함하고 있기 때문에 window는 그냥 **생략가능**합니다.

## 들어가기
SPA 구현이 가능하려면 다음 두 가지 기능이 필요합니다.
- js에서 브라우저로 페이지 전환 요청을 보낼 수 있다. **단, 브라우저는 서버로 요청을 보내지 않아야 합니다.**
- 브라우저의 뒤로 가기와 같은 사용자의 페이지 전환 요청을 js에서 처리할 수 있다. **이때도 브라우저는 서버로 요청을 보내지 않아야 합니다.**

## 인터페이스
이러한 조건을 만족하는 브라우저 API는 `pushState, replaceState함수, popState이벤트`입니다. 브라우저에는 히스토리에 state를 저장하는 스택이 존재합니다.

``` js
import React, { useEffect } from "react";

export default function App(){
    useEffect(()=>{
        window.onpopstate = function(event){
            console.log(`location: ${document.location}, state: ${event.state}`);
        };
    }, []);
    return (
        <div>
            <button onClick={() => window.history.pushState("v1", "", "/page1")}>
                page1
            </button>
            <button onClick={() => window.history.pushState("v2", "", "/page2")}>
                page2
            </button>
        </div>
    );
}
```

이 코드에서 page1, page2 버튼을 눌러보면 브라우저 주소창의 url이 바뀌는 것을 확인할 수 있습니다.
이때 서버로 요청도 가지 않고 화면 또한 변하지 않습니다.(App 컴포넌트만 있다는 가정하에) 단지 스택에 state가 쌓일 뿐입니다.

또한, onpopstate함수도 호출되지 않습니다. 스택에 push만 했기 때문입니다.

이때, 뒤로가기 버튼을 누르게 되면 onpopstate함수가 호출되는 것을 확인할 수 있습니다. 계속해서 뒤로 가기를 누르면 스택이 비워질 때까지 onpopstate 함수가 호출되다가 최초에 접속했던 구글 홈페이지로 돌아갑니다.

- pushState: 다른 페이지로 이동
- popState: 뒤로가기
- replaceState: pushState와 거의 유사하지만 스택에 state를 쌓지 않고 가장 최신의 state를 대체합니다.
  즉, `/home`에서 이벤트로 페이지를 `/login`으로 이동하는 것이 아니라 브라우저 url에 직접 `/login`을 입력하여 이동하는 것을 의미합니다.

다음과 같은 코드로 브라우저 히스토리 API로 SPA를 구현할 수 있습니다.

``` js
import React, { useState, useEffect } from "react";

export default function App(){
    const [pageName, setPageName] = useState("");
    useEffect(()=>{
        window.onpopstate = function(event){
            setPageName(event.state);
        };
    }, []);
    function onClick1(){
        const pageName = 'page1';
        window.history.pushState(pageName, "", "/page1");
        setPageName(pageName);
    }
    function onClick2(){
        const pageName = 'page2';
        window.history.pushState(pageName, "", "/page2");
        setPageName(pageName);
    }
    return (
        <div>
            <button onClick={onClick1}>page1</button>
            <button onClick={onClick2}>page2</button>
            {!pageName && <Home />}
            {pageName === "page1" && <Page1 />}
            {pageName === "page2" && <Page2 />}
        </div>
    );
}
```

## 앞으로 가기, 뒤로 가기
- `history.back()`: 뒤로 가기
- `history.forward()`: 앞으로 가기

## 속성
- `history.length`(읽기 전용): 현재 페이지를 포함해, 세션 기록의 길이를 나타내는 정수를 반환합니다.
- `history.scrollRestoration`: 기록 탐색 시 스크롤 위치 복원 여부를 명시할 수 있습니다. 가능한 값은 `auto`와 `manual`입니다.
- `history.state`(읽기 전용): 기록 스택 최상단의 상태를 나타내는 값을 반환합니다. `popstate` 이벤트를 기다리지 않고 현재 기록의 상태를 볼 수 있는 방법입니다.

## 기록의 특정 지점으로 이동
세션 기록에서 현재 페이지의 위치를 기준으로, 상대적인 거리에 위치한 특정 지점까지 이동할 수 있습니다.

- `history.go(-1)`: 한 페이지 뒤로 이동(back()과 동일)
- `history.go(1)`: 한 페이지 앞으로 이동(forward()와 동일)
- 매개변수로 지정한 숫자를 바꾸면 2 페이지씩 이동하는 것도 가능합니다.

## 종합 예제
``` js
window.onpopstate = function(event) {
  alert(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
}

history.pushState({page: 1}, "title 1", "?page=1")
history.pushState({page: 2}, "title 2", "?page=2")
history.replaceState({page: 3}, "title 3", "?page=3")
history.back() // alerts "location: http://example.com/example.html?page=1, state: {"page":1}"
history.back() // alerts "location: http://example.com/example.html, state: null"
history.go(2)  // alerts "location: http://example.com/example.html?page=3, state: {"page":3}"
```