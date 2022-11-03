---
layout: default
title: SSG를 사용하면서 인증하는 방법
parent: Next.js
nav_order: 9
permalink: /next/ssg_auth
---

# SSG를 사용하면서 인증하는 방법

## 문제 발생
소마 프로젝트 진행 중 페이지 진입 시 사용자 인증을 받아야 하는 경우가 생겼습니다. 상품을 업로드할 때, 사용자가 인증돼야 상품을 작성할 수 있도록 해야하기 때문입니다. 여기서 반드시 해결해야 할 문제! 현재 서비스에서 상품 업로드 페이지에서는 **스타일, 컬러, 사이즈, 핏, 기장, 카테고리, 오염 및 손상, 체형**이라는 총 8가지의 api를 호출해야 합니다. 이를 사용자가 페이지에 접근할 때마다 호출하는 것은 클라이언트, 서버 모두 리소스 낭비가 발생합니다. 여기서 가장 좋은 솔루션은 **ISR**입니다. SSG를 사용하여 빌드 시 최초 한 번만 api를 호출하고 ISR주기(일주일)를 설정하여 빌드하지 않고 자동으로 갱신하도록 했습니다.

한편 서버에서는 위 데이터를 호출할 때, 사용자의 인증 검사를 거친 후 통과해야만 데이터를 보내주었습니다. 그리하여 인증 검사를 통과하지 않는 경우 redirect를 위해 `withGetServerSideProps`라는 HOC를 활용하여 서버 사이드에서 오류가 발생했을 때, `redirect`를 리턴하도록 했습니다. 하지만 아뿔싸.. 빌드가 되지 않습니다.. `Error: 'redirect' can not be returned from getStaticProps during prerendering`라는 오류가 나타납니다.. 분명 공식 문서에는 `redirect`를 리턴할 수 있다고 하는데..? [공식 문서 이슈](https://github.com/vercel/next.js/discussions/11346)를 포함해 아무리 찾아봐도 서버 사이드에서 해결할 수 있는 좋은 솔루션이 없어 보였습니다.. **아 서버사이드에서 해결하고 싶은데..** 그리하여 SSG와 인증 모두를 해결할 방안을 떠올려야 했습니다. 하지만 빌드 과정에서 한 번 실행하는데 매번 인증 검사가 될리가..? 당연한 것이었다고 생각했습니다.

## 문제 해결 방안
위에서 언급한 문제를 해결하기 위해 인증과 SSG를 절대 포기할 순 없습니다. 결론부터 얘기하면 사용자가 페이지에 진입했을 때, 화면을 보여주기 전에 인증을 진행하는 것입니다. 즉, `CSR로 해결하는 것이죠.`(당연한 얘기 같네요..ㅎㅎ) 그리하여 `useLayoutEffect`가 가장 먼저 떠올랐습니다. 이 훅은 컴포넌트 렌더링 이후 페인트 전에 실행하는 이펙트 함수로 `useEffect`와 다른점은 페인트 전후에 실행하는지 여부에 따라 달라집니다. 사용자에게 깜박거리는 UX를 보여주지 않기 위해 `useLayoutEffect`를 사용하기로 했습니다. 하지만 예상과 달리 화면이 깜박입니다..?

<video controls width="250">
    <source src="https://user-images.githubusercontent.com/62797441/199818302-616b9fbd-c9b3-4800-af79-500a46cfbe35.mov"
            type="video/mp4">
</video>

영상을 보면 페이지가 잠깐 보이고 로그인 페이지로 이동합니다. 또한, 아래와 같은 오류가 발생합니다.

<img src="https://user-images.githubusercontent.com/62797441/199818249-b34880be-d05c-4d43-9768-1ff17c930420.png" width=600 />

`useLayoutEffect는 페인트 전에 실행되기 때문에 서버에서 렌더되는 화면과 클라이언트에서 렌더되는 화면이 다를 수 있다. 따라서 useLayoutEffect는 오직 클라이언트 사이드에서만 실행되어야 한다`는 경고 메세지입니다.

그리하여 아래 해결 방안 링크를 따라가보면 다음과 같은 내용이 나옵니다.

1. useEffect 사용하는 방법

``` tsx
function MyComponent() {
  useEffect(() => {
    // ...
  });
}
```
하지만 요구사항을 충족할 수 없습니다.

2. 해당 컴포넌트를 lazy하게 로드하는 방법

``` tsx
function Parent() {
  const [showChild, setShowChild] = useState(false);

  // 클라이언트 사이드의 hydration 이후에 보여주기
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  return <Child {...props} />;
}

function Child(props) {
  useLayoutEffect(() => {
    // ...
  });
}
```

이 방법이면 요구사항을 충족할 수 있습니다.

3. [useIsomorphicLayoutEffect](https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect)훅을 만들어 사용하는 방법

``` tsx
import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
```

서버일 경우 `useLayoutEffect`를 ``useEffect로` 변경하는 방법입니다. 현재 굳이 사용할 필요가 없어 보입니다.

그리하여 2번 방법을 사용하기로 결정했습니다.

## 해결하기
저는 `React-Query`를 사용했습니다. 그리하여 이를 활용했습니다.

``` tsx
function Upload() {
  const { isSuccess } = useAuthTest();

  ...

  if (isSuccess)
    return <UploadTemplate {...{ id: '-1', states, isUpdate: false }} />;
  return <Loading style={{ height: 'calc(var(--vh, 1vh) * 100)' }} />;
}
```
코드는 다음과 같습니다. `useAuthTest`훅을 통해 사용자 토큰을 서버로부터 인증합니다. 인증이 성공이면 사용자에게 UI를 보여줍니다. 실패일 때, 로그인 페이지로 이동해야 하는데 이는 훅 내부에 `onError` 옵션에 넣어주었습니다. 컴포넌트에서는 최대한 성공 상태를 선언적으로 관리하고 싶었습니다.

<video controls width="250">
    <source src="https://user-images.githubusercontent.com/62797441/199822216-fe3f65b9-d6cf-446f-8c64-9d3154794c98.mov"
            type="video/mp4">
</video>

이렇게 해결할 수 있지만 아쉬운 점이 있습니다. 사용자의 눈을 속일 수는 있지만 인증되지 않았을 때에도 next 서버로부터 데이터를 불러오기에 불필요한 리소스를 소모하게 됩니다. 하지만 현재로써는 요구사항을 만족할 수 있는 가장 적합한 방법이라 생각했습니다. 추후에 개선하고 싶습니다.(Next.js에서 만들어주길..)

SSG가 반드시 필요한 나머지 preference, 상품 수정 페이지도 마찬가지로 해결하려 합니다.
