---
layout: page
title: interface
parent: typescript
nav_order: 3
has_children: false
permalink: /ts/interface/
---

# 인터페이스(interface)
인터페이스는 타입을 정의한 규칙을 의미합니다.

``` typescript
interface User {
 age: number;
 name: string;
}
```

- 변수와 함수에 활용한 인터페이스

``` typescript
let person: User = {
 age: 30,
 name: 'aa'
}

function getUser(user: User) {
 console.log(user);
}
```

- indexing

``` typescript
interface StringArray {
 [index: number]: string;
}

let arr: StringArray = ['a', 'b', 'c'];
arr[0] = 10 //Error;
```

- dictionary 패턴

``` typescript
interface StringRegexDictionary {
 [key: string]: RegExp
}

let obj: StringRegexDictionary = {
 cssFile: /\.css$/,
 jsFile: 'a' //Error
}

obj['cssFile'] = /\.css$/;
obj['jsFile'] = 'a' //Error
```

- interface 확장

``` typescript
interface Person{
 name: string;
 age: number;
}

interface User extends Person{
 language: string;
}
```