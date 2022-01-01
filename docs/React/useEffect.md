---
layout: default
title: useEffect 총정리
parent: React
has-children: false
nav_order: 5
permalink: /react/useEffect/
---

# useEffect 총정리

``` js 
useEffect(didUpdate);
```
- Effect는 sideEffect(부작용, 함수 외부에 영향을 주는 행위)을 의미하는데 이 이름이 붙여진 이유는 컴포넌트를 렌더링하는 본래 자신의 일이 아닌, 외부의 상태를 변경하는 작업을 하기 때문이라고 생각합니다.
- 대표적인 부작용 예시로는 API 호출, 이벤트 처리 함수 등록 및 해제 등이 대표적입니다.
- 명령형 또는 어떤 effect를 발생하는 `함수`를 인자로 받습니다.
- `useEffect`에 전달된 함수는 화면에 렌더링이 완료된 후에 수행됩니다.
- 기본적으로 동작은 모든 렌더링이 완료된 후에 수행됩니다만, 어떤 값이 변경되었을 때만 실행되게 할 수도 있습니다.(의존성 배열 deps)

## effect 정리(clean-up)
effect는 종종 컴포넌트가 화면에서 제거될 때 정리해야 하는 리소스를 만듭니다. 예를 들면, 구독이나 타이머와 같은 것입니다. 이것을 수행하기 위해서 `useEffect`로 전달된 함수는 정리(clean-up) 함수를 반환할 수 있습니다. 예를 들어 구독을 생성하는 경우는 아래와 같습니다.
``` js 
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
```

정리 함수는 메모리 누수 방지를 위해 UI에서 컴포넌트를 제거하기 전에 수행됩니다.
더불어, 컴포넌트가 (그냥 일반적으로 수행하는 것처럼) 여러 번 렌더링 된다면 `다음 effect가 수행되기 전에 이전 effect는 정리됩니다.` 그 이유는 브라우저의 렌더링을 방해하지 않게 하기 위함입니다. 위의 예에서, 매 갱신마다 새로운 구독이 생성된다고 볼 수 있습니다.

아래와 같이 동작합니다.
- props, state 업데이트
- 컴포넌트 리렌더링
- 이전 이펙트 정리
- 새로운 이펙트 실행

## effect 타이밍
`componentDidMount`와 `componentDidUpdate`와는 다르게, useEffect로 전달된 함수는 지연 이벤트 동안에 레이아웃 배치와 그리기를 완료한 후(렌더링 이후) 발생합니다. 이것은 구독이나 이벤트 핸들러를 설정하는 것과 같은 다수의 공통적인 부작용에 적합합니다. **왜냐면 대부분의 작업이 브라우저에서 화면을 업데이트하는 것을 차단해서는 안 되기 때문입니다.**

그렇지만, 모든 effect가 지연될 수는 없습니다. 예를 들어 사용자에게 노출되는 DOM 변경은 사용자가 노출된 내용의 불일치를 경험하지 않도록 다음 화면을 다 그리기 이전에 동기화 되어야 합니다. (그 구분이란 개념적으로는 수동적 이벤트 리스너와 능동적 이벤트 리스너의 차이와 유사합니다) 이런 종류의 effect를 위해 React는 `useLayoutEffect`라는 추가적인 Hook을 제공합니다. useEffect와 동일한 시그니처를 가지고 있고 수행될 때에만 차이가 납니다.

useEffect는 브라우저 화면이 다 그려질 때까지 지연되지만, 다음 어떤 새로운 렌더링이 발생하기 이전에 발생하는 것도 보장합니다. **React는 새로운 갱신을 시작하기 전에 이전 렌더링을 항상 완료하게 됩니다.**

## 조건부 effect 발생
effect의 기본 동작은 모든 렌더링을 완료한 후 effect를 발생하는 것입니다. 의존성 배열 중 하나가 변경된다면 effect는 항상 재생성됩니다.

effect와는 관련 없는 state, props가 바뀌어서 매번 갱신 필요없을 때, 의존성 배열을 통해 해당 상태나 props가 변경될 때에만 effect를 실행할 수 있습니다.

## 마운트 될 때만 이펙트 실행하기
의존성 배열을 비워주면 마운트 될 때만 이펙트를 실행하는 효과를 얻을 수 있습니다. 빈 배열([])을 전달한다면 effect 안에 있는 props와 state는 항상 초깃값을 가지게 될 것입니다. 이를 통해 effect는 React에게 props나 state에서 가져온 어떤 값에도 의존하지 않으므로, 다시 실행할 필요가 전혀 없다는 것을 알려주게 됩니다.

``` js 
useEffect(() => { 
    fetchData(); 
}, []);
```

하지만 버그가 있을 수 있는 편법입니다. 예를 들면, setInterval이 있습니다.

setInterval을 사용해서 매 초마다 숫자를 증가 시키는 카운터를 아래와 같이 작성했다고 해봅시다.

``` js 
function Counter() { 
    const [count, setCount] = useState(0); 
    useEffect(() => { 
        const id = setInterval(() => { 
            setCount(count + 1); 
        }, 1000); 
        return () => clearInterval(id); 
    }, []); 
    return <h1>{count}</h1>; 
}
```

의존성 배열이 비어 있어 마운트 될 때만 실행될거고 클린업 함수에서 clearInterval 해줬으니 예상대로 동작할거라고 생각하시면 큰 오산입니다.

