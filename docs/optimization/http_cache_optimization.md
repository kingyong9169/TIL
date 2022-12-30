---
layout: page
title: http cache로 성능 최적화하기
parent: 웹 성능 최적화
nav_order: 7
has_children: false
permalink: /optimization/http_cache_optimization
---

# http cache로 성능 최적화하기
http cache를 효율적으로 관리하려면 `Cache-Control` 헤더를 섬세하게 조절해야 한다.

## max-age
**캐시의 유효 기간이 지나기 전**
한 번 받아온 리소스의 유효 기간이 지나기 전이라면, 브라우저는 ***서버에 요청을 보내지 않고*** 디스크 또는 메모리에서만 캐시를 읽어와 계속 사용한다.

한 번 브라우저에 캐시가 저장되면 만료될 대까지 캐시는 계속 브라우저에 남아 있게 된다. 때문에 CDN 무효화 포함한 서버의 어떤 작업이 있어도 브라우저의 유효한 캐시를 지우기는 어렵다.

but `Cache-Control: max-age`값 대신 `Expires`헤더로 캐시 만료 시간을 정확히 지정할 수도 있다.

### 캐시의 유효 기간이 지난 이후: 재검증
캐시의 유효 기간이 지나면 캐시가 완전히 사라지게 될까? 그렇지 않다. 대신 브라우저는 서버에 `조건부 요청(Conditional request)`을 통해 캐시가 유효한지 재검증(revalidation)을 수행한다.

재검증 결과 브라우저가 가지고 있는 캐시가 유효하다면, 서버는 `[304 Not Modified]` 요청을 내려줍니다. `[304 Not Modified]` 응답은 `HTTP 본문을 포함하지 않기 때문에` **매우 빠르게 내려받을 수 있다.**

대표적인 재검증 요청 헤더들로는 아래와 같은 헤더가 있다.

`If-None-Match`: 캐시된 리소스의 `ETag` 값과 현재 서버 리소스의 `ETag` 값이 같은지 확인한다.
`If-Modified-Since`: 캐시된 리소스의 `Last-Modified` 값 이후에 서버 리소스가 수정되었는지 확인한다.

위의 `ETag` 와 `Last-Modified` 값은 기존에 받았던 리소스의 응답 헤더에 있는 값을 사용한다.

## 캐시의 위치
일반적으로 캐시를 없애기 위해서 `CDN Invalidation`을 수행한다. 이는 CDN에 저장되어 있는 캐시를 삭제하는 것이다. **브라우저의 캐시는 다른 곳에 위치하기 때문에 CDN 캐시를 삭제한다고 해서 브라우저 캐시가 삭제되지는 않는다.**

경우에 따라 중간 서버나 `CDN이 여러 개 있는 경우도 발생`하는데, 이 경우 전체 캐시를 날리려면 중간 서버 각각에 대해서 캐시를 삭제해야 합니다.

이렇게 한번 저장된 캐시는 지우기 어렵기 때문에 `Cache-Control`의 `max-age` 값은 `신중히 설정`하여야 합니다.

### s-maxage
중간 서버에서만 적용되는 `max-age` 값을 설정하기 위해 `s-maxage` 값을 사용할 수 있다.

예를 들어, `Cache-Control` 값을 `s-maxage=31536000, max-age=0` 과 같이 설정하면 CDN에서는 1년동안 캐시되지만 브라우저에서는 `매번 재검증 요청을 보내도록 설정할 수 있다.`

암시적으로 `proxy-revalidate` 디렉티브도 사용되기 때문이다. `must-revalidate` 디렉티브와 **완전히 동일한 의미를 갖고 공유 캐시에만 적용**되기 때문에 사설 캐시(브라우저)에서는 무시된다.

따라서 CDN에 1년동안 캐시되지만 브라우저에서 사용할 때, 매번 재검증 요청을 보내도록 한다. 이렇게 되면 `200`이 아니라 CDN을 통해 `304 응답`을 반환하게 된다.

