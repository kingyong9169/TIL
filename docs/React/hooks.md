---
layout: default
title: React hooks 총정리
parent: React
has-children: false
nav_order: 4
permalink: /react/hooks/
---
# React hooks 총정리

## Hook 사용 규칙
훅을 사용할 때는 다음 규칙을 지켜야 합니다. [공식 문서](https://ko.reactjs.org/docs/hooks-rules.html#explanation)
### 최상위에서만 Hook을 호출해야 합니다.
반복문, 조건문 혹은 중첩된 함수 내에서 Hook을 호출하면 안됩니다.❌
**만약 조건부로 effect를 실행하고 싶다면, Hook 내부에 넣으면 됩니다.**

컴포넌트가 렌더링 될 때마다 항상 동일한 순서로 Hook이 호출되는 것이 보장됩니다. React는 훅이 여러 번 호출되는 중에도 훅의 상태를 올바르게 유지할 수 있도록 해줍니다.
예를 들어, 어떻게 특정 state가 어떤 useState호출에 해당하는지 알 수 있을까요?

**React가 Hook이 호출되는 순서에 의존하기 때문입니다. 모든 렌더링에서 hook의 호출 순서는 같기 때문에 올바르게 동작할 수 있습니다.**

### 함수형 컴포넌트 또는 커스텀 훅 안에서만 호출되어야 합니다.(클래스형 컴포넌트, 일반 함수에서 사용 X)

이 규칙을 지켜야 리액트가 각 훅의 상태를 기억할 수 있습니다.

## useState

``` js 
const [state, setState] = useState(initialState);
```
- 상태 유지 값과 그 값을 갱신하는 함수를 반환합니다.
- 최초로 렌더링을 하는 동안, 반환된 `state`는 첫 번째 전달된 인자(`initialState`)의 값과 같습니다.
- `setState`함수는 `state`를 갱신할 때 사용합니다. 새 state값을 받아 컴포넌트 리렌더링을 큐에 등록합니다.(비동기 동작)
- 다음 리렌더링 시에 `useState`를 통해 반환받은 첫 번째 값은 항상 갱신된 최신 state가 됩니다.

### ⚠️ 주의사항
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

실행을 회피하기 전에 React에서 특정 컴포넌트를 다시 렌더링하는 것이 여전히 필요할 수도 있다는 것에 주의해야 합니다. React가 불필요하게 트리에 그 이상으로 「더 깊게」는 관여하지 않을 것이므로 크게 신경 쓰지 않아도 되지만, 렌더링 시에 고비용의 계산을 하고 있다면 [useMemo](#usememo)를 사용하여 그것들을 최적화할 수 있습니다.

## useEffect는 따로 정리

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
`useState`의 대체 함수입니다. `(state, action) => newState`의 형태로 reducer를 받고 `dispatch` 메서드와 짝의 형태로 현재 state를 반환합니다.

다수의 하윗값을 포함하는 복잡한 정적 로직을 만드는 경우나 다음 state가 `이전 state에 의존적인 경우`에 보통 `useState`보다 `useReducer`를 선호합니다.
`useReducer`는 자세한 업데이트를 트리거 하는 컴포넌트의 성능을 최적화할 수 있게 하는데, 이것은 `콜백 대신` `dispatch`를 전달 할 수 있기 때문입니다.

``` js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

### ⚠️ 주의사항
 `useState`와 마찬가지로 `dispatch` 함수의 동일성이 안정적이고 리렌더링 시에도 변경되지 않으리라는 것을 보장합니다. 이것이 `useEffect`나 `useCallback` 의존성 목록에 이 함수를 포함하지 않아도 괜찮은 이유입니다.

### 초기화 지연
초기 state를 조금 지연해서 생성할 수도 있습니다. 이를 위해서는 `init` 함수를 세 번째 인자로 전달합니다. 초기 state는 `init(initialArg)`에 설정될 것입니다.

`reducer` 외부에서 `초기 state`를 계산하는 로직을 추출할 수 있도록 합니다. 또한, 어떤 행동에 대한 대응으로 `나중에 state를 재설정`하는 데에도 유용합니다.

``` js
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

### dispatch의 갱신의 취소
`Reducer Hook`에서 현재 state와 `같은 값을 반환`하는 경우 React는 자식을 리렌더링하거나 effect를 발생하지 않고 이것들을 `회피`할 것입니다. (React는 [Object.is](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) 비교 알고리즘을 사용합니다.)

렌더링 시에 `고비용의 계산`을 하고 있다면 [useMemo](#usememo)를 사용하여 그것들을 최적화할 수 있습니다.

## useCallback
``` js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```
**메모이제이션(컴퓨터 프로그램이 동일한 계산을 반복해야 할 때, 이전에 계산한 값을 메모리에 저장함으로써 동일한 계산의 반복 수행을 제거하여 프로그램 실행 속도를 빠르게 하는 기술입니다.)**된 `콜백`을 반환합니다.

`useCallback`은 콜백의 `메모이제이션`된 버전을 반환할 것입니다. 그 메모이제이션된 버전은 콜백의 `의존성이 변경되었을 때에만 변경`됩니다. 이것은, `불필요한 렌더링을 방지`하기 위해 (예로 `shouldComponentUpdate`를 사용하여) 참조의 동일성에 의존적인 최적화된 자식 컴포넌트에 콜백을 전달할 때 유용합니다.

`useCallback(fn, deps)`은 `useMemo(() => fn, deps)`와 같습니다. 왜냐하면 `useCallback`은 콜백의 메모이제이션된 버전을 반환하는 것이고 `useMemo`는 콜백을 실행함으로써 반환된 결과의 메모이제이션된 버전을 반환하는 것이므로 같습니다.

## useMemo
``` js
const memoizedValue = useMemo(() => 고비용계산(a, b), [a, b]);
```
메모이제이션된 `값`을 반환합니다.

위의 예시는 `고비용계산`을 통해 반환된 값을 `useMemo`를 통해 최적화하는 것입니다. `useCallback`과 형태가 비슷하지만 "불필요한 렌더링을 방지", "고비용 계산 방지"에 차이점이 있습니다.

마찬가지로 의존성이 변경되었을 때에만 메모이제이션된 값만 다시 계산합니다. 모든 렌더링 시의 고비용 계산을 방지하게 해 줍니다.

`useMemo`로 전달된 함수는 `렌더링 중에 실행`된다는 것을 기억해야 합니다. 통상적으로 렌더링 중에는 하지 않는 것을 이 함수 내에서 하지 않아야 합니다. 예를 들어, 사이드 이펙트(side effects)는 `useEffect`에서 하는 일이지 `useMemo`에서 하는 일이 아닙니다.

의존성 배열이 없는 경우 매 렌더링 때마다 새 값을 계산하게 될 것입니다.

**`useMemo`는 성능 최적화를 위해 사용할 수는 있지만 의미상으로 보장이 있다고 생각하지는 않아야 합니다.** 공식 문서에 의하면 가까운 미래에 React에서는, 이전 메모이제이션된 값들의 일부를 “잊어버리고” 다음 렌더링 시에 그것들을 재계산하는 방향을 택할지도 모릅니다. 예를 들면, 오프스크린 컴포넌트의 메모리를 해제하는 등이 있을 수 있습니다. `useMemo`를 사용하지 않고도 동작할 수 있도록 코드를 작성하고 `useMemo`를 추가하여 성능을 최적화하면 됩니다.

## useRef
``` js
const refContainer = useRef(initialValue);
```
`useRef`는 `.current` 프로퍼티로 전달된 인자(`initialValue`)로 초기화된 변경 가능한 `ref 객체`를 반환합니다. 간단히 말하면 `ref객체`를 `.current` 프로퍼티를 통해 변경할 수 있다는 뜻입니다. 반환된 객체는 **컴포넌트의 전 생애주기를 통해 유지**될 것입니다.

``` js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```
본질적으로 `useRef`는 `.current` 프로퍼티에 변경 가능한 값을 담고 있는 “상자”와 같습니다.
`<div ref={myRef} />`를 사용하여 React로 `ref 객체`를 전달한다면, React는 모드가 변경될 때마다 변경된 DOM 노드에 그것의 `.current` 프로퍼티를 설정할 것입니다.

따라서 ref 속성보다 `useRef()`가 더 유용합니다. 이 기능은 클래스에서 인스턴스 필드를 사용하는 방법과 유사한 어떤 가변값을 유지하는 데에 편리합니다.

이것은 `useRef()`가 순수 자바스크립트 객체를 생성하기 때문입니다. `useRef()`와 `{current: ...}` 객체 자체를 생성하는 것의 유일한 차이점이라면 `useRef`는 매번 렌더링을 할 때 동일한 `ref 객체를 제공`한다는 것입니다.

`useRef`는 내용이 변경될 때 그것을 알려주지는 않는다는 것을 유념해야 합니다. `.current` 프로퍼티를 변형하는 것이 리렌더링을 발생시키지는 않습니다.

## useImperativeHandle
``` js
useImperativeHandle(ref, createHandle, [deps])
```
`useImperativeHandle`은 ref를 사용할 때 부모 컴포넌트에 노출되는 인스턴스 값을 사용자화(customizes)합니다. 항상 그렇듯이, 대부분의 경우 ref를 사용한 명령형 코드는 피해야 합니다. `useImperativeHandle`는 `forwardRef`와 더불어 사용하면 됩니다.

``` js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```
위의 예시에서 `<FancyInput ref={inputRef} />`를 렌더링한 부모 컴포넌트는 `inputRef.current.focus()`를 호출할 수 있습니다.

## useLayoutEffect
시그니처는 useEffect와 동일하긴 한데, 모든 DOM 변경 후에 동기적으로 발생합니다. DOM에서 레이아웃을 읽고 동기적으로 리렌더링하는 경우에 사용하면 됩니다. `useLayoutEffect`의 내부에 예정된 갱신은 브라우저가 화면을 그리기 이전 시점에 동기적으로 수행될 것입니다. `useEffect`는 화면 렌더링 이후 수행됩니다.

화면 갱신 차단의 방지가 가능하다면 `useEffect`를 먼저 사용하면 됩니다.

### ⚠️ 주의사항
서버 렌더링을 사용하는 경우라면 자바스크립트가 모두 다운로드될 때까지는 `useLayoutEffect`와 `useEffect` 어느 것도 실행되지 않는다는 것을 명심해야 합니다. 서버에서 렌더링 되는 컴포넌트에서 `useLayoutEffect`가 사용되는 경우에 대해 React가 경고하는 이유입니다. 이를 수정하기 위해서는 (최초 렌더링 시에 필요하지 않다면) 로직을 `useEffect`로 이동한다거나 (`useLayoutEffect`가 수행될 때까지 HTML이 깨져 보이는 경우는) 클라이언트 렌더링이 완료될 때까지 컴포넌트 노출을 지연하도록 해야 합니다.

서버에서 렌더링된 HTML에서 레이아웃 effect가 필요한 컴포넌트를 배제하고 싶다면, `showChild && <Child />`를 사용하여 조건적으로 렌더링 하고 `useEffect(() => { setShowChild(true); }, [])`처럼 노출을 지연시키면 됩니다. 이런 방법으로 자바스크립트 코드가 주입되기 전에 `깨져 보일 수 있는 UI`는 표현되지 않게 됩니다.

## useDebugValue
React 개발자도구에서 사용자 Hook 레이블을 표시하는 데에 사용할 수 있습니다.

``` js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Show a label in DevTools next to this Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```
이 코드에서 보시다시피 `isOnline`state가 있으면 "Online", 없으면 "Offline"으로 표시합니다.

사용자 Hook이 공유된 라이브러리의 일부일 때 가장 유용한 기능입니다.

### 디버그 값 포맷팅 지연하기
경우에 따라 디스플레이 값을 포맷팅하는 것이 고비용의 연산일 수 있습니다. 또한, 사실상 Hook이 감지되지 않는다면 불필요하기도 합니다.

이런 이유로 `useDebugValue`는 옵션 두 번째 파라미터로 포맷팅 함수를 전달할 수도 있습니다. 이 함수는 Hook이 감지되었을 때만 호출됩니다. 이것은 파라미터로써 디버그 값을 전달받아 포맷된 노출값을 반환해야 합니다.

예를 들어 사용자 Hook은 다음의 포맷 형식을 사용해서 `toDateString` 함수를 불필요하게 호출하는 것을 방지할 수 있습니다.

``` js
useDebugValue(date, date => date.toDateString());
```