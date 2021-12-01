---
layout: default
title: Redux Tool Kit과 Redux의 차이점 정리
parent: Redux
nav_order: 3
has_children: false
permalink: /redux/rtk
---

# Redux Tool Kit과 Redux의 차이점 정리
이 글은 [공식 문서](https://redux-toolkit.js.org/usage/usage-with-typescript)와 [블로그 1](https://blog.rhostem.com/posts/2020-03-04-redux-toolkits), [블로그 2](https://blog.woolta.com/categories/1/posts/204)에 있는 내용을 바탕으로 작성한 글입니다. 아직 공부량이 적어 부족한 점이 많으니 적극적으로 알려주시면 감사하겠습니다.

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
  middleware: new MiddlewareArray().concat(logger), // logger 미들웨어 추가
  devTools: process.env.NODE_ENV !== "production"
});

// store 스스로 루트상태 정의
export type RootState = ReturnType<typeof store.getState>;
```

코드만 봤을 때도 직관적으로 RTK가 편하다는 느낌이 오시지 않나요? 

이전 redux에서는 store, rootReducer 둘 다 만들어줘야 했다면 RTK는 그럴 필요가 없습니다.
또한, composeWithDevTools, thunk를 내장으로 갖고 있기 때문에 따로 설치해줄 필요도 없습니다.

- `reducer` : store의 리듀서를 정의합니다. 기존의 rootReducer역할을 합니다.
- `middleware` : 필요한 미들웨어는 `middleware: new MiddlewareArray().concat(logger)`와 같이 추가해주면 됩니다.
- `MiddlewareArray`는 미들웨어 array에 다른 미들웨어를 type-safe 결합하는데 사용되며 디폴트 javascript Array타입을 확장하기 때문에 공식 문서에서 권장하고 있습니다. 또한, 미들웨어 array에 미들웨어를 추가할 때, 스프레드(...)연산자를 사용하지 않고 `concat, prepend`를 사용할 것을 권장하고 있습니다.
- `devTools` : 실 서비스와 같이 리덕스 개발 도구가 보이면 안되는 상황에서의 사용 설정입니다.

이외의 다른 옵션은 [configureStore](https://redux-toolkit.js.org/api/configureStore)을 통해 확인해주시면 좋을 것 같습니다.


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
action과 reducer를 한 번에 작성할 수 있습니다.(createAction + createReducer) RTK를 사용하는 큰 이유 중 하나라고 생각하며 RTK의 꽃이라고 생각합니다.

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
- name : 해당 모듈의 이름을 작성합니다.
- initialState : 해당 모듈의 초기값을 세팅합니다.
- reducers : 리듀서를 작성합니다. 이때 해당 리듀서의 키값으로 액션함수가 자동으로 생성됩니다.
- extraReducers : 액션함수가 자동으로 생성되지 않는 별도의 액션함수가 존재하는 리듀서를 정의합니다. (선택 옵션이며 thunk에 대한 reducer를 작성하는 공간입니다.)

위 코드를 보셨다시피 액션 타입의 prefix만 정의하고 리듀서 맵의 키를 정의하면 자동으로 `counter/INCREMENT`라는 액션 타입이 자동으로 만들어 집니다.

`createSlice`를 사용하면 가독성이 떨어질 수 있지만 ducks패턴을 지키면서 코드의 양을 줄일 수 있다는 장점이 존재합니다.

하지만 작성해야 할 action, reducer가 많아지면 `createAction, createReducer`로 분리하는 것도 좋은 방법이라고 생각합니다.

### extraReducers
`extraReducers`는 액션을 따로 정의한 함수에 대한 리듀서를 정의하는 역할을 담당합니다. 따라서 정의한 key값은 액션이 자동으로 생성되지 않습니다. thunk의 경우 액션함수를 따로 만들어 줘야 합니다.

## createAsyncThunk
redux에서 비동기 처리를 할 때 thunk, saga 등 미들웨어를 사용하여 한 개의 비동기 액션에 대해 pending(비동기 호출 전), fulfilled(비동기 호출 성공), rejectd(비동기 호출 실패)의 상태를 생성하여 처리하는 경우가 많았습니다. 하지만 이 API를 사용하여 더욱 편리하게 비동기 코드를 작성할 수 있습니다. 단, thunk만 지원합니다.

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
	}
	// ... 
})
```

슬라이스의 리듀서에서는 action의 payload에 어떤 데이터 타입으로 들어와야 하는지 지정할 수 있으며 `PayloadAction`을 사용하면 됩니다.

``` typescript
const getScraper = createAsyncThunk(
  `${name}/getScraper`, // 액션 이름을 정의합니다.
  async (title: string, thunkAPI) => {
    try {
      const response = await http.get(title);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
    // 리턴 타입은 Promise
  },
);
```

먼저, 첫 번째 파라미터로 액션 이름을 정의해줍니다. pending, fulfilled, rejected 상태에 대한 action은 자동으로 생성됩니다.

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