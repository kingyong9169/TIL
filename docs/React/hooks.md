---
layout: default
title: React hooks 종류
parent: React
has-children: false
nav_order: 4
permalink: /react/hooks/
---

# React hooks 종류
훅을 사용할 때는 다음 규칙을 지켜야 합니다.
- 하나의 컴포넌트에서 훅을 호출하는 순서는 항상 같아야 합니다.
- 훅은 함수형 컴포넌트 또는 커스텀 훅 안에서만 호출되어야 합니다.(클래스형 컴포넌트, 일반 함수에서 사용 X)

이 규칙을 지켜야 리액트가 각 훅의 상태를 기억할 수 있습니다.
## useState

``` js 
const [state, setState] = useState(initialState);
```
- 상태 유지 값과 그 값을 갱신하는 함수를 반환합니다.
- 최초로 렌더링을 하는 동안, 반환된 `state`는 첫 번째 전달된 인자(`initialState`)의 값과 같습니다.
- `setState`함수는 `state`를 갱신할 때 사용합니다. 새 state값을 받아 컴포넌트 리렌더링을 큐에 등록합니다.(비동기 동작)
- 다음 리렌더링 시에 `useState`를 통해 반환받은 첫 번째 값은 항상 갱신된 최신 state가 됩니다.

⚠️ 주의사항
React는 `setState` 함수 동일성이 안정적이고 리렌더링 시에도 변경되지 않을 것이라는 것을 보장합니다. 이것이 `useEffect`나 `useCallback` 의존성 목록에 이 함수를 포함하지 않아도 무방한 이유입니다.

### 함수적 갱신
업데이트하고 싶은 값을 직접 명시할 수도 있지만 아래와 같이 함수의 형태로 명시할 수 있습니다.
이전 `state`를 사용해서 새로운 `state`를 계산하는 경우 함수를 `setState` 로 전달할 수 있습니다. 그 함수는 이전 값을 받아 갱신된 값을 반환할 것입니다. 여기에 `setState`의 양쪽 형태를 사용한 카운터 컴포넌트의 예가 있습니다.

``` js 
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```
만약 업데이트 함수(`setState`)가 현재 상태와 정확히 동일한 값을 반환한다면 바로 뒤에 일어날 리렌더링은 완전히 건너뛰게 됩니다.

### 지연 초기 state
`initialState` 인자는 초기 렌더링 시에 사용하는 state입니다. 그 이후의 렌더링 시에는 이 값은 무시됩니다. 초기 state가 고비용 계산의 결과라면, 초기 렌더링 시에만 실행될 함수를 대신 제공할 수 있습니다.

``` js
const [state, setState] = useState(() => {
  const initialState = 어떤함수(props);
  return initialState;
});
```

### state 갱신의 취소
State Hook을 현재의 state와 `동일한 값`으로 갱신하는 경우 React는 자식을 렌더링 한다거나 무엇을 실행하는 것을 회피하고 그 처리를 종료합니다. (React는 [Object.is](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) 비교 알고리즘(==, ===와는 다름)을 사용합니다.)

실행을 회피하기 전에 React에서 특정 컴포넌트를 다시 렌더링하는 것이 여전히 필요할 수도 있다는 것에 주의해야 합니다. React가 불필요하게 트리에 그 이상으로 「더 깊게」는 관여하지 않을 것이므로 크게 신경 쓰지 않아도 되지만, 렌더링 시에 고비용의 계산을 하고 있다면 `useMemo`를 사용하여 그것들을 최적화할 수 있습니다.

## 커스텀 훅 만들기
리액트가 제공하는 훅을 이용해서 커스텀 훅을 만들 수 있습니다. 또한, 커스텀 훅을 이용해서 또 다른 커스텀 훅을 만들 수도 있습니다. 훅을 직접 만들어서 사용하면 쉽게 로직을 재사용할 수 있습니다.

리액트의 내장 훅처럼 커스텀 훅의 이름은 use로 시작하는 게 좋습니다. 왜냐하면 가독성도 좋아지고 여러 리액트 개발 도구의 도움도 쉽게 받을 수 있기 때문입니다.

커스텀 훅 사용 전
``` js
function Profile({ userId }){
    const [user, setUser] = useState(null);
    useEffect(()=>{
        getUserApi(userId).then(data => setUser(data));
    }, [userId]);
    ...
}
```

