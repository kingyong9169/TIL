---
layout: default
title: 스크립트 컴포넌트
parent: Next.js
nav_order: 8
permalink: /next/script_component
---

# 스크립트 컴포넌트
Next.js 스크립트 컴포넌트 `next/script`은 `HTML` `<script>`요소의 확장이다. 이를 통해 개발자는 애플리케이션의 모든 위치, `next/head` 외부에서 서드파티 스크립트의 로드 우선 순위를 설정할 수 있으므로 개발자 시간을 절약하면서 로드 성능을 향상시킬 수 있다.
``` js
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script src="https://www.google-analytics.com/analytics.js" />
    </>
  )
}
```

## 개요
[참고하면 좋은 웹 성능 최적화 블로그](https://admin.joyfuljoeunlee.dev/web-performance-optimization-1/)
웹 사이트는 종종 서드파티 스크립트를 사용하여 분석, 광고, 고객 지원 위젯 및 동의 관리와 같은 다양한 유형의 기능을 사이트에 포함한다. but 이로 인해 사용자와 개발자 경험 모두에 영향을 미치는 문제가 발생할 수 있다.
- 일부 서드파티 스크립트는 로드 성능이 높으며 특히 렌더링을 차단하고 페이지 콘텐츠 로드가 지연되는 경우 사용자 경험을 저하시킬 수 있다.
- 개발자는 최적의 로딩을 보장하기 위해 애플리케이션에서 서드파티 스크립트를 배치할 위치를 결정하는 데 종종 어려움을 겪는다.

스크립트 컴포넌트를 사용하면 개발자가 로딩 전략을 최적화하면서 서드파티 스크립트를 애플리케이션의 어디에나 쉽게 배치할 수 있다.

## 전략
`next/script`를 사용하면 전략 속성을 사용하여 서드파티 스크립트를 로드할 시기를 결정힌다.
``` js
<Script src="https://connect.facebook.net/en_US/sdk.js" strategy="lazyOnload" />
```
네 가지 로딩 전략
- beforeInteractive: 페이지가 대화형이 되기 전에 로드
- afterInteractive(디폴트): 페이지가 대화형이 된 직후 로드
- lazyOnload: 유휴 시간 동안 로드
- worker: (실험적)웹 워커에 로드

### beforeInteractive
`beforeInteractive` 전략으로 로드되는 스크립트는 서버에서 초기 `HTML`로 주입되고 자체 번들 `JavaScript`가 실행되기 전에 실행된다. 이 전략은 페이지가 대화형이 되기 전에 가져와 실행해야 하는 중요한 스크립트에 사용해야 한다. 이 전략은 `_document.js` 내에서만 작동하며 전체 사이트에 필요한 스크립트를 로드하도록 설계되었다(즉, 애플리케이션의 페이지가 서버 측에서 로드되었을 때 스크립트가 로드됨).

`beforeInteractive`가 `\_document.js` 내부에서만 작동하도록 설계된 이유는 스트리밍 및 `Suspense` 기능을 지원하기 위해서 이다. `_document` 외부에서는 `beforeInteractive` 스크립트의 타이밍이나 순서를 보장할 수 없다.

``` js
// _document.js
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js"
          strategy="beforeInteractive"
        ></Script>
      </body>
    </Html>
  )
}
```

이 전략으로 가능한 빨리 로드해야 하는 스크립트의 예는 다음과 같다.
- 봇 감지기
- 쿠키 동의 관리자

### afterInteractive
`afterInteractive` 전략을 사용하는 스크립트는 `Client-side`에서 주입되며 `Next.js`가 페이지를 `hydrate`한 후에 실행됩니다. 이 전략은 가능한 한 빨리 로드할 필요가 없고 페이지가 대화형이 된 후 즉시 가져와 실행할 수 있는 스크립트에 사용해야 한다.

> **hydrate**? Server Side 에서 렌더링 된, 정적 페이지와 번들링된 JS파일을 클라이언트에게 보낸 뒤 클라이언트 단에서 HTML 코드와 JS 코드를 서로 매칭시키는 과정.<br><br>현재 클라이언트가 받은 웹 페이지는 단순한 HTML이고 자바스크립트 요소들이 하나도 없는 상태. 웹화면을 보여주고 있지만 특정 JS 모듈 뿐 아니라 단순 클릭과 같은 이벤트 리스너들 또한 적용되어 있지 않은 상태.<br><br>여기서 전송받은 JS 코드들이 이전에 보내진 `HTML DOM` 요소 위에서 한번 더 렌더링 하게 되면서 각각 자기 자리를 찾아가며 매칭된다.

``` js
<Script
  strategy="afterInteractive"
  dangerouslySetInnerHTML={
    __html: `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', 'GTM-XXXXXX');
  `,
  }
/>
```

페이지가 대화형이 된 후 즉시 로드할 수 있는 좋은 스크립트의 예는 다음과 같다.
- 태그 관리자
- 분석

### lazyOnload
`lazyOnload` 전략을 사용하는 스크립트는 모든 리소스를 가져온 후 유휴 시간 동안 늦게 로드된다. 이 전략은 페이지가 대화형이 되기 전이나 직후에 로드할 필요가 없는 백그라운드 또는 낮은 우선순위 스크립트에 사용해야 한다.

``` js
<Script src="https://connect.facebook.net/en_US/sdk.js" strategy="lazyOnload" />
```

즉시 로드할 필요가 없고 지연 로드될 수 있는 스크립트의 예는 다음과 같다.
- 채팅 지원 플러그인
- 소셜 미디어 위젯

## 웹 워커에 스크립트 오프로드하기(실험)
> 참고: 워커 전략은 아직 안정적이지 않으며 애플리케이션에서 예기치 않은 문제를 일으킬 수 있다. 주의해서 사용할 것.

> **웹 워커(Web worker)**는 스크립트 연산을 웹 애플리케이션의 주 실행 스레드와 분리된 별도의 백그라운드 스레드에서 실행할 수 있는 기술. 웹 워커를 통해 무거운 작업을 분리된 스레드에서 처리하면 주 스레드(보통 UI 스레드)가 멈추거나 느려지지 않고 동작할 수 있다. 브라우저에서 멀티 스레드를 활용할 수 있다.

> **Partytown**은 리소스 집약적인 스크립트를 메인 스레드에서 웹 워커로 재배치하는 데 도움이 되는 지연 로드 라이브러리. 그 목표는 메인 스레드를 코드 전용으로 지정하고 타사 스크립트를 웹 워커에게 오프로드하여 사이트 속도를 높이는 것.

> **오프로드**? 로딩을 꺼서 부하를 줄인다.

워커 전략을 사용하는 스크립트는 `Partytown`과 함께 웹 워커에서 재배치되어 실행된다. 이렇게 하면 메인 스레드를 애플리케이션 코드의 나머지 부분에 할당하여 사이트의 성능을 향상시킬 수 있다.

이 전략은 아직 실험적이며 `next.config.js`에서 `nextScriptWorkers` 플래그가 활성화된 경우에만 사용할 수 있다.
``` js
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

`Strategy="worker"`를 정의하면 애플리케이션에서 `Partytown`을 자동으로 인스턴스화하고 스크립트를 웹 워커에게 오프로드한다.
``` js
<Script src="https://example.com/analytics.js" strategy="worker" />
```

### 구성
워커 전략이 작동하는 데 추가 구성이 필요하지 않지만 `Partytown`은 디버그 모드 활성화 및 이벤트 및 트리거 전달을 포함하여 일부 설정을 수정하기 위해 구성 개체 사용을 지원한다.

추가 구성 옵션을 추가하려면 사용자 지정 `_document.js`에서 사용되는 `<Head />` 구성 요소 내에 포함할 수 있다.
``` js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          data-partytown-config
          dangerouslySetInnerHTML={{%
            __html: `
              partytown = {
                lib: "/_next/static/~partytown/",
                debug: true
              };
            `,
          %}}
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

`Partytown`의 구성을 수정하려면 다음 조건이 충족되어야 한다.
- `Next.js`에서 사용하는 기본 구성을 덮어쓰려면 `data-partytown-config` 속성을 사용해야 한다.
- `Partytown`의 라이브러리 파일을 별도의 디렉토리에 저장하기로 결정하지 않는 한, `lib: "/_next/static/~partytown/"` 속성 및 값은 `Partytown`이 `Next.js`가 필요한 정적 파일 저장 위치를 ​​알 수 있도록 구성 개체에 포함되어야 한다.

### 인라인 스크립트
인라인 스크립트 또는 외부 파일에서 로드되지 않은 스크립트도 스크립트 컴포넌트에서 지원됩니다. `JavaScript`를 중괄호 안에 넣어 작성할 수 있다.
``` js
<Script id="show-banner" strategy="lazyOnload">
  {`document.getElementById('banner').classList.remove('hidden')`}
</Script>

or

<Script
  id="show-banner"
  dangerouslySetInnerHTML={{%
    __html: `document.getElementById('banner').classList.remove('hidden')`,
  %}}
/>
```
`Next.js`가 스크립트를 추적하고 최적화하려면 인라인 스크립트에 `id` 속성이 필요하다.

### 로드 후 코드 실행(onLoad)
> 참고: `onLoad` 및 `onError`는 모두 `beforeInteractive` 로드 전략과 함께 사용할 수 없다.

일부 서드파티 스크립트에서는 콘텐츠를 인스턴스화하거나 함수를 호출하기 위해 스크립트 로드가 완료된 후 사용자가 `JavaScript` 코드를 실행해야 한다. 로드 전략으로 `afterInteractive` 또는 `lazyOnload`를 사용하여 스크립트를 로드하는 경우 `onLoad` 속성을 사용하여 로드된 후 코드를 실행할 수 있다.
``` js
import { useState } from 'react'
import Script from 'next/script'

export default function Home() {
  const [stripe, setStripe] = useState(null)

  return (
    <>
      <Script
        id="stripe-js"
        src="https://js.stripe.com/v3/"
        onLoad={() => {%
          setStripe({ stripe: window.Stripe('pk_test_12345') })
        %}}
      />
    </>
  )
}
```

때로는 스크립트가 로드되지 않을 때 catch하는 것이 도움이 된다. 이러한 오류는 `onError` 속성으로 처리할 수 있다.
``` js
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script
        id="will-fail"
        src="https://example.com/non-existant-script.js"
        onError={(e) => {%
          console.error('Script failed to load', e)
        %}}
      />
    </>
  )
}
```

### 추가 속성
`nonce` 또는 사용자 정의 데이터 속성과 같이 Script 구성 요소에서 사용하지 않는 `<script>` 요소에 할당할 수 있는 많은 DOM 속성이 있다. 추가 속성을 포함하면 페이지에 출력되는 최적화된 최종 `<script>` 요소에 자동으로 전달된다.
``` js
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script
        src="https://www.google-analytics.com/analytics.js"
        id="analytics"
        nonce="XUENAJFW"
        data-test="analytics"
      />
    </>
  )
}
```
