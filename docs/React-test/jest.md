---
layout: default
title: jest
parent: React test
nav_order: 2
permalink: /react_test/jest
---

# Jest에 대하여
페이스북에서 만든 테스팅 프레임워크입니다.
최소한의 설정으로 동작하며 테스트케이스를 만들어서 어플리케이션 코드가 잘 돌아가는지 확인해줍니다.
유닛(단위) 테스트를 위해서 이용합니다.

## Jest 시작하기
CRA를 하면 별도의 설치 없이 진행 가능
1. Jest 설치: `npm install jest --save-dev`
2. test 스크립트 변경: `"test": "jest"` or `jest --watchALl`
3. 테스트 작성할 폴더 및 파일 기본 구조 생성
- 유닛 테스트: 파일 이름.test.js
- 통합 테스트: 파일 이름.test.init.js

<details>
    <summary>Jest가 Test 파일을 찾는 방법</summary>
    <ul>
        <li>{filename}.test.js</li>
        <li>{filename}.spec.js</li>
        <li>tests 폴더를 모든 폴더 안에 만든다.</li>
    </ul>
</details>

## Jest 파일 구조 & 사용법
describe
- it(test)
- it(test)
- it(test)
...

와 같은 구조로

- describe: 여러 관련 테스트를 그룹화하는 블록을 만듭니다.
- it(test): 개별 테스트를 수행하는 곳으로 각 테스트를 작은 문장처럼 설명합니다.

<img width="795" alt="Jest 파일 구조" src="https://user-images.githubusercontent.com/62797441/153643973-f7d34e63-ef16-4156-9045-4df3047a031b.png">

- expect: expect 함수는 말그대로 예측한다는 뜻으로 값을 테스트할 때마다 사용됩니다. expect 함수 혼자서는 거의 사용되지 않으며 matcher와 함께 사용됩니다.
- matcher: 다른 방법으로 값을 테스트 하도록 matcher를 사용합니다.

## RTL 주요 API 함수
1. render: DOM에 컴포넌트를 렌더링하는 함수, 인자로 렌더링할 React 컴포넌트가 들어감.
- RTL에서 제공하는 쿼리 함수와 기타 유틸 함수를 담고 있는 객체를 리턴(비구조화 문법으로 원하는 쿼리 함수만 얻어올 수 있다. but 소스 코드가 복잡해지면 비추천. 대신에 screen 객체를 사용하기. 왜냐하면 사용해야 할 쿼리가 많아질수록 코드가 복잡해질 수 있음)
- matcher 함수는 `jest-dom` 라이브러리에서 사용할 수 있음.

## RTL 쿼리 함수
쿼리는 **페이지에서 요소를 찾기 위해** TL이 제공하는 방법입니다. 여러 유형의 쿼리(`get`, `find`, `query`)가 있습니다. 이들 간의 **차이점**은 요소가 발견되지 않으면 쿼리에서 오류가 발생하는지 또는 Promise를 반환하고 다시 시도하는지 여부입니다. 선택하는 페이지 콘텐츠에 따라 다른 쿼리가 다소 적절할 수 있습니다.

1. `getBy...`
쿼리에 대해 일치하는 노드를 반환하고 일치하는 요소가 없거나 둘 이상의 일치가 발견되면 설명 **오류를 발생**시킵니다.(둘 이상의 요소가 예상되는 경우에는 `getAllBy` 사용하기.)

2. `queryBy...`
쿼리에 대해 일치하는 노드를 반환하고 일치하는 **요소가 없으면 null**을 반환합니다. 이것은 존재하지 않는 요소를 assertion하는 데 유용합니다. 둘 이상의 일치 항목이 발견되면 오류가 발생합니다.(확인된 경우에는 `queryAllBy` 사용하기.)

3. `findBy...(getBy + waitFor)`
주어진 쿼리와 일치하는 요소가 발견되면 `Promise`(fulfilled)를 반환합니다. 요소가 발견되지 않거나 기본 제한 시간인 1000ms 후에 둘 이상의 요소가 발견되면 Promise가 거부(rejected)됩니다. 둘 이상의 요소를 찾아야 하는 경우 `findAllBy`를 사용합니다.
- waitFor: 일정 시간 동안 기다려야 할 때 waitFor을 사용하여 expect가 통과할 때까지 기다릴 수 있습니다.

## 쿼리 사용 우선 순위
- 모든 사람이 접근할 수 있는 쿼리(마우스가 없거나 등)
  - getByRole
  - getByLabelText
  - getByPlaceHolderText
  - getByText
  - getByDisplayValue
- 테스트 ID(id는 개발자만 볼 수 있음. role, text를 사용할 수 없을 때 사용하기.)
  - getByTestId

## 이벤트 테스트하기
**FireEvent API**
유저가 발생시키는 액션(이벤트)에 대한 테스트를 해야하는 경우 사용합니다.

but userEvent API를 사용하는 것이 더 좋습니다.

**userEvent API**
fireEvent를 사용하여 만들어졌습니다. userEvent 내부 코드를 보면 fireEvent를 사용하면서 엘리먼트의 타입에 따라 Label을 클릭했을 때, checkbox, radio를 클릭했을 때 등 해당 엘리먼트 타입에 맞는 더욱 적절한 반응을 보여줍니다.

예를 들어, fireEvent로 버튼을 클릭하면 `fireEvent.click(button)` 버튼이 focus되지 않습니다. 하지만 userEvent로 클릭하면 `userEvent.click(button)` 버튼이 focus됩니다. 테스팅을 할 때는 유저가 실제로 사용하는 것처럼 하는 것이 더 좋습니다. 따라서 유저가 보기에 실제 버튼을 클릭하는 행위가 더 잘 표현되므로 userEvent를 사용하는 것이 더 추천되는 방법입니다.