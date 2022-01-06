---
layout: page
title: 속성 접근자
parent: javascript
nav_order: 13
has_children: false
permalink: /js/property_accessors/
---

# 속성 접근자
속성 접근자는 점 or 대괄호 표기법으로 객체의 속성에 접근할 수 있도록 해줍니다.
``` js
object.property
object['property']
```

``` js
const person1 = {};
person1['firstname'] = 'Mario';
person1['lastname'] = 'Rossi';

console.log(person1.firstname);
// expected output: "Mario"

const person2 = {
  firstname: 'John',
  lastname: 'Doe'
};

console.log(person2['lastname']);
// expected output: "Doe"
```

## 괄호 표기법
괄호 표기법에서는 속성이름으로 문자열 혹은 Symbol을 사용할 수 있습니다. 문자열은 유효한 식별자가 아니어도 됩니다.
`"1foo"`, `"!bar!"`, 심지어 `" "`(공백)도 가능합니다.
``` js
document.createElement('pre');
document['createElement']('pre'); // 점표기법과 동일
document ['createElement']('pre'); // 대괄호와 앞의 공백도 허용
```

## 속성 이름
속성 이름은 문자열이나 Symbol입니다. 또한, 숫자 등의 다른 자료형은 자동으로 문자열로 변환됩니다.

``` js
array[0] === array["0"]
object[0] === object["0"]
```
