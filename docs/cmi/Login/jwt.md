---
layout: page
title: jwt
parent: admin 로그인 개발
grand_parent: CMI 프로젝트 기록
nav_order: 1
has_children: false
permalink: /cmi/login/jwt
---

# admin 로그인 jwt기능 추가

## 서버 통신 후 로컬스토리지에 jwt 저장

``` typescript
const onSubmit = async (data: Props) => {
    console.log(data);
    try {
      const response = await http.post(`login`, data);
      localStorage.setItem("x-access-token", response.data.xAccessToken);
      localStorage.setItem("x-refresh-token", response.data.xRefreshToken);
    } catch (e) {
      console.log(e);
    }
  };
```

사용자가 로그인 폼에 id, password를 모두 적고 `로그인` 버튼을 누르면 onSubmit 함수를 실행한다.

해당 api 경로로 `data`를 전송하고 서버로부터의 `response`를 받아 로컬스토리지에 `x-access-token, x-refresh-token`을 저장한다.

로그아웃 시에는 `localStorage.removeItem("x-access-token")`으로 로컬스토리지의 jwt를 없애준다.

## 헤더에 jwt 포함하여 통신하기

``` typescript
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:4123/",
  headers: {
    "Content-type": "application/json",
    "x-access-token": JSON.parse(localStorage.getItem("x-access-token") || ""),
    "x-refresh-token": JSON.parse(
      localStorage.getItem("x-refresh-token") || "",
    ),
  },
});
```
axios 모듈로 통신하는 부분에서는 별도의 헤더인 `x-access-token, x-refresh-token`을 지정하여 사용자가 로그인했다면 jwt가 헤더에 포함되어 api요청이 갈 것이고 아니라면 빈 문자열이 전달되어 액세스가 되지 않을 것이다.

`JSON.parse()`메소드를 사용한 이유는 JavaScript에서 객체를 선언할 때 객체 리터럴보다 JSON.parse로 파싱하는 것이 더 빠르기 때문에 사용하였습니다. [참조 링크](https://wormwlrm.github.io/2019/12/04/Why-JSON-parse-is-faster-than-object-literal.html)