커스텀 훅 사용 후
``` js
function useUser(userId){
    const [user, setUser] = useState(null);
    useEffect(()=>{
        getUserApi(userId).then(data => setUser(data));
    }, [userId]); // 여기서 의존성 배열을 비우면 어떻게 될까?
    return user;
}

function Profile({ userId }){
    const user = useUser(userId);
    ...
}
```
**만약 useUser의 의존성 배열을 비우면 어떻게 될까요?**
인자로 전달된 userId가 바뀌어도 useEffect의 effect를 실행하지 않습니다. 왜냐하면 의존성 배열이 비어 있으면 컴포넌트 렌더링 이후 최초 한 번만 effect를 실행하기 때문입니다.

## context API
보통 상위 컴포넌트에서 하위 컴포넌트로 데이터를 전달할 때 속성값이 사용되는데, 가까운 거리에 있는 몇 개의 하위 컴포넌트로 전달할 때는 속성값으로도 충분합니다.
하지만 많은 수의 하위 컴포넌트로 전달할 때는 속성값을 내려주는 코드를 반복적으로 작성해야 하는 문제가 있습니다. 즉, 상위 컴포넌트와 하위 컴포넌트가 상당히 멀리 떨어져 있다면 문제가 발생합니다. 이때 콘텍스트 API를 사용하면 중첩 구조가 복잡한 상황에서도 비교적 쉽게 데이터를 전달할 수 있습니다.

``` js
const UserContext = React.createContext({ userName: "" });
const SetUserContext = React.createContext(() => {});

function App(){
    const [user, setUser] = useState({ userName: "mike" });
    return (
        <div>
            <SetUserContext.Provider value = {setUser}>
                <UserContext.Provider value = {user}>
                    <div>상단 메뉴</div>
                    <Profile />
                    <div>하단 메뉴</div>
                </UserContext.Provider>
            <SetUserContext.Provider>
        </div>
    );
}
```

``` js
const Profile = React.memo(() => {
    return (
        <div>
            <Greeting />
            ...
        </div>
    );
});

function Greeting(){
     // Consumer 컴포넌트 바깥 영역
    return (
        <SetUserContext.Consumer>
            {setUser => (
                <UserContext.Consumer>
                    {userName => 
                        <button onClick = {() => 
                            setUser({ userName: "tom" })}
                        >
                            mike
                        </button>
                    }
                </UserContext.Consumer>
            )}
        </SetUserContext.Consumer>
    );
}
```

위처럼 먼저 createContext 함수를 호출하면 콘텍스트 객체가 생성됩니다. createContext구조는 다음과 같습니다.

`React.createContext(defaultValue) => {Provider, Consumer}`

상위 컴포넌트에서는 `Provider`를 이용하여 데이터를 전달하고 하위 컴포넌트에서는 `Consumer`를 이용해서 데이터를 사용합니다.

`Provider`컴포넌트의 속성값이 변경되면 하위의 모든 `Consumer`컴포넌트는 다시 렌더링됩니다. 한가지 중요한 점은 중간에 위치한 컴포넌트의 렌더링 여부와 상관없이 `Consumer`컴포넌트는 리렌더링되는 것입니다.

위와 같이 provider, Consumer와는 상관없는 중간 컴포넌트의 경우에는 리렌더링될 필요가 없습니다. 따라서 `React.memo`를 사용하여 중간 컴포넌트가 리렌더링되지 않도록 합니다.

또한, 데이터와 상탯값 변경 함수를 useState를 통해 상태로 만들고 콘텍스트로 전달합니다.

만약 Provider 컴포넌트를 찾지 못할 때, 콘텍스트 데이터의 기본값인 `unknown`이 사용됩니다.

## useContext
위 방식은 Consumer 컴포넌트 안쪽에서만 콘텍스트 데이터에 접근할 수 있다는 한계가 있습니다. 하지만 `useContext`를 사용하면 Consumer 컴포넌트 바깥 영역에서도 콘텍스트 데이터에 접근할 수 있습니다.

``` js
function Greeting(){
    const setUser = useContext(SetContext);

    return (
        <button onClick = {() => setUser({ userName: "tom" })}>
            mike
        </button>
    );
}
```
이와 같이 Consumer를 사용하지 않고 편리하게 사용할 수 있으며 Consumer 컴포넌트 바깥 영역에서도 콘텍스트 데이터에 접근할 수 있습니다.

## useReducer

## useRef

## useMemo

## useCallback

## useImperativeHandle

## useLayoutEffect

## useDebugValue