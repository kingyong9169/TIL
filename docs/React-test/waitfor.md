---
layout: default
title: waitFor 사용하기
parent: React test
nav_order: 4
permalink: /react_test/waitfor
---

# waitFor 사용하기

테스트 코드를 작성하다 보면 `not Wrapped in act..`라는 경고가 발생하는 경우가 있다. 이는 React에서 나오는 경고로 우리가 컴포넌트에 아무것도 일어나지 않을 것으로 예상하고 있을 때, 컴포넌트에 어떤 일이 일어나면 나오는 경고이다. 즉, act는 컴포넌트가 렌더링 혹은 업데이트된다는 것을 알려주는 함수이다.

원래 컴포넌트에서 무언가가 일어난다고 해주려면 `act`라는 함수로 감싸야 한다. but RTL 내부 API에서 `act`를 사용하고 있기 때문에 우리가 따로 `act`를 사용할 필요가 없다.

## 이미 act로 감싸주었는데 왜 에러가 나지?

컴포넌트가 비동기 API 호출을 할 때, 렌더링이나 어떠한 것이 업데이트 되기 전에 테스트가 종료될 때는 따로 `act`로 감싸줘서 컴포넌트가 렌더링 혹은 업데이트된다는 것을 알려줘야 한다. 테스트 코드는 이를 모르기 때문이다. 해결법은 `waitFor` 함수를 사용하는 것이다.

## 예시 코드

```jsx
const firstPageButton = screen.getByRole('button', { name: '첫 페이지로' });
userEvent.click(firstPageButton);

await waitFor(() => {
  screen.getByText('spinbutton', { name: 'America' });
});

// 혹은
await screen.getByText('spinbutton', { name: 'America' });
```

이렇게 하면 `첫 페이지로` 버튼을 누르게 되면 컴포넌트가 업데이트 된다는 것을 테스트 코드에 알려줄 수 있다. 이제 `not Wrapped in act..`라는 경고가 발생하지 않는다.

## 로딩 UI를 제거해야 하는 케이스

```jsx
await waitForElementToBeRemoved(() => screen.getByText('정보를 저장 중입니다.'));
```

이 부분을 넣어주면 로딩 UI가 사라질 때까지 기다려준다. 이렇게 하면 로딩 UI가 사라지기 전에 테스트가 종료되는 것을 방지할 수 있다.

`waitForElementToBeRemoved`는 어떠한 요소(Element)가 DOM에서 사라지는 걸 기다리는 것이다.

## 참고자료
- 인프런 - 따라하며 배우는 리액트 테스트
