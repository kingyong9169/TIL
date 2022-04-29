---
layout: default
title: pages
parent: Next.js
nav_order: 3
permalink: /next/pages
---

# Pages
Next.js에서 페이지는 `pages`디렉토리에 있는 `.js, .jsx, .ts, or .tsx`파일로부터 내보낸 리액트 컴포넌트이다. 각 페이지는 파일 이름에의 라우트와 연관되어 있다.

## 동적 라우트와 페이지
Next.js는 동적 라우트로 페이지를 지원한다. 예시로, `pages/posts/[id].js`로 불리는 파일을 생성하면 `posts/1, posts/2`와 같이 접근할 수 있다. [동적 라우팅](https://nextjs.org/docs/routing/dynamic-routes)

## Pre-rendering
기본적으로, `Next.js`는 모든 페이지를 사전 렌더링한다. `Next.js`는 클라이언트 측 JS에 의해 모든 작업을 수행하는 대신에 각 페이지에 대해 미리 `HTML`을 생성한다. 사전 렌더링은 더 나은 성능과 SEO를 가져올 수 있다.

생성된 각 `HTML`은 해당 페이지에 필요한 최소한의 JS코드와 연결된다. 브라우저에서 페이지를 로드하면 해당 JS 코드가 실행되고 페이지가 완전히 대화식으로 만들어진다.(이 프로세스는 `hydraton`이라고 불린다.)

## 두가지 형태의 Pre-rendering
이 둘은 페이지에 대한 `HTML`을 생성할 때 차이점이 존재한다.
- [Static Generation(추천)](https://nextjs.org/docs/basic-features/pages#static-generation-recommended): `HTML`이 빌드 시간에 생성되고 각 요청에서 재사용될 것이다.
- [Server-sice Rendering](https://nextjs.org/docs/basic-features/pages#server-side-rendering): `HTML`은 각 요청에서 생성된다.

중요하게도, `Next.js`를 사용하면 각 페이지에 사용할 `Pre-rendering` 양식을 선택할 수 있다. 대부분의 페이지에는 `Static Generation`을 사용하고 다른 페이지에는 `SSR`을 사용하여 "하이브리드" `Next.js` 앱을 만들 수 있다.

`Next.js`에서는 퍼포먼스를 이유로 `SSR`보다는 `Static Generation` 사용을 추천하고 있다. 정적으로 생성된 페이지는 성능 향상을 위한 추가 구성 없이 `CDN`에서 캐시할 수 있다. 그러나 어떤 경우에는 `SSR`이 유일한 옵션일 수 있다.

> CDN<br>


`SG`또는 `SSR`과 함께 `CSR`을 사용할 수도 있다. 즉, 페이지의 일부는 클라이언트 측 JS로 완전히 렌더링될 수 있다. [Data Fetching](https://nextjs.org/docs/basic-features/data-fetching/client-side)참고

## Static Generation(추천)
페이지가 **Static Generation**를 사용하면, 페이지 `HTML`은 빌드 시간에 생성된다. 이것은 프로덕션 환경에서 `next build`를 실행할 때 페이지 `HTML`이 생성된다. `HTML`은 각 요청에서 재사용된다. `CDN`에서 캐시할 수 있다.

Next.js에서는 **데이터가 있거나 없는 페이지**를 정적으로 생성할 수 있다.

### 데이터 없는 Static Generation
기본적으로 `Next.js`는 데이터를 가져오지 않고 정적 생성을 사용하여 페이지를 미리 렌더링한다.
``` js
function About() {
  return <div>About</div>
}

export default About
```
이 페이지는 미리 렌더링할 외부 데이터를 가져올 필요가 없다. 이와 같은 경우 `Next.js`는 빌드 시 페이지당 하나의 `HTML` 파일을 생성한다.

### 데이터를 사용한 Static Generation
일부 페이지는 `Pre-rendering`을 위해 외부 데이터를 가져와야 합니다.
1. 페이지 콘텐츠는 외부 데이터에 따라 다르다. `getStaticProps`를 사용한다.
2. 페이지 경로는 외부 데이터에 따라 다르다. `getStaticPaths`를 사용한다.(일반적으로 `getStaticProps`에 추가하여)

1. 시나리오 1 : 페이지 콘텐츠는 외부 데이터에 의존할 경우
예) 블로그 페이지는 `CMS`(콘텐츠 관리 시스템)에서 블로그 게시물 목록을 가져와야 할 수 있습니다.

``` js
// 페이지가 사전 렌더링 될 수 있기 전에
// API 엔드포인트를 호출함으로써 posts를 fetch해야 한다.
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

export default Blog
```

`Pre-rendering`에서 데이터를 가져오기 위해 동일한 파일에서 `getStaticProps`불리는 `async`함수를 `export`하는 것을 허용합니다. 이 함수는 빌드 시 호출되며 `Pre-rendering` 시 페이지의 `props`에 가져온 데이터를 전달할 수 있습니다.

``` js
function Blog({ posts }) {
  // Render posts...
}

// 빌드 시 호출
export async function getStaticProps() {
  // posts를 가져오기 위해 외부 API 엔드포인트를 호출
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // 빌드 시 prop으로써 posts를 받을 것이다.
  return {
    props: {
      posts,
    },
  }
}

export default Blog
```

2. 시나리오 2 : 페이지 경로가 외부 데이터에 의존할 경우
`Next.js`는 동적 라우트로 페이지를 생성하도록 허용합니다.[동적 라우팅](#동적-라우트와-페이지)

그러나, 우리가 빌드시 `pre-render`를 원하는 id는 외부 데이터에 의존한다.<br>
DB에 하나의 블로그 게시물`(id: 1)`만 추가한 상황에서 `post/1`이 빌드 시 사전 렌더링을 원하는 상황이다. 마찬가지로 두 번째 게시물을 추가할 수 있고 그런 다음 사전 렌더링도 원할 것이다.

이를 처리하기 위해 동적 페이지로부터 `getStaticProps`라고 불리는 `async`함수를 `export`할 수 있다. 이 함수는 빌드 시 호출되며 우리가 사전 렌더링되기 원하는 `path`를 구체화해준다.

``` js
// 이 함수는 빌드 시 호출된다.
export async function getStaticPaths() {
  // posts를 가져오기 위해 외부 API 엔드포인트를 호출
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // post에 기반한 우리가 원하는 pre-render path를 가져온다.
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // 빌드 시 이 path를 pre-render할 것이다.
  // { fallback: false } 다른 라우트가 404여야 함을 의미한다.
  return { paths, fallback: false }
}
```

또한, `pages/post/[id].js`, 
이를 사용 하여 게시물에 대한 데이터를 가져와 페이지를 사전 렌더링하는 데 사용할 수 있도록 내보내야 합니다

### Static Generation을 사용하는 시기
페이지를 한 번 만들면 `CDN`에서 제공받을 수 있으므로 모든 요청에 대해 서버가 페이지를 렌더링하는 것보다 훨씬 빠르기 때문에 가능하면 정적 생성을 사용하는 것이 좋다.

사용자의 요청에 앞서 이 페이지를 미리 렌더링할 수 있다면 정적 생성을 선택해야 한다.

반면 사용자의 요청에 앞서 이 페이지를 미리 렌더링할 수 없다면 좋은 생각이 아니다. 페이지에 자주 업데이트되는 데이터가 표시되고 모든 요청에 따라 페이지 콘텐츠가 변경될 수 있다.

이런 경우에는
- `CSR`과 함께 정적 생성: 페이지의 일부 `Pre-rendering`을 건너뛴 다음 클라이언트 측 JS를 사용하여 채울 수 있다.[Data Fetching Document](https://nextjs.org/docs/basic-features/data-fetching/client-side)
- `SSR`과 함께 정적 생성: `Next.js`는 각 요청에서 페이지를 `Pre-rendering`한다. 페이지를 `CDN`으로 캐시할 수 없기 때문에 속도가 느려지지만 `Pre-rendering`된 페이지는 항상 최신 상태다.

## Server Side Rendering
> SSR또는 "동적 렌더링"이라고도 한다.

페이지에 대해 SSR을 사용하려면 `getServerSideProps`라는 `async`함수가 필요하다. 이 함수는 모든 요청에 대해 서버에서 호출된다.

페이지에서 자주 업데이트되는 데이터(외부 API에서 가져옴)를 `Pre-rendering`해야 한다고 가정했을 때, 데이터를 가져와서 전달할 수 있는 `getServerSideProps`를 사용하면 된다.

``` js
function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // props로 데이터 넘기기
  return { props: { data } }
}

export default Page
```

`getStaticProps`와 비슷하지만 빌드 시간이 아니라 모든 요청에 대해 실행된다는 것이 차이점이다.
