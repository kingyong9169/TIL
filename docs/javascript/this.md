---
layout: page
title: this
parent: javascript
nav_order: 1
has_children: false
permalink: /js/this/
---

# FE 개발자가 되고 싶다면 꼭 알아야 할 this
[참고 자료](https://wormwlrm.github.io/2019/03/04/You-should-know-JavaScript-this.html)

## 실행 컨텍스트란?
js는 스크립트 언어로, `interpreter`가 코드를 라인 단위로 읽고, 해석 후 실행시킵니다.

`interpreter`에 의해 현재 실행되는 js 코드의 환경 또는 스코프를 `실행 컨텍스트`라고 부릅니다.
js 내부에서 이런 실행 컨텍스트를 `stack`으로 관리하고 있으며 실행되는 시점에 자주 변경되는 실행 컨텍스트를 `this`가 가리키고 있습니다.
## this란?
this는 일반적으로 **메소드를 호출한 객체가 저장되어 있는 속성**이며 현재 실행되는 코드의 `실행 컨텍스트`를 가리킵니다. 즉, 자신이 속한 객체 또는 자신이 생성할 인스턴스를 가리키는 자기 참조 변수입니다.
js에서 this의 값은 결정되어 있지 않습니다. 문맥에 따라 그 값이 바뀝니다.

MDN에서는 다음과 같이 설명합니다.
> 대부분의 경우 this의 값은 함수를 호출한 방법이 결정합니다. 실행하는 중 할당으로 설정할 수 없고 함수를 호출할 때 마다 다를 수 있습니다.

즉, this의 값은 **어디에서 어떻게 호출하는지에 따라 변한다는 것**입니다.

## 동적 바인딩
js에서 this의 바인딩은 동적입니다. 함수 호출시 어떻게 호출되는가에 따라서 동적으로 this가 결정됩니다. 그래서 this가 어떤 객체를 가리키는지 예측이 어렵다는 단점이 있습니다.
그 예시와 종류들을 아래에서 확인해봅시다!

## 전역 범위
전역 범위(Global context), JavaScript에서 가장 평범하게 일반적으로 `this`를 호출한다면, this는 `Window`라는 전역 객체를 가리킵니다(Node.js에서는 `Global`).

`Window`객체라는 것은, 현재 실행되고 있는 JavaScript의 모든 변수, 함수, 객체, DOM 등을 포함하고 있는 객체로, 만물의 근원이 되는 객체입니다.

``` js
// 1. 전역 범위에서 호출
console.log(this); // Window {...}
```

## 함수 범위
함수 내에서 this를 호출한다면 현재 실행되고 있는 코드의 문맥에 따라 this가 달라집니다.

### 1. 일반 함수에서의 this
``` js
// 1. 일반 함수 범위에서 호출
function outside() {
    console.log(this); // this는 window

    // 2. 함수 안에 함수가 선언된 내부 함수 호출
    function inside() {
        console.log(this); // this는 window
    }
    inside();
}
outside();
```

함수를 선언한 후 호출하는 경우, this는 `Window`객체입니다.

또한, 함수 안에서 또 함수를 선언하더라도, this는 여전히 `Window`입니다.

### 2. 객체의 메소드(Method)
``` js
// 1. 객체 또는 클래스 안에서 메소드를 실행한다면 this는 Object 자기 자신
let man = {
    name: 'john',
    hello: function() {
        // 2. 객체이므로 this는 man을 가리킴
        console.log('hello ' + this.name);
    }
}
man.hello(); // 3. hello john
```

MDN에서는 객체 혹은 클래스 내부에 선언된 메소드 함수에서 this를 사용할 때,
> 함수를 어떤 객체의 메소드로 호출하면 this의 값은 그 객체를 사용합니다.
라고 합니다.

**함수를 객체 외부에서 선언하고, 객체 안에서 호출하는 경우에도 `this`는 해당 객체의 `this`를 참조합니다.**

``` js
// 3. 일반 함수 welcome을 선언
function welcome() {
    // 4. 여기서 this는 전역 객체 Window이므로, 만약 실행시키면 undefined가 뜸
    console.log('welcome ' + this.name);
}

// 5. man 객체의 welcome 속성에 일반 함수 welcome을 추가
man.welcome = welcome;

// 6. welcome이 man 객체에서 호출되었으므로 welcome john이 출력됨
man.welcome();
```

**이와는 반대로, 객체의 함수를 외부에서 호출할 때 this는 Window가 됩니다.**
``` js
// 7. man 객체의 thanks 속성에 함수를 선언
man.thanks = function () {
    // 8. man.thanks()를 호출하면 thanks john이 출력
    console.log('thanks ' + this.name);
}

// 8. 이 함수를 객체 외부에서 참조
let thankYou = man.thanks;

// 9. 객체 외부이므로 this가 Window 객체가 되어서 thanks (undefined)가 출력
thankYou();

// 10. 그럼 또 다른 객체에서 이 함수를 호출하면 어떻게 될까?
women = {
    name: 'barbie',
    thanks: man.thanks // 11. man.thanks 함수를 women.thanks에 참조
}

// 12. this가 포함된 함수가 호출된 객체가 women이므로 thanks barbie가 출력
women.thanks();
```

**만약 객체의 메소드에서 내부 함수를 선언하는 경우는 `this`는 어떻게 될까요?**

``` js
let man = {
    name: 'john',
    // 1. 이것은 객체의 메소드
    hello: function() {
        // 2. 객체의 메소드 안에서 함수를 선언하는 것이니까 내부 함수
        function getName() {
            // 3. 여기서 this가 무엇을 가리키고 있을까?
            return this.name;
        }
        console.log('hello ' + getName()); // 4. 내부 함수를 출력시키고
    }
}
man.hello(); // 메소드를 실행시키면 undefined가 뜬다! this는 Window였던 것
```

객체의 메소드에서 this가 객체를 가리키고 있던 것과는 다르게, 내부 함수에서 `this`는 `Window`객체를 가리키고 있습니다. 즉, 내부 함수는 메소드가 아니기 때문에, 단순 함수 호출 규칙에 따라 `Window`를 가리키고 있습니다.

### 3. call(), apply(), bind()
그렇다면 위의 코드를 의도한 결과가 나올 수 있도록 할 방법은 없을까요?
js에서는 각각 다른 문맥의 `this`를 필요에 따라 변경할 수 있도록 함수를 제공합니다. `call(), apply(), bind()`가 대표적입니다. 여기서는 `call`을 사용하겠습니다.

``` js
// 1. 이것은 객체의 메소드
let man = {
    name: 'john',
    // 2. 객체의 메소드 안에서 함수를 선언하는 것이니까 내부 함수
    hello: function() {
        function getName() {
            // 3. 여기서 this가 무엇을 가리키고 있을까?
            return this.name;
        }
        // 4. 이번에는 call()을 통해 현재 문맥에서의 this(man 객체)를 바인딩해주었다
        console.log('hello ' + getName.call(this));
    }
}

// 이번에는 메소드를 실행시키면 john가 뜬다!
// this가 man 객체로 바인딩 된 것을 확인할 수 있다
man.hello();
```

### 4. 콜백 함수
``` js
// 1. 콜백함수
var object = {
    callback: function() {
        setTimeout(function() {
            console.log(this); // 2. this는 window
        }, 1000);
    }
}
```
객체 안의 메소드로 선언 되어있더라도 콜백 함수에서는 this가 Window를 가리킵니다.

### 5. 생성자
함수 앞에 new 키워드를 붙이고 선언할 때, this를 생성자 함수를 통해 새로 생성할 객체(인스턴스)에 바인딩합니다.
``` js
// 1. 클래스 역할을 할 함수 선언
function Man () {
    this.name = 'John';
}

// 2. 생성자로 객체 선언
var john = new Man();

// 3. this가 Man 객체를 가리키고 있어 이름이 정상적으로 출력된다
john.name; // => 'John'
```

`class`도 마찬가지입니다.

``` js
// 1. Class Man 선언
class Man {
    constructor(name) {
        this.name = name;
    }
    hello() {
        console.log('hello ' + this.name)
    }
}

// 2. 생성자 실행
var john = new Man('John');
john.hello(); // 3. hello John 출력
```

주의할 점은 new 키워드를 붙이지 않을 경우 this가 해당 객체로 바인딩되지 않지 때문에 `Window`객체를 건드리는 일이 발생할 수 있습니다. 따라서 new 키워드를 꼭 써주어야 합니다.

### 6. 화살표 함수
화살표 함수는 함수를 축약해서 사용할 수 있습니다. 하지만 this를 외부 스코프에서 정적으로 바인딩된 문맥(정적 컨텍스트, Lexical context)을 가진다는 특징을 갖고 있습니다.

정적 컨텍스트란?
> 소스코드가 작성된 그 문맥의 실행 컨텍스트나 호출 컨텍스트에 의해 결정된다는 것을 의미합니다.

즉, 정적 컨텍스트는 함수가 실행된 위치가 아닌, 정의된 위치에서의 컨텍스트를 참조한다는 이야기입니다. 이 코드가 어디서 실행되고 있는지 따질 필요없이, 정의된 부분에서 가까운 외부 함수의 `this`만 보면 된다는 뜻입니다.

더 쉽게 축약하면 언제나 this를 사용한 화살표 함수의 상위 스코프의 this를 가르킨다는 것을 의미합니다.

``` js
// 1. 화살표 함수
var obj = {
    a: this, // 2. 일반적인 경우 this는 window,
    b: function() {
      console.log(this) // 3. 메소드의 경우 this는 객체
    },
    c: () => {
        console.log(this)
        // 4. 화살표 함수의 경우 정적 컨텍스트를 가짐, 함수를 호출하는 것과 this는 연관이 없음
        // 5. 따라서 화살표 함수가 정의된 obj 객체의 this를 바인딩하므로 this는 window
    }
}

obj.b() // 6. obj
obj.c() // 7. window
```

일반적인 방법으로 함수`function`를 선언하면, 일반적인 함수는 함수가 실행될 때 자체적으로 `this`를 할당하는데, 이 함수는 메소드 함수이므로 `this`가 메소드를 포함하는 객체로 바인딩됩니다.

하지만 화살표 함수는 `this`가 없기 때문에, 부모 스코프의 `this`를 바인딩하는데 즉, 위 예시에서 `Window`객체를 의미합니다. 따라서 메소드로 화살표 함수를 쓰면, `this`를 이용한 부모 객체에 접근할 수 없습니다.

**화살표 함수는 prototype속성이 없습니다.**
``` js
var Foo = () => {}
console.log(Foo.prototype) // undefined
var foo = new Foo()	   // TypeError: Foo is not a constructor
```

## 이벤트 리스너에서의 this

``` js
var data = 10; // 1
$("#myButton").click(function () {
    this.data = 20; // 2 
    data = 30; // 3 
    console.log("1. data = " + data); // 30
    console.log("2. this.data = " + this.data); // 20
    console.log("3. window.data = " + window.data); // 30
});
```
이벤트 리스너에서 this는 이벤트를 발생시킨 객체가 됩니다. 따라서 this는 `#myButton`이 됩니다.
따라서 `this.data`는 `#myButton`의 `data`를 의미하게 되고 20으로 저장했기 때문에 20을 출력합니다.