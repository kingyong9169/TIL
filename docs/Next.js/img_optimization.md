---
layout: default
title: 이미지 최적화
parent: Next.js
nav_order: 5
permalink: /next/img_optimization
---

# 이미지 컴포넌트와 이미지 최적화
Next.js 이미지 컴포넌트 `next/image`는 현대 웹용으로 발전된 `HTML <img>`요소의 확장이다. 다양한 빌트인(기본 제공) 성능 최적화가 포함되어 있다. 이 점수는 웹사이트에서 사용자 경험을 측정하는 중요한 척도이며 Google 검색 순위에 반영된다.
- 향상된 성능: 최신 이미지 형식(`.webp`형식)을 사용하여 항상 각 장치에 대해 올바른 크기의 이미지 제공
- 시각적 안정성: 자동으로 누적 레이아웃 이동(CLS) 방지
- 더 빠른 페이지 로드(Lazy Loading): 이미지가 뷰포트에 들어갈 때만 로드되며 선택적인 블러업 자리 표시자와 함께 로드된다.
- 자산 유연성: 원격 서버에 저장된 이미지의 경우에도 주문형 이미지 크기 조정

## 로컬 이미지
동적 임포트, require 금지. import는 빌드 시간에 분석할 수 있도록 정적이어야 한다.

