---
layout: default
title: MSW
parent: React test
nav_order: 3
permalink: /react_test/msw
---

# Mock Service Worker
백엔드에서 데이터를 가져오는 부분을 테스트하기 위해서 사용. 테스트 환경에서는 `real 서버`에 호출할 수 없기 때문에 요청을 가로채서 `MSW`로 요청을 처리하고 모의 응답을 보내주는 방식으로 테스트한다.

<img src="https://mermaid.ink/img/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG5cdEJyb3dzZXIgLT4-IFNlcnZpY2UgV29ya2VyOiAxLiByZXF1ZXN0XG4gIFNlcnZpY2UgV29ya2VyIC0tPj4gbXN3OiAyLiByZXF1ZXN0IGNsb25lXG4gIG1zdyAtLT4-IG1zdzogMy4gbWF0Y2ggYWdhaW5zdCBtb2Nrc1xuICBtc3cgLS0-PiBTZXJ2aWNlIFdvcmtlcjogNC4gTW9ja2VkIHJlc3BvbnNlXG4gIFNlcnZpY2UgV29ya2VyIC0-PiBCcm93c2VyOiA1LiByZXNwb25kV2l0aChtb2NrZWRSZXNwb25zZSlcblx0XHRcdFx0XHQiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ" width="500" />

## 동작 방식
1. 브라우저에 서비스 워커를 등록하여 외부로 나가는 네트워크 요청을 감지
2. 그 요청을 실제 서버로 갈 때 중간에 가로채서 MSW 클라이언트 사이드 라이브러리로 보냄.
3. 등록된 **핸들러에서** 요청을 처리한 후 모의 응답을 브라우저로 보냄.

## 세팅하기
1. MSW를 설치
```bash
npm install msw --save-dev
```

2. `src/mocks/handler.js` 파일을 생성하고 아래 코드(핸들러)를 작성
> 핸들러의 타입은 rest or GraphQL
`req`: 매칭 요청에 대한 정보
`res`: 모의 응답을 생성하는 기능적 유틸리티
`ctx`: 모의 응답의 상태 코드, 헤더, 본문 등을 설정하는 데 도움이 되는 함수 그룹.

```js
import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:5000/products", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: "America",
          imagePath: "/images/america.jpeg",
        },
        {
          name: "England",
          imagePath: "/images/england.jpeg",
        },
      ])
    );
  }),
  rest.get("http://localhost:5000/options", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: "Insurance",
        },
        {
          name: "Dinner",
        },
      ])
    );
  }),
  rest.post("http://localhost:5000/order", (req, res, ctx) => {
    let dummyData = [{ orderNumber: 2131234324, price: 2000 }];
    return res(ctx.json(dummyData));
  }),
];
```

## 사용하기
### 브라우저와 통합
브라우저에서는 서비스 워커를 통해서 mocking server를 구동시킨다.

1. 서비스 워커 생성

``` js
// src/mocks/browser.js
import { setupWorker } from "msw/node";
import { handlers } from "./handlers";

// mocking server 생성
export const server = setupWorker(...handlers)
```

2. 생성한 서비스 워커 브라우저에 등록

```bash
npx msw init public/ --save
```
프로젝트 정적 파일이 위치한 `public/` 폴더 밑에 생성해주어야 한다.

이 명령을 통해 `mockServiceWorker.js`파일이 생성된다. 이 파일이 프로덕션에 `serve`되지 않도록 주의해야 한다.

```js
// _app.js
if (process.env.NODE_ENV === "development") {
  const { worker } = require("./mocks/browser");
  worker.start();
}
```

### 노드와 통합(Jest 사용하는 테스트 환경)
노드 환경에서는 listen, start, close 순으로 실제 서버가 동작하는 것처럼 mocking하는 것이다.

1. 서버 생성
``` js
// src/mocks/browser.js
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// mocking server 생성
export const server = setupServer(...handlers)
```

2. API mocking 설정
```js
// src/setupTests.js
import "@testing-library/jest-dom";

import { server } from "./mocks/server";

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
```

### 브라우저, 노드 환경에서 MSW 실행하기
노드 환경일 때는 server, 브라우저 환경일 때는 worker를 실행시킨다.
1. `src/mocks/initMockApi.js` 파일 생성
```js
// src/mocks/initMockApi.js
const initMockApi = async () => {
  if (typeof window === 'undefined') {
    const { server } = await import('../mocks/server');
    server.listen();
  } else {
    const { worker } = await import('../mocks/browser');
    worker.start();
  }
};

export default initMockApi;
```

2. `src/pages/_app.js` 파일 수정
```js
// src/pages/_app.js
import initMockApi from "../mocks/initMockApi";

if (process.env.NODE_ENV === "development") {
  initMockApi();
}
```

이제 브라우저, jest환경에서 api를 요청할 때, `msw`를 통해 `mocking`된 데이터를 받아올 수 있다.

## Devtools에서 MSW 동작 확인하기
1. localhost 실행하면 Devtools > Console에서 [MSW] Mocking enabled를 볼 수 있다.
<img src="https://miro.medium.com/max/1400/1*PFN1ZtoNtAclzkMnfp2fmQ.webp" width="500" />

2. Devtools > Application 탭 > Service Worker 로 이동하면 실행 중인 서비스 워커를 볼 수 있다.
3. `MSW 설정`에서 만든 서비스 워커가 실행 중 이다. `Bypass for network` 옵션을 체크하면 서비스 워커 동작을 멈추고 실제 서버로 요청을 전달한다.
<img src="https://miro.medium.com/max/1400/1*wGYbOYB2HJB2nDr1kzqbLg.webp" width="500" />

## 사용예시 - jest

### api mocking하기
```js
test("fetch option information from server", async () => {
  render(<Type orderType="options" />);

  const optionCheckboxes = await screen.findAllByRole("checkbox");

  expect(optionCheckboxes).toHaveLength(2);
});
```
위 `Type` 컴포넌트 내부에서는 `"http://localhost:5000/options"`에 대한 `Get`요청을 하고 있다. MSW를 사용했기 때문에 mocking하여 결과를 테스트할 수 있게 되는 것이다.

### api mocking하기 - 에러 발생
```js
test("when fetching product datas, face an error", async () => {
  server.resetHandlers(
    rest.get("http://localhost:5000/products", (req, res, ctx) => {
     return res(ctx.status(500));
    })
  );

  render(<Type orderType="products" />);

  const errorBanner = await screen.findByTestId("error-banner");
  expect(errorBanner).toHaveTextContent("에러가 발생했습니다.")
});
```
기존 핸들러에는 성공 상태를 반환하도록 되어있는데, `resetHandlers`를 통해 핸들러를 재설정하여 에러를 발생시킬 수 있다.

## 참고자료
- <a href="https://blog.mathpresso.com/msw%EB%A1%9C-api-%EB%AA%A8%ED%82%B9%ED%95%98%EA%B8%B0-2d8a803c3d5c">https://blog.mathpresso.com/msw%EB%A1%9C-api-%EB%AA%A8%ED%82%B9%ED%95%98%EA%B8%B0-2d8a803c3d5c</a>
- 인프런 - 따라하며 배우는 리액트 테스트
