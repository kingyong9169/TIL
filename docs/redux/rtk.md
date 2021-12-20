---
layout: default
title: Redux Tool Kit 개념 총정리
parent: Redux
nav_order: 3
has_children: false
permalink: /redux/rtk
---

# Redux Tool Kit 개념 총정리
이 글은 [공식 문서](https://redux-toolkit.js.org/usage/usage-with-typescript)와 [블로그 1](https://blog.rhostem.com/posts/2020-03-04-redux-toolkits), [블로그 2](https://blog.woolta.com/categories/1/posts/204), [블로그 3](https://velog.io/@raejoonee/createAsyncThunk)에 있는 내용을 바탕으로 작성한 글입니다. 아직 공부량이 적어 부족한 점이 많으니 적극적으로 알려주시면 감사하겠습니다. 먼저, 예시로 사용되는 간단한 코드와 제가 직접 구현한 코드를 혼용하여 사용하는 것에 양해 부탁드립니다.

## 업데이트 로그
- 2021.12.17 직렬화 가능성 검사 미들웨어, thunk 결과 처리 방법 추가

## RTK를 사용하는 이유
redux를 사용할 때 actionType 정의, 액션 함수, 리듀서 함수를 생성합니다. 

이렇게 하면 너무 많은 코드가 생성되니 redux-actons를 사용하게 되고, 불변성을 지켜야하는 원칙 때문에 immer를 사용하게 되고, store 값을 효율적으로 핸들링하여 불필요 리렌더링을 막기 위해 reselect를 쓰게 되었으며, 비동기 작업을 위해, thunk나 saga를 설치합니다.

이렇기 때문에 설치하는 것도 많고 작업해야 할 코드도 많습니다.

그런데, redux-toolkit은 redux가 saga를 제외한 위 기능 모두 지원합니다. 

또한 typeScript 사용자를 위해 action type, state type 등 TypeScript를 사용할 때 필요한 Type Definition을 지원해줘서 굉장히 편리하다는 장점이 있습니다.

## configureStore

기존 redux store, rootReducer 코드
``` typescript
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../reducers";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);

export default store;
```

``` typescript
import { combineReducers } from "redux";
import example from "./example";

const rootReducer = combineReducers({
  example,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
```

RTK store 코드
``` typescript
import { configureStore, MiddlewareArray } from "@reduxjs/toolkit";
import logger from "./loggerMiddleware";
import { noticeSlice } from "./noticeSlice";

export const store = configureStore({
  // composeWithDevtools, thunk 자동 활성화
  reducer: {
    // 리듀서 정의
    notice: noticeSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  // 혹은 middleware: new MiddlewareArray().concat(logger), // logger 미들웨어 추가
  // 혹은 middleware: [logger] as const, // logger 미들웨어 추가
  devTools: process.env.NODE_ENV !== "production"
});

// store 스스로 루트상태 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
```

코드만 봤을 때도 직관적으로 RTK가 편하다는 느낌이 오시지 않나요? 

이전 redux에서는 store, rootReducer 둘 다 만들어줘야 했다면 RTK는 그럴 필요가 없습니다.
또한, composeWithDevTools, thunk를 내장으로 갖고 있기 때문에 따로 설치해줄 필요도 없습니다.

- `reducer` : store의 리듀서를 정의합니다. 기존의 rootReducer역할을 합니다.
- `middleware` : 필요한 미들웨어는 `middleware: getDefaultMiddleware().concat(logger)`와 같이 추가해주면 됩니다.
- `getDeaultMiddleware` : 직역하여 "기본적인 미들웨어를 가져오겠다" 라는 뜻입니다. 기본 미들웨어로 
[thunk, immutableStateInvariant, serializableStateInvariant](https://redux-toolkit.js.org/api/getDefaultMiddleware#development)가 포함됩니다.
- `MiddlewareArray`는 `getDeaultMiddleware` 대신에 사용할 수 있습니다. 미들웨어 array의 type-safe 결합하는데 사용할 수 있습니다. 디폴트 javascript Array타입을 확장하기 때문에 미들웨어를 추가할 때, 스프레드(...)연산자를 사용하지 않고 `concat, prepend`를 사용해야 한다고 설명하고 있습니다.
- 또한, 위 2개를 사용하지 않고 `[logger] as const` 처럼 사용할 수도 있습니다.
- `devTools` : 실 서비스와 같이 리덕스 개발 도구가 보이면 안되는 상황에서의 사용 설정입니다.

이외의 다른 옵션은 [configureStore](https://redux-toolkit.js.org/api/configureStore)을 통해 확인해주시면 좋을 것 같습니다.

만약 Dispatch 타입을 얻고 싶다면 store를 먼저 정의한 후 가능합니다. 디스패치 타입 이름이 남용되기 때문에 AppDispatch와 같이 서로 다른 이름으로 타입을 정의할 것을 공식 문서에서 권장하고 있습니다.

또한, `useAppDispatch`같이 훅을 export한 다음 
`const dispatch = useAppDispatch();`와 같이 `useDispatch`을 호출할 때마다 사용하는 것이 더 편리할 수도 있습니다. 더 자세한 내용은 [react-redux 공식 문서](https://react-redux.js.org/using-react-redux/usage-with-typescript#typing-the-usedispatch-hook)을 참고해주세요.

### 직렬화 가능성 검사 미들웨어 
[공식 문서1](https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data), [공식 문서2](https://redux-toolkit.js.org/api/serializabilityMiddleware)

RTK에서 사용하기 위해 특별히 생성된 사용자 정의 미들웨어입니다. `immutable-state-invariant`와 개념이 비슷하지만 `function, Promise, Symbol, 다른 non-plain-JS-data값`과 같이 직렬화할 수 없는 값에 대해 상태 트리와 작업을 심층적으로 확인하는 기능을합니다. 직렬화할 수 없는 값이 감지되면 직렬화 불가능한 값이 감지된 key경로와 함께 다음과 같은 콘솔 오류가 나타납니다.
<img width="1100" alt="스크린샷 2021-12-17 오전 1 51 12" src="https://user-images.githubusercontent.com/62797441/146414110-00506f6f-1dd7-4800-a1a7-5282953b1316.png">

Redux의 핵심 사용 원칙 중 하나는 `직렬화할 수 없는 값을 state, action에 넣지 않아야 한다는 것`입니다. 하지만 예외 상황이 있습니다. 직렬화할 수 없는 데이터를 수락해야 하는 작업을 처리해야 하는 경우가 있을 수 있습니다. 이것은 매우 드물게 필요한 경우에만 수행되어야 하며 이러한 직렬화 불가능한 payload는 reducer를 통해 애플리케이션 상태로 만들지 않아야 합니다. 정말 만약 불가피한 일이 생긴다면
``` typescript
getDefaultMiddleware({
  serializableCheck: false,
}),
```
를 통해 위 이미지와 같은 오류를 없앨 수 있습니다.

## createAction
redux-action에서 사용하는 `creatAction`을 지원합니다. action 타입 문자열을 인자로 받고, 해당 타입을 사용하는 액션 생성자함수를 return 합니다.
기존 redux는 액션 타입과 생성함수 모두를 작성했지만, createAction을 사용하면 모두 작성할 필요가 없습니다.

``` javascript
const increment = createAction("INCREMENT");
const decrement = createAction("DECREMENT");

let action = increment(); // { type: 'counter/increment'} 리턴

action = increment(3); // { type: 'counter/increment', payload: 3 } 리턴

function counter(state = 0, action) {
  switch (action.type) {
    case increment.type:
      return state + 1;
    case decrement.type:
      return state - 1;
    default:
      return state;
  }
}
```

위 코드에서 볼 수 있듯이 `createAction`에는 기본적으로 타입 문자열만 제공하면 됩니다. 그리고 만들어진 액션 생성자의 파라미터는 그대로 `payload` 속성에 들어갑니다.

만약 리턴되는 액션 객체를 변경하고 싶다면 콜백 함수를 `createAction`의 두 번째 파라미터로 전달하면 됩니다.

``` typescript
const increment = createAction("counter/increment", function prepare(num) {
  return {
    payload: {
      num,
      createdAt: new Date().toISOString()
    }
  };
});

increment(5);
```
콜백 함수 안에서는 액션 생성자 함수의 파라미터로 전달받지 않은 데이터를 추가할 수 있습니다. 하지만 리턴되는 객체는 반드시 `FSA` 형태를 따라야 합니다.

## Flux Standard Action
RTK에서는 액션 객체의 형태로 [FSA](https://github.com/redux-utilities/flux-standard-action)를 강제합니다.

``` typescript
{
  type: 'counter/increment',
  payload: {
    num: 1,
    createdAt: "2021-12-01"
  }
}
```
type는 필수로 지정해야하며 payload, meta, error 필드를 개발자의 입맛에 맞게 정의할 수 있습니다.

## createReducer
FSA까지 봤을 때, 굳이 RTK를 써야하나? 라는 의문점이 생길 수도 있습니다. 하지만 createReducer부터 차이가 드러납니다.

switch문을 작성할 필요 없이(default 작성을 하지 않는다는 또 하나의 장점) reducer가 table lookup하여 action에 따른 적절한 reducer를 호출합니다.

또 하나의 엄청난 장점이 있습니다.
immer의 produce를 자체적으로 지원하기 때문에 따로 코드로 immutable 관리를 하지 않아도 되는 큰 장점이 있습니다. 따라서 전달되는 모든 케이스 리듀서 함수 내부에서 상태를 "변경"하는 것이 이미 안전합니다. 이는 마찬가지로 `createSlice`에서도 당연히 적용됩니다. 내부적으로 `createReducer`를 사용하기 때문입니다.

``` javascript
const increment = createAction("counter/increment");
const decrement = createAction("counter/decrement");

const counter = createReducer(0, {
    [increment]: state => state + 1;
    [decrement]: state => state - 1;
})
```

switch문의 case 문자열이 리듀서 맵의 키가 되었으며 값은 키에 따라 상태가 어떻게 변하는지 정의합니다.

createReducer은 두 가지 파라미터를 전달 받습니다. 첫번째는 초기 상태 값(initialState) 객체, 두번째 파라미터는 reducer 객체입니다.

리듀서 맵의 필드에 액션 생성자에 전달한 문자열을 넣어도 되지만, 위에서처럼 액션 생성자 함수를 직접 넣어도 됩니다. 왜냐하면 `createAction`이 리턴하는 액션 생성자 함수의 `toString`을 오버라이딩했기 때문입니다.


## createSlice
action과 reducer를 한 번에 작성할 수 있습니다.(createAction + createReducer) RTK를 사용하는 큰 이유 중 하나라고 생각하며 RTK의 꽃이라고 생각합니다. 위에서도 언급했지만 `createSlice`에서도 당연히 `immer`가 자동으로 적용됩니다. 내부적으로 `createReducer`를 사용하기 때문입니다. 또한, 리듀서 맵의 값에 해당하는 함수를 슬라이스 외부에서 정의해도 마찬가지로 적용됩니다. immer를 사용할 때 몇 가지 규칙이 존재하므로 반드시 [공식 문서](https://redux-toolkit.js.org/usage/immer-reducers#immutable-updates-with-immer)를 참조하시기 바랍니다.

``` typescript
const counterSlice = createSlice({
  name: "counter", // 액션 타입 문자열의 prefix로 자동으로 들어갑니다. ex) "counter/INCREMENT"

  // 초기값
  initialState: [],

  // 리듀서 맵
  reducers: {
    increment: { // 리듀서와 액션 생성자가 분리되어 있습니다.
      // 리듀서 함수
      reducer: (state, action) => {
        state.push(action.payload);
      },

      // createAction 함수의 두번째 파라미터인 콜백 함수에 해당합니다.
      prepare: (num: number) => ({
        payload: {
          num: num + 1,
          createdAt: new Date().toISOString(),
        }
      })
    },

    // 리듀서와 액션 생성자 함수가 분리되어 있지 않습니다.
    // 파라미터가 payload에 바로 할당됩니다.
    decrement: (state, action) => {
      state.push(action.payload - 1);
    }
  }
});
```
- `name` : 해당 모듈의 이름을 작성합니다.
- `initialState` : 해당 모듈의 초기값을 세팅합니다.
- `reducers` : 리듀서를 작성합니다. 이때 해당 리듀서의 키값으로 액션함수가 자동으로 생성됩니다.
- `extraReducers` : 액션함수가 자동으로 생성되지 않는 별도의 액션함수가 존재하는 리듀서를 정의합니다. (선택 옵션이며 thunk에 대한 reducer를 작성하는 공간입니다.)

위 코드를 보셨다시피 액션 타입의 prefix만 정의하고 리듀서 맵의 키를 정의하면 자동으로 `counter/increment`라는 액션 타입이 자동으로 만들어 집니다.

`createSlice`를 사용하면 가독성이 떨어질 수 있지만 ducks패턴을 지키면서 코드의 양을 줄일 수 있다는 장점이 존재합니다.

하지만 작성해야 할 action, reducer가 많아지면 `createAction, createReducer`로 분리하는 것도 좋은 방법이라고 생각합니다.

### extraReducers
`extraReducers`는 액션을 따로 정의한 함수에 대한 리듀서를 정의하는 역할을 담당합니다. 따라서 정의한 key값은 액션이 자동으로 생성되지 않습니다. thunk의 경우 액션함수를 따로 만들어 줘야 합니다.


### 리턴 값
``` typescript
{
    name : string,
    reducer : ReducerFunction,
    actions : Record<string, ActionCreator>,
    caseReducers: Record<string, CaseReducer>
}
```
위 createSlice의 `reducers`속성에 정의된 리듀서 함수들은 `actions` 필드에 포함되어 리턴됩니다.

`const { increment, decrement } = counterSlice.actions;`

리듀서 함수인데 왜 actions 필드에 포함이 될까요? 그 이유는 reducers에 정의된 함수는 `name`에서 정의한 prefix와 동일한 함수 이름을 합쳐 `createAction`를 통해 액션함수가 자동으로 생성되기 때문입니다.

`reducer` 필드는 `"슬라이스 리듀서"`로써 위 `configureStore`의 `notice: noticeSlice.reducer,`처럼 사용됩니다. 위의 `actions`를 통합하여 하나의 리듀서로 반환한다고 생각하시면 될 것 같습니다.

## typescript
RTK는 ts를 지원해줍니다. 타입을 사용하면 액션을 호출하고 상태를 가져올 때 버그 발생의 가능성을 줄여줍니다.

### createSlice

``` typescript
type ITodo = {
  id: number,
  text: string,
  isDone: boolean,
};

const initialState: ITodo[] = [];

const todosSlice = createSlice({
  initialState: [],
	// ...
})
```
위와 같이 초기 상태의 타입을 지정해줍니다.

``` typescript
const todosSlice = createSlice({
  reducers: {
    removeTodo: (state, action: PayloadAction<{ id: number }>) => {
      // ...
    },
  },
  // ... 
});
```

슬라이스의 리듀서에서는 action의 payload에 어떤 데이터 타입으로 들어와야 하는지 지정할 수 있으며 `PayloadAction`을 사용하면 됩니다.

## createAsyncThunk
redux에서 비동기 처리를 할 때 thunk, saga 등 미들웨어를 사용하여 한 개의 비동기 액션에 대해 pending(비동기 호출 전), fulfilled(비동기 호출 성공), rejected(비동기 호출 실패)의 상태를 생성하여 처리하는 경우가 많았습니다. 하지만 이 API를 사용하여 더욱 편리하게 비동기 코드를 작성할 수 있습니다. 단, thunk만 지원합니다.

또 하나의 장점을 꼽자면 redux-saga에서만 사용할 수 있던 기능(이미 호출한 API 요청 취소하기 등)까지 사용할 수 있습니다.

``` typescript
const getScraper = createAsyncThunk(
  `${name}/getScraper`, // 액션 이름을 정의합니다.
  async (title: string, thunkAPI) => { // payloadCreator 콜백
    try {
      const response = await http.get(title);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
    // 리턴 타입은 Promise
  },
);
```

먼저, 첫 번째 파라미터로 액션 이름을 정의해줍니다. pending, fulfilled, rejected 상태에 대한 action은 자동으로 생성됩니다.
```
noticeScraper/getScraper/pending
noticeScraper/getScraper/fulfilled
noticeScraper/getScraper/rejected
```
이 자동으로 생성됩니다.

두 번째 파라미터로 [payloadCreator](https://redux-toolkit.js.org/api/createAsyncThunk#payloadcreator) 콜백을 정의합니다. 비동기 로직의 결과를 포함하고 있는 프로미스를 반환하는 비동기 함수입니다. 동기적으로 값을 반환할 수도 있습니다.

### promise 상태 별 액션 정의
``` typescript
extraReducers: { // 액션을 따로 정의한 함수에 대한 리듀서를 정의 ex) thunk함수
    [getScraper.pending.type]: (state, action) => {
      // 호출 전
      state.forEach((script) => {
        const scriptCopy = script; // no-param-reassign lint
        scriptCopy.isLoading = true; // 리듀서에서 상태를 직접 바꿔준다.
      });
    },
    [getScraper.fulfilled.type]: (state, action) => {
      // 성공
      state.forEach((script) => {
        const scriptCopy = script; // no-param-reassign lint
        scriptCopy.isLoading = true; // 리듀서에서 상태를 직접 바꿔준다.
        if (scriptCopy.notice.title === action.payload.title)
          scriptCopy.notice.status = action.payload.status; // 리듀서에서 상태를 직접 바꿔준다.
      });
    },
    [getScraper.rejected.type]: (state, action) => {
      // 실패
      state.forEach((script) => {
        const scriptCopy = script; // no-param-reassign lint
        scriptCopy.isLoading = true; // 리듀서에서 상태를 직접 바꿔준다.
        if (scriptCopy.notice.title === action.payload.title)
          scriptCopy.notice.status = "장애"; // 리듀서에서 상태를 직접 바꿔준다.
      });
    },
  },
```

위 코드에서 보시는 바와 같이 `extraReducers` 안에서 리듀서 맵의 키 값은 액션의 type이 되며 각 `action type`에 맞는 함수가 값에 맵핑됩니다.

### thunk의 동작 순서
[공식 문서](https://redux-toolkit.js.org/api/createAsyncThunk#return-value)

먼저 `pending`액션을 디스패치합니다.
- 프로미스가 `fulfilled` 상태라면, `action.payload`를 `fulfilled` 액션에 담아 디스패치하여 상태를 업데이트합니다.
- 프로미스가 `rejected` 상태라면, `rejected` 액션을 디스패치하지만 `rejectedValue(value)`함수의 반환값에 따라 액션에 어떤 값이 넘어올 것인지 결정됩니다.
  - `rejectedValue`가 값을 반환하면 즉, resolved이면 `action.payload`를 `rejected` 액션에 담습니다.
  - 만약에 없거나 값을 반환하지 않는다면 즉, Promise가 실패하고 처리되지 않는다면, `action.error` 값처럼 오류 값의 직렬화된 버전의 작업을 `rejected` 액션에 담습니다.
디스패치된 액션이 어떤 액션인지에 상관없이, 항상 최종적으로 디스패치된 액션을 담고 있는 `이행된 프로미스를 반환`합니다.

그 이유는 다음과 같습니다.
1. RTK는 처리된 오류가 그렇지 않은 경우보다 많다고 생각합니다.
2. 디스패치 결과를 사용하지 않는 경우에도 프로미스가 거부되는 상황을 방지하고자 합니다.

 따라서 오류가 있는 경우 `Error` 인스턴스를 포함하는 `rejected Promise` 혹은 [thunkAPI의 rejectWithValue](https://redux-toolkit.js.org/api/createAsyncThunk#handling-thunk-results)에 의해 반환된 `RejectWithValue` 인수로 `resolved Promise`를 반환하여 오류를 나타내야 합니다.

## thunk 결과 처리하기
thunk는 dispatch될 때, 값을 반환할 수 있습니다. 일반적인 사용 사례(아래 코드)는 Promise를 반환하고 component에서 thunk를 dispatch한 다음 추가 작업을 수행하기 전에 Promise가 해결될 때(resolved)까지 기다리는 것입니다.

``` typescript
const onClick = () => {
  dispatch(fetchUserById(userId)).then(() => {
    // do additional work
  })
}
```

하지만 `createAsyncThunk`는 fulfilled, rejected action으로 항상 resolved Promise를 반환합니다.

따라서 dispatch된 thunk에 의해 반환된 promise는 `unwrap`을 통해 fulfilled payload, error, rejected 액션으로부터 rejectWithValue에 의해 생성된 payload를 구분하고 추출합니다.

``` typescript
// 컴포넌트에서 사용

const onClick = () => {
  dispatch(fetchUserById(userId))
    .unwrap()
    .then((originalPromiseResult) => {
      // 올바른 결과 핸들링
    })
    .catch((rejectedValueOrSerializedError) => {
      // 에러 핸들링
    })
}
```

``` typescript
// 컴포넌트에서 사용

const onClick = async () => {
  try {
    const originalPromiseResult = await dispatch(fetchUserById(userId)).unwrap();
    // 올바른 결과 핸들링
  } catch (rejectedValueOrSerializedError) {
    // 에러 핸들링
  }
}
```

위와 같이 `unwrap()`을 사용하는 것이 선호되지만 RTK의 `unwrapResult`는 비슷한 목적으로 사용할 수 있는 함수도 내보냅니다.

``` typescript
import { unwrapResult } from '@reduxjs/toolkit'

// 컴포넌트에서 사용
const onClick = () => {
  dispatch(fetchUserById(userId))
    .then(unwrapResult)
    .then((originalPromiseResult) => {
      // 올바른 결과 핸들링
    })
    .catch((rejectedValueOrSerializedError) => {
      // 에러 핸들링
    })
}
```

``` typescript
import { unwrapResult } from '@reduxjs/toolkit'

// 컴포넌트에서 사용
const onClick = async () => {
  try {
    const resultAction = await dispatch(fetchUserById(userId))
    const originalPromiseResult = unwrapResult(resultAction)
    // 올바른 결과 핸들링
  } catch (rejectedValueOrSerializedError) {
    // 에러 핸들링
  }
}
```

### 호출했던 API 요청 취소하기, reselector에 관한 내용은 추후에 정리할 예정입니다.