Next.js는 가져온 파일을 기반으로 이미지의 width, height를 자동으로 결정한다. 이 값은 이미지가 로드되는 동안 [누적 레이아웃 이동을 방지](https://nextjs.org/learn/seo/web-performance/cls)하는 데 사용된다. 일반 img 태그에서는 width, height를 지정해 주어야함.

CLS는 사이트의 전반적인 레이아웃 안정성을 측정한 것이다. 페이지가 로드될 때 예기치 않게 레이아웃을 변경하는 사이트는 우발적인 사용자 오류와 주의를 산만하게 한다. DOM에 의해 처음 렌더링된 후 요소가 이동될 때 발생한다. 각 요소의 개별 레이아웃 이동 점수는 예기치 않은 이동이 발생한 경우에만 CLS에 계산된다. 새 요소가 DOM에 추가되거나 기존 요소의 크기가 변경되는 경우 **로드된 요소가 해당 위치를 유지한다면** 레이아웃 이동에 포함되지 않는다.

## 원격 이미지
원격 이미지를 사용하려면 `src`속성이 URL 문자열이어야 하며 이는 상대적, 절대적일 수 있다. 빌드 프로세스 중에 원격 파일에 액세스할 수 없으므로 `width`, `height`, `blurDataURL` props를 수동으로 제공해야 한다.

### placeholder
이미지가 로드되는 동안 사용하는 것. `blur or empty`. 기본값은 `empty`. `blur`일 때, `blurDataURL` 속성이 `placeholder`로 사용될 것이다. 만일 `src`가 정적으로 가져오는 개체이면 자동으로 채워질 것이다. but 동적 이미지의 경우 `blurDataURL` 속성을 제공해야 한다. `empty`일 때, 이미지가 로드되는 동안 어떤 `placeholder`도 없을 것이고 빈 공간만 보일 것이다.

### blurDataURL
이미지가 성공적으로 로드되기 전에 `placeholder` 이미지로 사용할 데이터 URL이다. src와 결합할 때만 적용된다. base64로 인코딩된 이미지여야 한다.

## 도메인
외부 도메인(원격 이미지)으로 부터 이미지를 가져와 이미지 최적화를 하고 싶은 경우, `loader` 기본 설정을 그대로 두고 이미지 `src`에 대한 절대 URL을 입력하면 된다.

악의적인 유저로부터 애플리케이션을 보호하려면 이러한 방식으로 접근하려는 원격 도메인 목록을 정의해야 한다. `next.config.js`파일에 구성된다.
``` js
module.exports = {
  images: {
    domains: ['example.com', 'example2.com'],
  },
}
```

## 로더
`/me.png`라는 원격 이미지에 대한 부분 URL이 제공되는데 이것은 `next/image`의 로더 아키텍처 때문에 가능하다.

URL을 확인하는 데 사용되는 사용자 정의 함수로 image구성 요소에서 로더를 prop으로 설정하면 `next.config.js`에 정의된 기본 로더가 무시된다.

src, width, quality가 주어지면 이미지의 URL 문자열을 반환하는 함수이다.
``` js
import Image from 'next/image'

const myLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}

const MyImage = (props) => {
  return (
    <Image
      loader={myLoader}
      src="me.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

로더는 이미지의 URL을 생성하는 기능이다. 제공된 src에 루트 도메인을 추가하고 다양한 크기의 이미지를 요청하기 위해 여러 URL을 생성한다. 이러한 여러 URL은 자동으로 `srcset` 생성에 사용되므로 사이트 방문자에게 표시 영역에 적합한 크기의 이미지가 제공된다.

Next.js 기본 로더는 내장된 이미지 최적화 API를 사용한다. 이 API는 웹의 모든 위치에서 이미지를 최적화한 다음 Next.js 웹 서버에서 직접 이미지를 제공한다.

## 우선사항
각 페이지의 [LCP(Large Contentful Paint) 요소](https://web.dev/lcp/#what-elements-are-considered)가 될 이미지에 `priority` 속성을 추가해야 한다. 그렇게 하면 Next.js가 로드할 이미지의 우선 순위를 특별히 지정할 수 있으므로 LCP에서 의미 있는 향상으로 이어진다.

true인 경우 이미지가 높은 우선 순위로 미리 로드되는 것으로 간주된다. `priority`를 사용하는 이미지에 대해 lazy loading이 자동으로 비활성화된다.

LCP요소는 일반적으로 페이지의 뷰포트 내에서 볼 수 있는 가장 큰 이미지 또는 텍스트 블록이다. `next dev`를 실행하면 LCP 요소에 `priority`속성이 없는 경우 콘솔 경고가 표시된다. LCP요소로 감지된 모든 이미지에 `priority`속성을 사용해야 한다. 이미지가 스크롤 없이 볼 수 있는 경우에만 사용해야 한다. 기본값은 false이다.

``` js
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src="/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
        priority
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}
```

## 이미지 크기 조정
이미지가 가장 일반적으로 성능을 저하시키는 방법 중 하나는 이미지가 로드될 때 페이지의 다른 요소를 밀어내는 CLS이다. CLS를 피하는 방법은 항상 이미지 크기를 조정하는 것이다. 이를 통해 브라우저는 이미지가 로드되기 전에 이미지를 위한 충분한 공간을 정확하게 예약할 수 있다.
- 정적 가져오기를 사용하여 자동으로 -> 이미지 최적화 API 사용
- width, height 속성을 포함하여 명시적으로
- layout="fill"을 사용하면 암시적으로 이미지가 부모 요소를 채우도록 확장된다.

### 내 이미지의 크기를 모르는 경우
이미지 크기에 대한 지식 없이 소스에서 이미지에 접근하는 경우
1. layout="fill"을 사용
fill레이아웃 모드를 사용하면 상위 요소에 따라 이미지의 크기 조정. css를 사용하여 페이지에 이미지의 상위 요소 공간을 제공한 다음, `fill, contain, cover`로 `objectFit property`를 사용하여 이미지가 해당 공간을 차지하는 방식을 정의하는 것을 고려
2. 이미지 정규화
제어하는 소스에서 이미지를 제공하는 경우 이미지 파이프라인을 수정하여 이미지를 특정 크기로 정규화하는 것이 좋다.
3. API 호출 수정
애플리케이션이 API 호출(예: CMS)을 사용하여 이미지 URL을 검색하는 경우 URL과 함께 이미지 크기를 반환하도록 API 호출을 수정할 수 있다.

## 스타일링
- `className` 사용: DOM 구조 기반 X
- `layout='fill'`상위 요소에 `position: relative`
- `layout='responsive'`상위 요소에 `display: block`: div 요소의 기본값이지만 그렇지 않으면 지정해야 함.

## 구성

### 사용자 지정 이미지 breakpoints
1. 장치 크기
사용자의 예상 장치 너비를 알고 있는 경우 `deviceSizes` 속성을 사용하여 장치 너비 중단점 목록을 지정할 수 있다. `layout="responsive"`, `layout="fill"`일 때, 사용자 장치에 올바른 이미지가 제공되도록 하는 데 사용된다.

기본값
``` js
module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
```

2. 이미지 크기
`next.config.js`의 `images.imageSizes`파일의 속성을 사용하여 이미지 너비 목록을 지정할 수 있다. `imageSizes`의 크기는 모두 `deviceSizes`의 가장 작은 크기보다 작아야 한다.
``` js
module.exports = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```
