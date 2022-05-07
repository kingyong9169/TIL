---
layout: default
title: 빠른 새로고침
parent: Next.js
nav_order: 7
permalink: /next/fast_refresh
---

# 빠른 새로고침
React 컴포넌트에 대한 편집 사항에 대한 즉각적인 피드백 제공. 9.4이상의 모든 Next.js 애플리케이션에서 기본적으로 활성화. Next.js 새로 고침이 활성화되면 컴포넌트 상태를 잃지 않고 대부분의 편집 내용이 1초 이내에 표시되어야 한다.

## 작동원리
- React 컴포넌트만 export하는 파일을 편집하는 경우 Fast Refresh는 해당 파일에 대한 코드만 업데이트하고 컴포넌트를 다시 렌더링한다. 스타일, 렌더링 로직, 이벤트 핸들러 또는 이펙트를 포함하여 해당 파일의 모든 것을 편집할 수 있다.
- React 컴포넌트가 아닌 export하는 파일을 편집하는 경우 Fast Refresh은 해당 파일과 파일을 가져오는 다른 파일을 모두 다시 실행한다. 따라서 
- 마지막으로 React 트리 외부의 파일에서 가져온 파일을 편집하는 경우 Fast Refresh은 전체 reload를 수행하는 것으로 대체된다. 예를 들어 컴포넌트도 상수를 내보내고 React가 아닌 유틸리티 파일이 상수를 가져올 수 있다. 이 경우 상수를 별도의 파일로 마이그레이션하고 두 파일로 가져오는 것을 고려할 것. 이렇게 하면 빠른 새로 고침이 다시 활성화됩니다. 다른 경우는 일반적으로 비슷한 방식으로 해결할 수 있습니다.

## 제한사항
Fast Refresh은 편집 중인 컴포넌트에서 로컬 React 상태를 유지하려고 시도하지만 그렇게 하는 것이 안전한 경우에만 가능하다. 다음은 파일을 편집할 때마다 로컬 상태가 재설정되는 몇 가지 이유이다.
- 로컬 상태는 클래스 컴포넌트에 대해 유지되지 않는다(함수 컴포넌트 및 Hook만 상태 유지).
- 편집 중인 파일에는 React 컴포넌트 외에 다른 export가 있을 수 있다.
- 때때로 파일은 HOC(WrappedComponent)와 같이 higher-order-component 호출의 결과를 반환한다. 만약 반환된 컴포넌트가 클래스이면 해당 상태가 재설정된다.
- `export default () => <div />;`과 같은 익명 화살표 함수로 인해 Fast Refresh가 로컬 구성 요소 상태를 유지하지 않는다. `name-default-component codemod(export default function MyComponent())`를 사용할 것.

더 많은 코드베이스가 함수 컴포넌트 및 Hooks로 이동함에 따라 더 많은 경우에 상태가 보존될 것으로 기대할 수 있습니다.

## 팁
- Fast Refresh는 기본적으로 함수 컴포넌트(및 Hooks)에서 React 로컬 상태를 유지한다.
- 상태를 강제로 재설정하고 컴포넌트를 다시 마운트해야 하는 경우가 있다. 예를 들어 마운트 시에만 발생하는 애니메이션을 조정하는 경우 유용할 수 있다. 이렇게 하려면 `@refresh reset`을 편집 중인 파일의 아무 곳에나 추가할 수 있다. 이 지시문은 파일에 대해 로컬이며 편집할 때마다 해당 파일에 정의된 컴포넌트를 다시 마운트하도록 Fast Refresh에 지시한다.
- 개발 중에 편집한 컴포넌트에 console.log 또는 debugger를 넣을 수 있다.

## 빠른 Fast Refresh 및 Hooks
가능한 경우 Fast Refresh는 편집 사이에 컴포넌트의 상태를 유지하려고 시도한다. 특히, useState 및 useRef는 인수 또는 Hook 호출의 순서를 변경하지 않는 한 이전 값을 유지한다.

useEffect, useMemo 및 useCallback과 같은 종속성이 있는 Hook은 Fast Refresh 중에 항상 업데이트된다. Fast Refresh이 발생하는 동안 종속성 목록이 무시된다.

예를 들어, `useMemo(() => x * 2, [x])`를 `useMemo(() => x * 10, [x])`로 편집하면 x(종속성)가 바뀌지 않아도 다시 실행된다. React가 그렇게 하지 않으면 편집 내용이 화면에 반영되지 않는다!

때로는 예기치 않은 결과가 발생할 수 있다. 예를 들어, 종속성 배열이 비어 있는 useEffect라도 Fast Refresh 동안 한 번만 다시 실행된다.
