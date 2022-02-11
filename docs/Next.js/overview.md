---
layout: default
title: Next.js란?
parent: Next.js
nav_order: 1
permalink: /next/overview
---

# SSR 이란?
SSR은 서버에서 리액트 코드를 실행해서 렌더링하는 것을 말합니다. SSR이 필요한 이유는 두 가지 입니다.
- 1. 검색 엔진 최적화를 해야 합니다.
- 2. 빠른 첫 페이지 렌더링이 중요합니다.

많은 수의 사용자를 대상으로 하는 사이트라면 SED를 위해서 SSR은 필수입니다. 구글을 제외한 다른 검색 엔진에서는 js를 실행하지 않기 때문에 CSR만 하는 사이트는 내용이 없는 사이트와 동일하게 처리됩니다. 게다가 구글도 SSR을 하는 사이트에 더 높은 점수를 부여한다고 알려져 있습니다.

SSR을 하면 사용자가 요청한 페이지를 빠르게 보여 줄 수 있습니다. CSR만 한다면 js를 실행해야만 화면이 보이기 때문에 저사양 기기를 사용하는 사용자일수록 요청한 페이지가 느리게 보입니다. 저사양 기기를 사용하는 사람이 많거나 네트워크 인프라가 약한 나라에서 서비스를 해야 한다면 SSR을 중요하게 생각해야 합니다.

## SSR 함수 사용해 보기: renderToString
리액트에서는 SSR을 위해 아래 네 개의 함수를 제공합니다.
- 1. renderToString
- 2. renderToNodeStream
- 3. renderToStaticMarkup
- 4. renderToStaticNodeStream

3, 4번 함수는 정적 페이지를 렌더링할 때 사용됩니다. 최초 렌더링 이후에도 계속해서 상태 변화에 따라 화면을 갱신해야 한다면 1, 2번 함수를 사용해야 합니다.