사설 캐시 즉, 브라우저에 캐시되면 200응답을 반환한다. 그 이유는 서버까지 요청하지 않고 캐시로부터 응답을 받으므로 200을 반환한다. 이전 포스팅을 확인하면 알 수 있다.

# 그래서 최적화는 어떻게?
새로 배포가 이루어질 때마다 값이 바뀌는 파일의 경우 `max-age=0,s-maxage=seconds`로 설정하는 것이 좋다. 왜냐면 한 번 받아온 리소스의 유효 기간이 지나기 전이라면(만약 기간을 길게 잡았다면 문제가 될 가능성이 크다.), 브라우저는 ***서버에 요청을 보내지 않고*** 디스크 또는 메모리에서만 캐시를 읽어와 계속 사용하기 때문이다. 내용물이 바뀌어도 캐시를 사용하기 때문에 새로운 내용을 받아오지 못한다.

또한, 한 번 브라우저에 캐시가 저장되면 만료될 때까지 캐시는 계속 브라우저에 남아 있게 된다. 때문에 CDN 무효화 포함한 서버의 어떤 작업이 있어도 브라우저의 유효한 캐시를 지우기는 어렵다.

따라서 브라우저는 매번 파일을 가져올 때마다 서버에 재검증 요청을 보내고, 그 사이에 배포가 있었다면 새로운 파일을 내려 받는다. 그리고 CDN에서는 파일에 대한 캐시를 가지고 있다. 만약 새로운 배포가 이루어졌을 때 CDN Invalidation을 발생시켜 CDN이 서버로부터 새로운 파일들을 받아오도록 설정하는 것이다.

바로 HTML과 같은 예시이다. 새로 배포하면 파일 이름은 동일하지만 내용물이 바뀌게 된다. 그래서 `max-age=0,s-maxage=seconds`로 설정하는 것이다.

## 그럼 no-store는?
no-store는 아예 캐시를 저장하지 않는다고 명시하는 것이다. 그렇기 때문에 매번 서버로부터 새로 파일을 받아오게 된다. 따라서 `no-cache` 혹은 `max-age=0`을 통해 서버로부터 매번 검증을 받는 것이 더 효율적이다.

# 그럼 내용이 바뀔 수 없는 경우는?
`max-age=seconds`를 설정한다. `no-cache`혹은 `max-age=0`을 통해 매번 서버에 검증 요청을 보내는 것은 비효율적이다. 그래서 `max-age=seconds`를 통해 캐시를 유지하는 것이다.

`JS, CSS, 이미지`와 같은 예시이다. 왜냐면 `HTML`이 최신으로 유지되는 한, 항상 최신의 `JS, CSS`를 요청하게 된다. 즉, 새로운 배포 시 파일 이름이 항상 바뀐다(hash값이 붙여지기 때문). 예를 들자면, 새로운 배포를 하게 되어 새로운 `HTML`이 배포되는 상황이다. 여기서 기존 HTML은 `main.a.js`를 요청했지만 새로운 배포 후에는 `main.b.js`를 요청하게 된다. 즉, 이전 `JS, CSS`는 요청하지 않게 된다. 그래서 `max-age=seconds`를 통해 캐시를 유지하는 것이다.

이미지의 경우에도 hash값이 붙여진다. 그래서 `max-age=seconds`를 통해 캐시를 유지하는 것이다.

# 예시 코드
html, js, css 등 리소스를 전달하는 서버 코드 예시이다.

```js
const express = require('express');
const app = express();
const path = require('path');
...

const header = {
  setHeaders: (res, path) => {
    if(path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if(path.endsWith('.js') || path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'max-age=31536000');
    } else if(path.endsWith('.png') || path.endsWith('.jpg')) {
      res.setHeader('Cache-Control', 'max-age=31536000');
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}
```

# 참고자료
- [웹 서비스 캐시 똑똑하게 다루기](https://toss.tech/article/smart-web-service-cache)
- 인프런 프론트엔드 개발자를 위한, 실전 웹 성능 최적화(feat.React) - Part 2
