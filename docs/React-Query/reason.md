---
layout: default
title: React-Query를 사용하는 이유
parent: React-Query
has-children: false
nav_order: 1
permalink: /react_query/reason/
---

# React-Query를 사용하는 이유
React-Query는 서버의 값을 클라이언트에 가져오거나, 캐싱, 값 업데이트, 에러핸들링 등 비동기 과정을 더욱 편하게 하는데 사용됩니다.

기존에는 서버로부터 값을 가져오거나 업데이트하는 로직을 store 내부에 개발하는 경우가 많았습니다. 그렇다보니 store는 클라이언트 상태를 유지해야하는데 클라이언트, 서버 상태가 공존하는 것도 모자라 오히려 서버 상태가 많아지는 상황이 발생했습니다. 따라서 클라이언트, 서버 상태를 분리하여 본래의 store의 사용 목적을 지키고 React-Query의 여러 기능을 통해 개발의 효율성을 높일 수 있습니다.

## React-Query 장점
여러가지 장점이 있지만 주로 프론트 개발자가 구현하기 귀찮고 반복적인 작업들을 편리하게 수행하도록 도와줍니다.
- 캐싱
- get을 한 데이터에 대해 update를 하면 자동으로 get을 다시 수행한다.(예를 들면 게시판의 글을 가져왔을 때 게시판의 글을 생성하면 게시판 글을 get하는 api를 자동으로 실행)
- 데이터가 오래 되었다고 판단되면 다시 get(`invalidateQueries`)
- 동일 데이터 여러번 요청하면 한 번만 요청한다.(옵션에 따라 중복 호출 허용 시간 조절 가능)
- 무한 스크롤(Infinite Queries)
- 비동기 과정을 선언적으로 관리 가능
- react hook과 사용하는 구조가 비슷하여 react 유저에게 편리하다.

## 시작하기
``` js
import {
   useQuery,
   useMutation,
   useQueryClient,
   QueryClient,
   QueryClientProvider,
} from 'react-query'
import { getTodos, postTodo } from '../my-api'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}
```
가장 기본이 되는 곳에 `QueryClientProvider`를 세팅합니다.
