---
layout: page
title: 참조 타입 vs 원시 타입
parent: javascript
nav_order: 5
has_children: false
permalink: /js/refertype/
---

# 참조 타입 vs 원시 타입

## 객체(Object)
js에서 객체는 단순하게 표현하면 속성명(key), 값(vale) 형태의 속성(property)을 저장하는 그릇이라고 생각하면 됩니다.
객체 선언 방식은 {}(중괄호)입니다. 이 선언 방식은 객체 리터럴 방식이라고 하며, 리터럴이란 용어의 의미는 표기법이라고 생각하면 됩니다. 리터럴 방식은 간단한 표기법만으로도 객체를 생성할 수 있는 js의 강력한 문법입니다. 객체의 프로퍼티에 접근하려면 마침표 표기법과 대괄호 표기법이 있습니다.

``` javascript
const person = {
    name: "동용",
    age: "24"
}

conole.log(person.name) // 동용
console.log(person['name']) // 동용
```

## 배열(Array)
변수에 여러 가지의 값을 한 번에 담을 수 있는 그릇입니다. 위에 언급한 객체와 비슷해 보일 수 있지만 배열의 속성명은 각 프로퍼티의 인덱스 값입니다. 선언방식은 `[](대괄호)`이며 객체와 마찬가지로 배열 리터럴입니다.
``` javascript
const person = ["동용", "24"]

conole.log(person[0]) // 동용
console.log(person[1]) // 24
```

## 원시 타입과 참조 타입의 차이
js에서는 원시타입인 `Number, String, Boolean, null, undefined` 다섯 가지를 제외한 모든 값은 참조 타입입니다. 참조 타입이라고 불리는 이유는 객체의 모든 연산이 실제 값이 아닌 참조값으로 처리되기 때문입니다.

### 원시타입은 값 자체를 복사합니다.
``` javascript
let num1 = 10, num2 = num1;
console.log(num2); // 10
num1 = 20;
console.log(num2); // 10
```

### 참조타입은 참조(주소)값을 복사합니다.
``` javascript
const obj1 = {
    num: 10
}
const obj2 = obj1;
console.log(obj2.num); // 10
obj1.num = 20;
console.log(obj2.num); // 20
```

값 자체가 복사되는 원시값과 달리 참조값은 참조(객체를 가리키는 참조값 혹은 메모리 주소)만 복사되고 실제 값은 복사되지 않습니다. 즉, `obj1, obj2`는 실제 데이터를 가지고 있는 객체의 참조 값만 가지고 있는 것입니다.