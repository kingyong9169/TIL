---
layout: default
title: 폰트 최적화
parent: Next.js
nav_order: 6
permalink: /next/font_optimization
---

# 폰트 최적화 및 정적 파일 제공
v10.2부터 웹 글꼴 최적화가 내장

기본적으로 Next.js는 빌드 시 글꼴 CSS를 자동으로 인라인하여 글꼴 선언을 가져오기 위한 추가 왕복을 제거. 이를 통해 [FCP(First Contentful Paint)](https://web.dev/fcp/) 및 [LCP(Large Contentful Paint)](https://vercel.com/blog/core-web-vitals#largest-contentful-paint)가 개선되었다.
``` html
// Before
<link
  href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
  rel="stylesheet"
/>

// After
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<style data-href="https://fonts.googleapis.com/css2?family=Inter&display=optional">
  @font-face{font-family:'Inter';font-style:normal...
</style>
```

## 폰트 최적화 사용법
Next.js 애플리케이션에 웹 글꼴을 추가하려면 [Custom Document](https://nextjs.org/docs/advanced-features/custom-document) 에 글꼴을 추가할 것.

``` html
<link
    href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
    rel="stylesheet"
    />
```

``` js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```
`next/head`로 글꼴을 추가 하는 것은 특정 페이지에만 적용되고 스트리밍 아키텍처에서는 작동 하지 않기 때문에 권장하지 않는다.

## 폰트 최적화 비활성화
``` js
// next.config.js

module.exports = {
  optimizeFonts: false,
}
```

## 정적 파일 제공
Next.js는 루트 디렉터리에서 호출되는 `public` 폴더 아래에 이미지와 같은 정적 파일을 제공할 수 있다. 기본 URL(/)에서 시작하는 코드에서 public 내부 파일을 참조할 수 있다.

예를 들어, `public/me.png`에 이미지를 추가하면 이미지에 접근할 수 있다.
``` js
import Image from 'next/image'

function Avatar() {
  return <Image src="/me.png" alt="me" width="64" height="64" />
}

export default Avatar
```

이 폴더는 `robots.txt`, `favicon.ico`, `Google Site Verification` 및 기타 정적 파일(.html 포함)에도 유용하다.
