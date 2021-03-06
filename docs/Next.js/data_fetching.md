---
layout: default
title: 데이터 가져오기
parent: Next.js
nav_order: 4
permalink: /next/data_fetching
---

# getServerSideProps
페이지에서 `getServerSideProps(SSR)`함수를 export하면 `Next.js`는 `getServerSideProps`에 의해 반환되는 데이터를 사용하여 각 요청에 페이지를 `pre-render`합니다.

## getServerSideProps가 실행되는 시기
1. 서버 측에서만 실행되고 브라우저에서는 실행되지 않는다.
- 이 페이지를 직접 요청하면 `getServerSideProps`요청 시 실행되며 이 페이지는 반환된 `props`로 미리 렌더링된다.
- `next/link` or `next/router`를 통해 클라이언트 측 페이지 전환을 요청할 시 `Next.js`는 `getServerSideProps`를 실행하여 서버에 API 요청을 보낸다.

2. `getServerSideProps`는 페이지에서만 내보낼 수 있다.
3. `getServerSideProps`는 독립 실행형 기능으로 내보내야 한다. 페이지 구성 요소의 속성으로 추가하면 작동하지 않는다.

## 언제 getServerSideProps를 사용해야 할까?
데이터를 가져와야만 하는 페이지를 렌더링해야 하는 경우에만 사용해야 한다. `getServerSideProps`를 사용하는 페이지는 요청 시 서버 측에서 렌더링될 것이고 [cache-control헤더가 구성된](https://nextjs.org/docs/going-to-production#caching) 경우에만 캐시될 것이다.

요청하는 동안 데이터를 렌더링할 필요가 없다면 [CSR](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#fetching-data-on-the-client-side)혹은 `getStaticProps`를 사용하면 된다.

## getServerSideProps또는 API 경로(이해가 안됨)
서버에서 데이터를 가져오고 싶을 때 [API 경로](https://nextjs.org/docs/api-routes/introduction)에 도달하고 `getServerSideProps`에서 해당 API 경로를 호출하고 싶을 수 있다. 이는 서버에서 실행되는 API 경로, `getServerSideProps` 둘 다로 인해 추가 요청이 발생하기 때문에 불필요하고 비효율적인 접근 방식이다.

예를 들자면, API 경로는 CMS에서 일부 데이터를 가져오는 데 사용된다. 그런 다음 해당 API 경로가 `getServerSideProps`에서 직접 호출되며 이렇게 하면 추가 호출이 발생하여 성능이 저하된다. 대신 API 경로 내에서 사용되는 로직을 `getServerSideProps`로 직접 가져온다. 이는 `getServerSideProps`내부에서 직접 CMS, DB, 기타 API를 호출하는 것을 의미할 수 있다.

## 클라이언트 측에서 데이터 가져오기
페이지에 자주 업데이트되는 데이터가 포함되어 있고 그 데이터를 pre-render할 필요가 없다면 [클라이언트 측](https://nextjs.org/docs/basic-features/data-fetching/client-side)에서 데이터를 가져올 수 있습니다.
- 먼저 데이터가 없는 페이지를 즉시 표시합니다. 페이지의 일부는 정적 생성을 사용하여 미리 렌더링할 수 있습니다. 누락된 데이터에 대한 로드 상태를 표시할 수 있습니다.
- 그런 다음 클라이언트 측에서 데이터를 가져와 준비가 되면 표시합니다.

## getServerSideProps가 오류 페이지를 렌더링하나요?
`getServerSideProps`내부에 오류가 발생하면 `pages/500.js`파일이 표시됩니다. 개발 중에는 이 파일이 사용되지 않고 대신 개발 오버레이가 표시됩니다.

# getStaticPaths
페이지에 `dynamic route`가 있고 `getStaticProps`를 사용하는 경우 정적으로 생성할 경로 목록을 정의해야 합니다. 동적 경로를 사용하는 페이지에서 `getStaticPaths`함수를 내보낼 때 Next.js에서 지정한 모든 경로를 정적으로 `pre-render`합니다.
`getStaticPaths`는 반드시 `getStaticProps`와 함께 사용되며 `getServerSideProps`와 함께 사용하면 안됩니다.

## 언제 getStaticProps를 사용해야 할까?
동적 경로를 사용하고 다음을 사용하는 페이지를 정적으로 `pre-render`하는 경우 `getStaticProps`를 사용해야 합니다.
- 헤드리스 CMS에서 가져오는 경우
- DB에서 가져오는 경우
- 파일 시스템에서 가져오는 경우
- 데이터를 공개적으로 캐시할 수 있을 때
- 페이지는 `pre-rendering`(SEO)되어야 하며 매우 빨라야 하는 경우, `getStaticProps`는 `HTML`과 `json`파일을 생성한다. 성능을 위해 둘 다 CDN에 의해 캐시될 수 있다.

## 언제 getStaticPaths가 실행될까?
`getStaticPaths`는 프로덕션 환경에서 빌드하는 동안에만 실행되며 런타임에는 호출되지 않는다. 클라이언트 측 번들 파일에서 `getStaticPaths`코드가 제거 되었음을 확인할 수 있다.
- `getStaticProps`는 빌드 중에 반환된 모든 `paths`에 대해 `next build`중에 실행된다.
- `getStaticProps`는 `fallback: true`를 사용할 때, 백그라운드에서 실행된다.
- `getStaticProps`는 `fallback: blocking`을 사용할 때 최초 렌더링 이전에 호출된다.

한 가지 알아둘 점은 개뱔 중인 모든 요청에 대해서는 호출된다.

## 어디서 getStaticPaths를 사용할 수 있을까?
`getStaticPaths`는 `getStaticProps`도 사용하는 동적 경로에서만 내보낼 수 있다. `components`와 같이 페이지가 아닌 파일에서는 내보낼 수 없다.

# getStaticProps
페이지에서 `getStaticProps`(SSG)라는 함수를 내보내는 경우 Next.js는 `getStaticProps`에 의해 반환되는 `props`를 사용하여 빌드 시간에 페이지를 `pre-render`합니다.

## getStaticProps를 언제 사용하나요?
- 페이지를 렌더링하기 위해 필요한 데이터가 유저의 요청에 앞서 빌드 시 사용할 수 있다.
- 데이터는 헤드리스 CMS에서 가져온다.
- 데이터를 공개적으로 캐시할 수 있다.
- 페이지가 pre-rendering되어야 하고 매우 빨라야 하는 경우 - `getStaticProps`는 `HTML`와 `json`파일을 생성한다. 성능을 위해 둘 다 CDN에 의해 캐시될 수 있다.

## getStaticProps는 언제 실행될까?
`getStaticProps`는 항상 서버에서 실행되고 클라이언트에서는 실행되지 않습니다.
- `getStaticProps`는 `next build`동안 항상 실행한다.
- `getStaticProps`는 `revalidate`를 사용할 때 백그라운드에서 실행된다.
- `getStaticProps`는 [unstable_revalidate](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation-beta)를 사용할 때 백그라운드에서 수요에 맞게 실행된다.

증분적 정적 재생성과 함께 결합하면, `getStaticProps`는 오래된 페이지가 재검증되는 동안 백그라운드에서 실행되고 새 페이지가 브라우저가 제공된다.

`getStaticProps`는 정적 HTML을 생성하므로 들아오는 요청(예: 쿼리 매개변수 또는 http 헤더)에 액세스할 수 없습니다. 만약 페이지의 요청에 액세스가 필요하다면 `getStaticProps`에 추가적으로 미들웨어를 사용하는 것을 고려하면 된다.

## 직접적으로 서버 사이드 코드 쓰기
``getStaticProps``는 서버 측에서만 실행되므로 클라이언트 측에서는 절대 실행되지 않는다. 브라우저용 JS번들에도 포함되지 않으므로 브라우저로 보내지 않고 직접 DB 쿼리를 작성할 수 있다.

이것은 `getStaticProps`로부터 API 라우트를 가져오는 것 대신에 `getStaticProps`에서 직접적으로 서버 사이드 코드를 작성할 수 있습니다.

API 라우트는 CMS로부터 데이터를 가져오는데 사용된다. API 라우트는 `getStaticProps`로부터 직접적으로 호출됩니다. 이것은 추가적인 요청을 발생시켜 성능이 저하된다. 대신,`lib/`디렉토리를 사용하여 CMS에서 데이터를 가져오는 로직을 공유할 수 있다. 그런 다음 `getStaticProps`와 함께 공유할 수 있다.

## HTML과 JSON을 모두 정적으로 생성
`getStaticProps`가 포함된 페이지가 빌드 시 미리 렌더링되면 페이지 HTML 파일 외에 Next.js가 `getStaticProps` 실행 결과를 담은 JSON파일을 생성합니다.

JSON 파일은 `next/link` or `next/router`를 통한 클라이언트 사이드 라우팅에 사용된다. `getStaticProps`를 사용하여 미리 렌더링된 페이지로 이동하면 Next.js는 JSON파일을 가져와 페이지 컴포넌트에 대한 props로 사용한다. 즉, 내보낸 JSON만 사용되므로 클라이언트 측 페이지 전환이 `getStaticProps`을 호출되지 않는다.

# 질문사항
MPA + SPA
hydrate 과정
fallback

json을 저장하는 이유: json파일만 가져와서 JS에 넣어서 렌더링한다.

on-demand revalidation은 캐시를 지운다.

매번 요청이 올 때마다 SSR하면 SEO가 어떻게 오냐? 항상 Search 엔진이 항상 HTML을 받는다. 완성된 HTML을 줘버리니까 SEO가 된다.

ISR
res를 제대로 못 받아 왔을 시, 이전 렌더링을 그대로 사용

기본으로 `_app.js`이다. 

styled-jsx 쓰는 이유

귀찮게 해라. 제안을 하는 방안. 과제 완성도를 준다. 좋은 인상을 준다.