---
layout: default
title: Router props
parent: React
has-children: false
nav_order: 1
permalink: /react/router_props/
---

# React Router
[참고 자료](https://velog.io/@devstone/react-router-dom-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B3%A0-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0)

## Props
``` js
//App.js
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Info, Login, Main, Nav } from "./pages";

function App() {
  const [userInfo, setUserInfo] = React.useState("devstone");
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route exact path="/" component={Main} />
        <Route exact path="/login" component={Login} />
        //전달할 props가 있는 경우 아래와 같이
        <Route exact path="/info" render={() => <Info userInfo={userInfo} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

위와 같이 `<BrowserRouter>`로 감싸져 있고, `Route`를 통해 경로로 접근할 수 있는 컴포넌트에는 기본적으로 전달되는 propsrk 있습니다.
바로 history, match, location이며 이 객체들를 통해 컴포넌트 내에 구현하는 메서드에서 라우터 API를 호출할 수 있습니다.

### history
history 객체는 브라우저의 history와 유사합니다.
스택(stack)에 현재까지 이동한 url 경로들이 담겨있는 형태로 주소를 임의로 변경하거나 되돌아갈 수 있도록 해줍니다.
history객체는 mutable하므로 history.location보다는 history를 생략하여 location을 직접 사용해 주기를 권장합니다.

- action : `string` 최근에 수행된 action (PUSH, REPLACE or POP)
- block(prompt) : `function` history 스택의 PUSH/POP 동작을 제어(이탈 방지)
- go(n) : `function` : history 스택의 포인터를 n번째로 이동
- goBack() : `function` 이전 페이지로 이동
- goForward() : `function` 앞 페이지로 이동
- length : `number` 전체 history 스택의 길이
- location : `JSON object` 최근 경로 정보
- push(path, state) : `function` 새로운 경로를 history 스택으로 푸시하여 페이지를 이동
- replace(path, state) : `function` 최근 경로를 history 스택에서 교체하여 페이지를 이동

``` js
import React, { useEffect } from 'react';

function HistorySample({ history }) {
  const goBack = () => {
    //이전 페이지로 이동 
    history.goBack();
  };

  const goHome = () => {
    //해당 주소로 이동
    history.push('/');
  };

  useEffect(() => {
    //history값 변해서 다른 주소로 이동하면 alert창으로 이탈 막을 수 있음 
    const unblock = history.block('정말 떠나실건가요?');
    return () => {
      unblock();
    };
  }, [history]);

  return (
    <div>
      <button onClick={goBack}>뒤로가기</button>
      <button onClick={goHome}>홈으로</button>
    </div>
  );
}

export default HistorySample;
```

### match
match 객체에는 `Route path`와 `URL`이 매칭된 것에 대한 정보가 담겨져 있습니다.
대표적으로 `match.params`로 `path`에 설정한 파라미터값(`/main:name`)을 가져올 수 있다.

- isExact : `boolean` true일 경우 전체 경로가 완전히 매칭될 경우에만 요청을 수행
- params : `JSON object` url path로 전달된 파라미터 객체
- path : `string` 라우터에 정의된 path
- url : `string` 실제 클라이언트로부터 요청된 url path

### location
location 객체에는 현재 페이지의 정보를 가지고 있습니다.
대표적으로 location.search로 현재 url의 쿼리 스트링을 가져올 수 있습니다.
또한, `pathname`을 통해 현재 페이지의 경로 이름을 가져올 수 있습니다.

- pathname : `string` 현재 페이지의 경로명
- search : `string` 현재 페이지의 query string
`React.useMemo(() => new URLSearchParams(search), [ search ]);`
- hash : `string` 현재 페이지의 hash

url 쿼리를 사용하기 위해선 부가적인 라이브러리 `query-string`가 필요합니다.

``` js
import React from "react";
import queryString from "query-string";

function Login({ match, location }) {
  const params = match.params.id ? match.params.id : "익명";
  console.log("match", match);
  console.log("location", location);
  const query = queryString.parse(location.search);
  console.log(query);
  return (
    <>
      <div>{params} login page</div>
    </>
  );
}

export default Login;
```

## <Route>로 감싸지지 않은 컴포넌트에서 history, location, match 사용하기
종종 <Route>로 url 맵핑이 되지 않은 컴포넌트에서 `{ history, location, match }` 를 사용해야 할 때가 있습니다. 이럴 경우, 두 가지 방법을 이용해 세 객체를 사용할 수 있습니다.

### HOC이용
`withRouter`을 이용하는 방법입니다.
`<Route>`로 url 맵핑이 되지 않은 컴포넌트에 HOC방식으로 export를 해주면 props로 사용할 수 있습니다.
``` js
import { withRouter } from 'react-router-dom';

function withRouterSample ({history, location, match})
  console.log(history, location, match);
  return (
    <>
      <div> withRouter 이용예제</div>
    </>
  );
}

export default withRouter(withRouterSample);
```

### hooks 이용

1. useHistory
2. useLocation
3. useRouteMatch
현재 url의 match객체를 사용할 수 있습니다.
``` js
import { useRouteMatch } from "react-router-dom";

function useRouteMatch() {
  //match 객체 사용 가능
  const match1 = useRouteMatch("/login/:id");

  //다양한 속성에 접근 가능
  const match2 = useRouteMatch({
    path: "/BLOG/:slug/",
    strict: true,
    sensitive: true
  });

  return (
    <div> useRouteMatch 이용예제</div>
  );
}
```
4. useParams
<Route> 컴포넌트의 match.params값에 접근할 수 있습니다.