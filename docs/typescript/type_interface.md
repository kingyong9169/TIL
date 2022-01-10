---
layout: page
title: type과 interface의 차이점
parent: typescript
nav_order: 4
has_children: false
permalink: /ts/type_interface/
---

# type과 interface의 차이점
[참고 블로그](https://bny9164.tistory.com/m/48)

type과 interface를 구분해서 사용해야 할 이유가 있을까요? 대부분의 경우에는 구분하지 않고 사용해도 괜찮을 것입니다. 하지만 아래에서 디테일한 차이점을 살펴보겠습니다.

## 기본 사용법
기본 사용법에 아주 약간의 차이점이 있습니다.
``` ts
type Name = string;
type Age = number;
type CombineNumberString = string | number;

type TStudent = {
    id: number;
    name: string;
};

interface IStudent {
    id: number;
    name: string;
}

const interfaceStudent: IStudent = {
    id: 0,
    name: 'name',
};

const typeStudent: TStudent = {
    id: 0,
    name: 'name',
};
```
type 별칭은 실제로 새로운 type을 생성하지 않습니다. 따라서 type과 관련된 에러가 발생했을 시 type 별칭을 보여주지 않고 실제 type을 보여줍니다. interface는 실제로 새로운 type을 생성하고 관련 type에러에는 interface에서 문제가 발생했다고 알려줍니다.

## 타입을 확장하는 방법
타입을 확장하는 방법에 차이가 있습니다.
type은 `&`연산자, interface는 `extends` 키워드를 사용합니다.

``` ts
interface IStudent2 extends IStudent {
    age: number;
}

type TStudent2 = TStudent & {
    age: number;
};
```

## 선언적 확장
또한, interface의 경우 동일한 이름을 다시 interface를 정의해 확장하는 것이 가능합니다.
``` ts
interface IStudent {
    id: number;
    name: string;
}

interface IStudent {
    age: number;
}
```
하지만 type은 동일한 이름으로 다시 선언할 수 없습니다.

### interface는 객체에만 사용이 가능하다.
``` ts
interface AnimalInterface {
  name: string
}

type AnimalType = {
  name: string
}

type AnimalOnlyString = string
type AnimalTypeNumber = number

interface X extends string {} // 불가능
```
interface는 리터럴 타입으로 확장할 수 없습니다.

### computed value(generic type)의 사용
``` ts
type names = 'firstName' | 'lastName'

type NameTypes = {
  [key in names]: string
}

const yc: NameTypes = { firstName: 'hi', lastName: 'yc' }

interface NameInterface {
  // error
  [key in names]: string
}
```
type은 가능하지만 interface는 불가능합니다.

## 성능을 위해서 interface를 사용하는 것이 좋을까?
여러 `type`혹은 `interface`를 `&`하거나 `extends`할 때 `interface`는 속성간 충돌을 해결하기 위해 단순한 객체 타입을 만듭니다. 왜냐하면 `interface`는 객체의 타입을 만들기 위한 것이고, 어차피 객체만 오기 때문에 단순히 합치기만 하면 되기 때문입니다. 하지만 `type`의 경우, 재귀적으로 순회하면서 속성을 합치는데, 이 경우에 일부 `never`가 나오면서 제대로 머지가 안될 수 있습니다. `interface`와는 다르게, `type`은 원시 타입이 올수도 있으므로, 충돌이 나서 제대로 `merge`가 안되는 경우에는 `never`가 되기도 합니다.

``` ts
type type2 = { a: 1 } & { b: 2 } // 잘 머지됨
type type3 = { a: 1; b: 2 } & { b: 3 } // resolved to `never`

const t2: type2 = { a: 1, b: 2 } // good
const t3: type3 = { a: 1, b: 3 } // Type 'number' is not assignable to type 'never'.(2322)
const t3: type3 = { a: 1, b: 2 } // Type 'number' is not assignable to type 'never'.(2322)
```

따라서 `type`간 속성을 합칠 때는 주의해야 하며 객체에서만 사용하는 용도라면 `interface`를 사용하는 것이 사전에 버그를 차단할 수 있습니다.

또한, `interface`를 합성할 경우 이는 캐시가 되지만, `type`의 경우에는 그렇지 않습니다. 합성 자체에 대한 유효성을 판단하기 전에, 모든 구성요소에 대한 `type`을 체크하므로 컴파일 시에 상대적으로 성능이 좋지 않다고 합니다.

또한, 기본 타입에 새로운 이름을 붙이고 싶거나 유니온 타입을 명명하고 싶은 경우 등 interface에서 하지 못하는 부분에 대해서만 type별칭을 사용하는 것이 좋습니다.

따라서 `interface`를 주로 사용하는 것이 좋다고 생각합니다.
- 팀 혹은 프로젝트에서 지정한 컨벤션에 따라 `type` 혹은 `interface`일관적으로 사용하기
- 외부에 공개할 API는 `interface`사용하기(선언적 병합의 편리성)