**count는 딱 한번만 증가됩니다.**

deps에는 아무것도 있지 않기 때문에 첫 렌더링 직후 딱 한번만 실행됩니다. 그 때 setInterval이 실행되는데 count는 현재 0입니다. 그리고 setCount(0 + 1)을 하는 순간 컴포넌트가 두 번째 렌더링을 시작합니다. 이 때 count는 1인 상태로 렌더링이 완료됩니다. 그 후에 이펙트를 실행할지 말지 결정하는데 deps에 아무것도 없으니 실행하지 않습니다. 이전 렌더링에서 등록했던 클린업 함수도 실행되지 않습니다. 왜냐면 다음 렌더링 이후에 클린업 함수가 실행되기 때문입니다.

따라서 count가 0인 상태로 interval이 실행되고 있습니다. 무한루프에 빠진 것입니다. 그 이유는 클린업 함수가 실행되지 않아서 타이머 함수가 멈추지 않고 있고 클로저로 인해 이전 이펙트는 count값 0을 참조하고 있기 때문입니다.

따라서 종속성 배열에 `[count]`를 지정하여 버그를 수정할 수 있습니다. 하지만 count가 변경될 때마다 간격이 재설정딥니다. 불필요한 오버헤드가 생깁니다. 따라서 위 `useState`의 [함수적 갱신]()을 사용하면 됩니다.
``` js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ 이것은 외부의 'count' 변수에 의존하지 않습니다
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ 우리의 effect는 컴포넌트 범위의 변수를 사용하지 않습니다

  return <h1>{count}</h1>;
}
```

위 코드와 공통점은 한 번만 실행되며 리렌더링이 되지 않기 때문에 클린업 함수(clearInterval)이 실행되지 않습니다.
하지만 여기서 위 코드와 다른 점은 위에서는 count상태를 직접 참조하고 있으므로 이전 effect를 실행하고 있으므로 클로저에 의해 count가 0인 값을 갖고 있습니다. 하지만 함수적 갱신에서는 count를 직접 참조하고 있지 않고 `c`라는 매개변수를 통해 상태를 변경하고 있습니다. 여기서 `c`는 이전 값을 받아오므로 항상 최신 값을 유지합니다. **기존 상태가 무엇이든 상관없이 그냥 거기에 1을 더해줘**라고 말하는 것입니다.

여기서 또 하나, 상태는 변경되지만 의존성 배열에는 아무것도 없기 때문에 클린업 함수는 실행되지 않으며 다음 이펙트 또한 실행되지 않습니다.

## 이펙트 안에서는 최소한의 정보만 사용해야 한다.
위 예제처럼, 이펙트 안에서 컴포넌트의 count상태를 직접 사용하는 것이 아닌 함수형 업데이트를 통해서 사용한 것처럼 말입니다. 후자의 방식은 컴포넌트가 현재 어떤 상태를 갖고 있는지 전혀 궁금해 하지 않습니다.

즉, useEffect안에서 컴포넌트 내부에 있는 값을 많이 가져다 사용할수록 렌더링 스코프에 갇힌 변수들이 많아진다는 것이고 그 말은 결국에는 `디버깅하기 힘든 이슈가 발생할 가능성이 높아진다`는 것을 의미합니다.

useState를 통해 하나의 state로는 할 수 있는 일이 제한적입니다. 컴포넌트 여러 상태를 계산하고 싶을 때는 useReducer를 사용하면 됩니다.

## useReducer를 활용하여 여러 상태 업데이트하기
``` js
function Counter() {
    const [count, setCount] = useState(0);
    const [step, setStep] = useState(1);

    useEffect(() => {
        const id = setInterval(() => {
            setCount(c => c + step);
        }, 1000);
        return () => clearInterval(id);
    }, [step]);

    return ( 
        <>
            <h1>{count}</h1>
            <input value={step} onChange={e => setStep(Number(e.target.value))} />
        </>
    );
}
```

이 예제는 1씩 증가하는 것이 아니라 원하는 step값만큼 카운터를 1초마다 증가시키는 예제입니다. 
여기서 만약 step을 바뀌주면 step이 이펙트의 의존성으로 설정되어 있기 때문에 인터벌이 초기화되고 재설정됩니다.

근데 step이 바뀌더라도 인터벌을 재설정하고 싶지 않으면 어떻게 해야 할까요? useReducer를 사용하면 됩니다.

``` js
const [state, dispatch] = useReducer(reducer, initialState);
const { count, step } = state;

useEffect(() => {
    const id = setInterval(() => {
        dispatch({ type: 'tick' }); // setCount(c => c + step) 대신에
    }, 1000);

    return () => clearInterval(id);
}, []);
```

1초마다 `tick`이라는 액션을 dispatch하는 코드입니다. 이펙트는 무슨 일이 일어났는지만 명시하고 직접 상태를 가져다가 사용하지 않습니다. 이렇게 하면, 이펙트가 컴포넌트 내부의 어떤 값도 사용하지 않게 만들 수 있습니다.

``` js
const initialState = {
    count: 0, 
    step: 1, 
};

function reducer(state, action) {
    const { count, step } = state;

    if (action.type === 'tick') {
        return { count: count + step, step }; 
    } else if (action.type === 'step') {
        return { count, step: action.step };
    } else {
        throw new Error();
    }
}
```

이런 방식으로 렌더링 스코프에 갇힌 변수를 사용하지 않고 예상한대로 작동할 수 있습니다.