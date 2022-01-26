---
layout: default
title: 바벨 시작하기
parent: babel
nav_order: 1
permalink: /babel/start
---

# 바벨 시작하기
바벨과 웹팩은 웹 앱을 제작할 때 없어서는 안되는 기반 기술이 되었습니다. 리액트 또는 뷰를 기반으로 프로젝트를 구축해 주는 cra, next.js, vue-cli, nuxt 등의 도구는 바벨과 웹팩을 기본적으로 포함합니다.

물론 도구의 도움을 받아서 자동으로 프로젝트를 구축하면 바벨과 웹팩을 모르더라도 간단한 웹 앱을 제작할 수 있습니다. 하지만 프로젝트의 규모가 점점 커지는 상황에서 바벨과 웹팩을 계속해서 외면하기는 힘듦니다. jest와 같은 테스트 프레임워크를 도입할 때, 스토리북과 같이 별도의 빌드 과정이 필요할 때, ssr을 위해서 서버 측 코드를 빌드해야 할 때 등 바벨과 웹팩을 이해해야만 하는 순간이 반드시 옵니다.

## 바벨이란?
바벨은 입출력이 모두 자바스크립트 코드인 컴파일러입니다. 이는 보통의 컴파일러가 고수준의 언어를 저수준의 언어로 변환하는 것과 비교됩니다.

초기의 바벨은 ES6 코드를 ES5 코드로 변환해 주는 컴파일러였습니다. 현재는 바벨을 이용해서 리액트의 jsx, ts와 같은 정적 타입 언어, 코드 압축, 제안(proposal) 단계에 있는 문법 등을 사용할 수 있습니다.

## 바벨 실행 및 설정하기
바벨을 설정하는 여러 가지 방법, 각자의 프로젝트에 적합한 설정은 무엇인지 고민해봅니다. 또한, 폴리필은 무엇인지, 바벨에서 어떻게 설정하는지 알아봅니다. 바벨과 폴리필의 관계를 이해하지 못하면 오래된 브라우저에서 에러가 발생하는 코드가 만들어질 수 있습니다. `core-js`, `@babel/preset-env` 프리셋을 통해 폴리필을 관리하는 방법을 알아봅니다.