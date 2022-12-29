---
layout: page
title: 폰트 최적화
parent: 웹 성능 최적화
nav_order: 4
has_children: false
permalink: /optimization/font
---

# 폰트 최적화
네트워크를 통해 다운받게 되면 폰트가 깜박거리는 현상을 마주칠 수 있다. 이를 해결하기 위해 폰트를 최적화하는 방법을 알아보자.

`FOUT(Flash of Unstyled Text)`: `IE, Edge`에서 사용되는 방식. 폰트 다운로드 전에 기본 폰트를 보여준다. 폰트가 다운로드 되면 폰트가 바뀐다.
`FOIT(Flash of Invisible Text)`: 크롬, 사파리 등. 폰트가 다운로드 되기 전까지 텍스트를 보여주지 않는다. 중간에 폰트가 안보이다가 폰트가 다운로드 되면 텍스트가 보인다.

-> 최적화 목표: `FOUT`, `FOIT`를 줄이는 것!

방법은 크게 2가지가 있다.
1. 폰트 적용 시점 컨트롤 하기
2. 폰트 사이즈 줄이기

## 1. 폰트 적용 시점 컨트롤 하기
font-display 속성을 사용하면 폰트가 다운로드 되기 전에 폰트가 적용되는 시점을 조절할 수 있다.

- auto: default
- block: FOIT(timeout 3s)
- SWAP: FOUT
- fallback: FOIT(timeout 0.1s), 3초 후에도 불러오지 못했을 시, 기본 폰트로 유지, 이후 캐시(폰트 다운로드 완료돼도 기본 폰트 유지)
- optional: FOIT(timeout 0.1s), 이후 네트워크 상태에 따라(브라우저 로직), 기본 폰트로 유지할지 웹폰트를 적용할지 결정, 이후 캐시

```css
@font-face {
  font-family: 'Noto Sans KR';
  src: url();
  font-display: optional; // 구글에서 권장함.
}
```

여기서 좋은 방법은 `FOIT`으로 보여주는 것이 좋을 것 같다. 그 이유는 `FOUT`방식처럼 깜박이게 되면 유저 경험에 좋지 않을 수 있기 때문이다. 내가 사용자라면 `왜 깜박이지?`라는 생각을 할 것 같다. 하지만 폰트 다운로드 시간이 길어지게 된다면 그만큼 텍스트가 노출되지 않기 때문에 이 또한 좋지 못한 경험이다. 따라서 폰트가 다운로드 되는 동안 `fade out` 애니메이션을 주는 것이 좋을 것 같다는 생각이다.

`npm`에 `fontfaceobserver`라는 라이브러리가 있는데, 이 라이브러리를 사용하면 폰트가 다운로드 되는 시점을 알 수 있다. 이 시점에 폰트를 적용하면 된다.

```js
const [isFontLoaded, setIsFontLoaded] = useState(false);
const font = new FontFaceObserver('Noto Sans KR');

useEffect(()=> {
  font.load().then(function () {
    setIsFontLoaded(true);
  });
}, [])
```

```jsx
<div style={{opacity: isFontLoaded ? 1 : 0, transition: 'opacity 0.3s ease'}}>
  <h1>폰트가 다운로드 되면 보여집니다.</h1>
</div>
```
이런 방식으로 `FOIT`방식을 사용해 유저 경험을 조금이나마 개선할 수 있다.

## 2. 폰트 사이즈 줄이기

### 웹폰트 포맷 사용하기
<img src="https://user-images.githubusercontent.com/62797441/209679589-afdb5767-42cf-4437-bb3b-d0b37ac770f8.png" width='500' />

파일 크기: `eot > ttf/otf > woff > woff2` 순으로 `woff2`가 가장 압축이 잘 된 모습이다.

<a href="https://transfonter.org">transfonter.org</a> 라는 사이트를 통해 ttf/otf 로 된 웹폰트를 woff, woff2로 변환해주는 방법이 있다. 변환하여 assets 폴더에 넣어준다.

```css
@font-face {
  font-family: 'Noto Sans KR';
  src: local('Noto Sans KR'),
       url('./assets/fonts/NotoSansKR-Regular.woff2') format('woff2'),
       url('./assets/fonts/NotoSansKR-Regular.woff') format('woff'), // woff2를 지원하지 않는 브라우저를 위해 woff, ttf를 추가해준다.
       url('./assets/fonts/NotoSansKR-Regular.ttf') format('truetype');
  font-display: optional;
}
```

만약 유저 pc에 웹폰트를 가지고 있다면? `local폰트`를 사용하여 로컬에 있는 폰트를 사용하게 된다. 이렇게 하면 폰트를 다운로드 받지 않아도 되기 때문에 네트워크 성능을 높일 수 있다.

