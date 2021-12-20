---
layout: page
title: JSON.parse(), JSON.stringify
parent: javascript
nav_order: 3
has_children: false
permalink: /js/parse-VS-stringify/
---

# JSON.parse(), JSON.stringify

## JSON.parse
- 문자열(String) -> js 객체(Object)로 변환하는 것으로 역직렬화(Deserialization) 혹은 파싱(Parsing)이라고 합니다.
- 서버에서 json dataq쿼리의 결과값은 객체(Object)형태로 유입되기 때문에 이럴 경우는 js가 사용할 수 있는 객체 형태로 해석하고 변환할 필요가 있습니다.

``` js
const SERVER_OBJ = '{"이름": "김동용", "직업": "개발자"}';
const result = JSON.parse(SERVER_OBJ);

console.log(result); // {이름: "김동용", 직업: "개발자"}
```
이와 같이 객체.필드 형태로 사용하고자 한다면 반드시 JSON.parse를 거쳐야 합니다.

## JSON.stringify
- 컴퓨터 메모리 상에 존재하는 객체(Object) -> 문자열(String)로 변환하는 것으로 직렬화(Serialization)라고 합니다.
- 데이터를 서버에 전송하고자 할 때는 문자열 형태로 전송해야 되므로 stringify를 사용합니다.
``` js
const stringify = JSON.stringify(result);
console.log(stringify); // {"이름": "김동용", "직업": "개발자"}
```