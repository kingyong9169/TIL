---
layout: default
title: React-Query를 사용하는 이유
parent: React-Query
has-children: false
nav_order: 1
permalink: /react_query/reason/
---

# useQuery
데이터를 `get`하기 위한 `api`입니다. `post, update`는 `useMutation`을 사용합니다. 첫번째 파라미터로 `query key`가 들어가고, 두번째 파라미터로 비동기 함수(api호출 함수)가 들어갑니다.

## query key
- 첫번째 파라미터로 필수적이며 설정한 `query key`는 다른 컴포넌트에서도 해당 키를 사용하면 호출 가능합니다. 또한, 안정적인 해쉬 값으로 해쉬화됩니다.
- `unique Key`는 `string`과 배열을 받습니다. 배열로 넘기면 0번 값은 `string`값으로 다른 컴포넌트에서 부를 값이 들어가고 두번째 값을 넣으면 query 함수 내부에 파라미터로 해당 값이 전달됩니다.
- 문자열 `query key` : 키 형태 중 가장 간단하며 실제로 배열이 아니라 개별 문자열입니다. 문자열 쿼리 키가 전달되면, `query key`에 유일한 항목으로 문자열을 사용하여 내부적으로 배열로 변환됩니다.
``` js
useQuery ( 'todos' , ... ) // queryKey === ['todos']
useQuery ( 'somethingSpecial' , ... ) // queryKey === ['somethingSpecial']
```
- 배열 `query key` : 쿼리가 데이터를 묘사할 때 유일하게 더 많은 정보가 필요하다면, 이 정보를 표현하기 위해 직렬화된 객체의 숫자, 문자열로 배열 `query key`를 사용할 수 있습니다.
``` js
// An individual todo
useQuery(['todo', 5], ...)
// queryKey === ['todo', 5]

// An individual todo in a "preview" format
useQuery(['todo', 5, { preview: true }], ...)
// queryKey === ['todo', 5, { preview: true }]

// A list of todos that are "done"
useQuery(['todos', { type: 'done' }], ...)
// queryKey === ['todos', { type: 'done' }]
```
  - Hierarchical or nested 리소스 : ID, index 혹은 어떤 아이템을 식별하기 위한 유일한 값을 전달하는 것이 일반적입니다.
  - 추가적인 파라미터 : 추가적인 옵션의 객체를 전달하는 것이 일반적입니다.
- 쿼리는 결정적으로 해쉬됩니다 : 즉, 객체의 키 순서에 관계없이 아래 쿼리는 모두 동일한 것으로 간주됩니다.
``` js
useQuery(['todos', { status, page }], ...)
useQuery(['todos', { page, status }], ...)
useQuery(['todos', { page, status, other: undefined }], ...)
```
또한 아래 쿼리 키는 같지 않습니다. 배열 항목 순서가 중요합니다.
``` js
useQuery(['todos', status, page], ...)
useQuery(['todos', page, status], ...)
useQuery(['todos', undefined, page, status], ...)
```
- 만약 쿼리 함수가 변수에 의존하는 경우 쿼리 키에 포함하세요.
쿼리 키는 가져오는 데이터를 고유하게 묘사하므로 쿼리 함수에서 변경하는 모든 변수를 포함해야 합니다.
``` js
function Todos({ todoId }) {
  const result = useQuery(['todos', todoId], () => fetchTodoById(todoId))
}
```
- 쿼리는 키가 바뀔 때 자동으로 업데이트합니다.(단, `enabled`가 `true`이면)

## query function
``` js
queryFn: (context: QueryFunctionContext) => Promise<TData>
```
타입으로 프로미스를 반환하는 함수이어야 합니다. 또한, 필수사항이며 
- 쿼리가 데이터를 요청하는 데 사용할 함수입니다.
- 아래 변수와 함께 `QueryFunctionContext`객체를 받습니다.
  - `queryKey: EnsuredQueryKey` : 배열로 보장된 쿼리키
- 데이터를 해결하거나 에러를 보내는 프로미스 객체를 반드시 리턴해야 합니다.
- return 값은 api의 성공, 실패여부, api return 값을 포함한 객체입니다.
- `useQuery`는 `비동기`로 작동합니다. 즉, 한 컴포넌트에 여러 개의 `useQuery`가 있다면 동시에 실행됩니다. 여러 개의 비동기 `query`가 있다면 `useQueries`가 더 유용합니다.
- 파라미터 대신에 쿼리 객체를 사용하기 : `[queryKey, queryFn, config]`시그니처는 React Query의 API를 통해 지원되며 같은 config를 표현하기 위해 객체를 사용할 수 있습니다.
``` js
import { useQuery } from 'react-query'

useQuery({
  queryKey: ['todo', 7],
  queryFn: fetchTodo,
  ...config,
})
```
- 어떤 이유로든 전체 앱에 대해 동일한 쿼리 기능을 공유하고 쿼리 키를 사용하여 가져와야 할 항목을 식별할 수 있기를 원하는 경우 React Query에 기본 쿼리 기능을 제공하여 이를 수행할 수 있습니다.
``` js
// 쿼리 키를 받는 디폴트 쿼리 함수 선언
// 여기서 쿼리키는 배열로 보장받는다.
const defaultQueryFn = async ({ queryKey }) => {
  const { data } = await axios.get(`https://jsonplaceholder.typicode.com${queryKey[0]}`);
  return data;
};