### subset 사용하기
실제 텍스트에서 필요한 글자만 뽑아서 폰트를 만들어 사용하는 방법이다. 이 방법을 사용하면 폰트의 크기를 줄일 수 있다.
`Keep calm and ride longboard`에서 실제로 `a b c d e g i k l m n o p r`만 필요하다.

<a href="https://transfonter.org">transfonter.org</a>라는 사이트를 통해 `characters` 옵션을 사용하여 subset을 만들 수 있다. 이후 `font-face`에 적용하면 최적화된 모습을 확인할 수 있다.

### unicode range 사용하기
위에서 subset을 적용하였다. 위에서 subset에 포함하지 않은 z 가 사용되는 텍스트에서도 폰트가 다운로드되는 모습을 볼 수 있다. css가 적용되기 때문이다. 불필요한 폰트를 다운로드할 필요가 있을까? 이를 방지하는 방법이 unicode range이다.

지정되는 유니코드 값만 폰트를 불러오겠다는 의미이다.

```css
@font-face {
  font-family: 'Noto Sans KR';
  src: local('Noto Sans KR'),
       url('./assets/fonts/NotoSansKR-Regular.woff2') format('woff2'),
       url('./assets/fonts/NotoSansKR-Regular.woff') format('woff'), // woff2를 지원하지 않는 브라우저를 위해 woff, ttf를 추가해준다.
       url('./assets/fonts/NotoSansKR-Regular.ttf') format('truetype');
  font-display: optional;
  unicode-range: Array.prototype.map.call('ABCDEGIKLMNOPR', c => 'u+' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4)).join(', ');
}
```
여기서 map.call을 사용하는 이유는 유사 배열인 String에 Array메소드인 map을 사용하기 위해서다.

### data-uri로 변환
<a href="https://transfonter.org">transfonter.org</a>라는 사이트를 통해 `base64 인코드 옵션, characters` 옵션을 사용하여 `data-uri`가 적용된`subset`을 만들 수 있다. 이후 `font-face`에 적용하면 최적화된 모습을 확인할 수 있다. 하지만 font 코드를 열어보면 `base64`로 인코딩된 코드가 들어있는 것을 확인할 수 있다. 이 방식은 css 파일을 부르고 폰트 파일을 다운로드하는 방식보다는 css파일 내에 폰트 파일이 있기 때문에 `네트워크 리소스`, `시간적인 이득`을 챙길 수 있다. but uri가 굉장히 길기 때문에 따로 파일로 분리하는 것이 좋다.

**단점**
- CSS 파싱이 블락되어 렌더링이 상당히 지연된다.
- 한글 폰트의 경우는 크기가 커서 속도도 오히려 더 느려질 수 있다.

### 폰트 preload하기
폰트가 필요하기 이전 시점에 css보다 먼저 부르는 기법이다. html link를 이용하는 방법이다.

```html
<link rel="preload" href="BMYEONSUNG.woff2" as="font" type="font/woff2" crossorigin>
```
rel="preload"를 써주고 href와 type을 지정해주면 된다.

원래라면 css가 로드된 이후에 폰트가 다운로드되지만 `preload`를 통해 가장 먼저 폰트를 다운로드하고 `css`가 로드되는 시점과 동시에 폰트가 적용되는 것이다.

하지만 문제점은 빌드 후에 html에서 href 경로를 폰트가 위치한 경로로 바꿔줘야 한다. 이를 해결하기 위해 `webpack` 설정을 해줘야 한다. `preload-webpack-plugins`를 사용한다.
``` js
...
plugins: [
  new PreloadWebpackPlugin({
    rel: 'preload',
    include: 'allAssets',
    fileWhitelist: [/\.(woff2?)/i],
    as: entry => {
      if (/\.woff2$/.test(entry)) return 'font';
      if (/\.woff$/.test(entry)) return 'font';
      return 'script';
    }
  })
]
```

**특징**
- preload를 이용해서 폰트를 받으면 다른 어떤 것보다 먼저 리소스를 요청
  - Dom Contented loaded 시점 이전에 렌더링이 됨
  - FOUT와 FOIT가 없어짐
  - 그만큼 렌더링이 느려짐
- 사용 여부와 관계없이 무조건 리소스를 받음
  - 화면에 꼭 필수적인 폰트를 로딩해야 할 때 사용.
- as와 crossorigin이 있어야 두 번 다운로드하지 않음

## 참고자료
- https://velog.io/@vnthf/%EC%9B%B9%ED%8F%B0%ED%8A%B8-%EC%B5%9C%EC%A0%81%ED%99%94-%ED%95%98%EA%B8%B0
- 인프런 프론트엔드 개발자를 위한, 실전 웹 성능 최적화(feat.React) - Part 2
