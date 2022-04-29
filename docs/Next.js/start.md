---
layout: default
title: Next.js 시작하기
parent: Next.js
nav_order: 1
permalink: /next/start
---

# 시작하기
- Node.js 12.22.0 이상
- MacOS, Windows(WSL 포함) 및 Linux 지원

## 자동설정
모든 것을 자동으로 설정하는 `create-next-app`를 사용하여 next앱 만들기
```
npx create-next-app@latest
# or
yarn create next-app
# or
pnpm create next-app

// TS사용
npx create-next-app@latest --typescript
# or
yarn create next-app --typescript
# or
pnpm create next-app -- --typescript
```

## 수동설정
```
npm install next react react-dom
# or
yarn add next react react-dom
# or
pnpm add next react react-dom
```

`package.json`에 추가
``` json
"scripts": {
  "dev": "next dev", // 개발 모드에서 nest 시작
  "build": "next build", // 프로덕션 사용을 위한 빌드
  "start": "next start", // 프로덕션 서버 실행
  "lint": "next lint" // 내장 eslint 구성 설정
}
```

### 디렉토리
- pages: 파일 이름에 따라 경로와 연결됨. 예를 들어 `pages/about.js`을 만들면 `/about`으로 매핑됨.
- public: 이미지, 폰트 등과 같은 정적 자산 저장.

Next.js는 페이지 개념을 중심으로 구축되었다. 페이지는 `pages`디렉토리에 있는 `.js, .jsx, .ts, or .tsx`파일로부터 내보낸 리액트 컴포넌트이다.

이처럼 파일 이름으로 동적 경로 매개변수를 추가할 수 있다.

`pages/index.js`는 유저가 애플리케이션의 루트 즉, `/`를 방문할 때 렌더링되는 페이지.

지금까지 우리는 다음을 얻을 수 있다.
- 자동 컴파일과 [번들링](https://nextjs.org/docs/advanced-features/compiler)
- [React Fast Refresh](https://nextjs.org/blog/next-9-4#fast-refresh)
- [SSG and SSR](https://nextjs.org/docs/basic-features/data-fetching/overview) of [pages/](https://nextjs.org/docs/basic-features/pages)
- base URL(/)로 맵핑되는 `public/`을 통한 [정적 파일 제공](https://nextjs.org/docs/basic-features/static-file-serving)

추가적으로 next 앱은 처음부터 프로덕션 준비가 되어 있습니다. [Deploy Document](https://nextjs.org/docs/deployment)를 읽어보세요.