// 디폴트옵션으로 앱에 디폴트 함수를 제공한다.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  )
}

// 이제 키를 전달하기만 하면 된다.
function Posts() {
  const { status, data, error, isFetching } = useQuery('/posts')
  // ...
}

// 쿼리 함수를 생략하고 바로 옵션을 설정할 수도 있다.
function Post({ postId }) {
  const { status, data, error, isFetching } = useQuery(`/posts/${postId}`, {
    enabled: !!postId,
  })
  // ...
}
```

## 예시
``` js
const Todos = () => {
  const { isLoading, isError, data, error } = useQuery("todos", fetchTodoList, {
    refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
    retry: 0, // 실패시 재호출 몇번 할지
    onSuccess: data => {
      // 성공시 호출
      console.log(data);
    },
    onError: e => {
      // 실패시 호출 (401, 404 같은 error가 아니라 정말 api 호출이 실패한 경우만 호출됩니다.)
      // 강제로 에러 발생시키려면 api단에서 throw Error 날립니다. (참조 : https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default)
      console.log(e.message);
    }
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <ul>
      {data.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
};
```

`isLoading, isSuccess`말고 `status`로 한번에 처리 가능합니다.
``` js
function Todos() {
  const { status, data, error } = useQuery("todos", fetchTodoList);

  if (status === "loading") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  return (
    <ul>
      {data.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```
더 자세한 api는 [공식 문서](https://react-query.tanstack.com/reference/useQuery)를 참조해주세요.

### useQuery 동기적으로 실행
`enabled`옵션을 사용하면 `useQuery`을 동기적으로 사용 가능합니다.<br>
`useQuery`의 3번째 인자로 옵션값이 들어가는데 그 옵션의 `enabled`에 값을 넣으면 그 값이 `true`일때 `useQuery`를 실횅합니다. 이것을 이용하면 동기적으로 함수를 실행 할 수 있습니다.
``` js
const { data: todoList, error, isFetching } = useQuery("todos", fetchTodoList);
const { data: nextTodo, error, isFetching } = useQuery(
  "nextTodos",
  fetchNextTodoList,
  {
    enabled: !!todoList // true가 되면 fetchNextTodoList를 실행한다
  }
);
```

## useQueries
`useQuery`를 비동기로 여러 개 실행할 경우 여러 귀찮은 경우가 생깁니다.
``` js
const usersQuery = useQuery("users", fetchUsers);
const teamsQuery = useQuery("teams", fetchTeams);
const projectsQuery = useQuery("projects", fetchProjects);

// 어짜피 세 함수 모두 비동기로 실행하는데, 세 변수를 개발자는 다 기억해야하고 세 변수에 대한 로딩, 성공, 실패처리를 모두 해야한다.
```
이때 `promise.all`처럼 `useQuery`를 하나로 묶을 수 있는데, 그것이 `useQueries`입니다. `promise.all`과 마찬가지로 하나의 배열에 각 쿼리에 대한 상태 값이 객체로 들어옵니다.
``` js
// 아래 예시는 롤 룬과, 스펠을 받아오는 예시입니다.
const result = useQueries([
  {
    queryKey: ["getRune", riot.version],
    queryFn: () => api.getRunInfo(riot.version)
  },
  {
    queryKey: ["getSpell", riot.version],
    queryFn: () => api.getSpellInfo(riot.version)
  }
]);

useEffect(() => {
  console.log(result); // [{rune 정보, data: [], isSucces: true ...}, {spell 정보, data: [], isSucces: true ...}]
  const loadingFinishAll = result.some(result => result.isLoading);
  console.log(loadingFinishAll); // loadingFinishAll이 false이면(로딩이 끝나면)) 최종 완료
}, [result]);
```

``` js
function App({ users }) {
  const userQueries = useQueries(
    users.map(user => {
      return {
        queryKey: ['user', user.id],
        queryFn: () => fetchUserById(user.id),
      }
    })
  )
}
```
이와 같이 map함수로도 사용할 수 있습니다.


## unique key 활용
`unique key`를 배열로 넣으면 `query`함수 내부에서 변수로 사용 가능합니다.
``` js
const riot = {
  version: "12.1.1"
};

const result = useQueries([
  {
    queryKey: ["getRune", riot.version],
    queryFn: params => {
      console.log(params);
      // { queryKey: ['getRune', '12.1.1'], pageParam: undefined, meta: undefined }
      return api.getRunInfo(riot.version);
    }
  },
  {
    queryKey: ["getSpell", riot.version],
    queryFn: () => api.getSpellInfo(riot.version)
  }
]);
```

## Window Focus Refetching
사용자가 애플리케이션을 떠나 오래된 데이터(stale data)로 돌아오면 React Query는 백그라운드에서 자동으로 새로운 데이터를 요청합니다. `refetchOnWindowFocus`옵션을 사용하여 전역적으로 또는 쿼리별로 비활성화할 수 있습니다.

**전역 비활성화**
``` js
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
 
function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
```

**쿼리 당 비활성화**
``` js
useQuery('todos', fetchTodos, { refetchOnWindowFocus: false })
```
