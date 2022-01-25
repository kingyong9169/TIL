---
layout: default
title: 바벨 플러그인 제작하기
parent: babel
nav_order: 6
permalink: /babel/plugin
---

# 바벨 플러그인 제작하기
바벨은 프리셋과 플러그인을 누구나 제작할 수 있도록 API를 제공한다. API를 이용해 바벨 플러그인을 직접 제작해 보고, 바벨이 내부적으로 어떻게 동작하는지 이해해 보자.

## AST 구조 들여다보기
바벨은 문자열로 입력되는 코드를 AST라는 구조체로 만들어서 처리합니다. **플러그인에서는 AST를 기반으로 코드를 변경합니다. 따라서 플러그인을 제작하려면 AST의 구조를 알아야 합니다.** AST의 구조를 이해하는 가장 빠른 방법은 [axtexplorer 사이트](https://astexplorer.net/)에서 코드를 작성해 보고 그 코드로부터 만들어진 AST를 확인하는 것입니다.

`const v1 = a + b;` 코드의 AST를 확인해 봅니다. 바벨은 `babylon(@babel-parser)`이라는 파서를 이용해서 AST를 만듭니다. 가독성을 위해 loc와 같은 일부 속성을 제외하면 아래와 같습니다.

``` json
{
  "type": "Program", // AST의 각 노드는 type속성이 있습니다.
  "start": 0,
  "end": 17,
  "body": [
    {
      "type": "VariableDeclaration", // 변수 선언은 VariableDeclaration 타입입니다.
      "start": 0,
      "end": 17,
      "declarations": [ // 하나의 문장에서 여러 개의 변수를 선언할 수 있기 때문에 배열로 관리된다.
        {
          "type": "VariableDeclarator", // 선언된 변수를 나타내는 타입은 VariableDeclarator 타입입니다.
          "start": 6,
          "end": 16,
          "id": {
            "type": "Identifier", // 개발자가 만들어낸 각종 변수 이름은 Identifier 타입으로 만들어집니다.
            "start": 6,
            "end": 8,
            "name": "v1" // 실제로 v1이라는 변수 이름 사용
          },
          "init": {
            "type": "BinaryExpression", // 사칙연산은 BinaryExpression 타입으로 만들어 집니다. left, right 속성으로 연산에 사용되는 변수나 값이 들어갑니다.
            "start": 11,
            "end": 16,
            "left": {
              "type": "Identifier",
              "start": 11,
              "end": 12,
              "name": "a"
            },
            "operator": "+",
            "right": {
              "type": "Identifier",
              "start": 15,
              "end": 16,
              "name": "b"
            }
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```

## 바벨 플러그인의 기본 구조
바벨 플러그인은 하나의 js 파일로 만들 수 있습니다. 바벨 플러그인의 기본 구조는 다음과 같습니다.

``` js
module.exports = function({ types: t }) { // 1
  const node = t.BinaryExpression('+', t.Identifier('a'), t.Identifier('b')); // 2
  console.log('isBinaryExpression:', t.isBinaryExpression(node)); // 3
  return {}; // 빈 객체를 반환하면 아무 일도 하지 않습니다.
};
```

1. types 매개변수를 가진 함수를 내보냅니다.
2. types 매개변수를 이용해서 AST 노드를 생성할 수 있습니다.
3. types 매개변수는 AST 노드의 타입을 검사하는 용도로도 사용됩니다.

이제 반환값의 형태를 자세히 살펴보겠습니다.

``` js
module.exports = function({ types: t}) {
  return {
    visitor: { // 1
      Identifier(path) { // 2
        console.log('Identifier name:', path.node.name);
      },
      BinaryExpression(path) { // 3
        console.log('BinaryExpression operator:', path.node.operator);
        // ...(모든 괄호 닫기)
```
1. visitor 객체 내부에서 노드의 타입 이름으로 된 함수를 정의할 수 있습니다. 해당하는 타입의 노드가 생성되면 같은 이름의 함수가 호출됩니다.
2. Identifier 타입의 노드가 생성되면 호출되는 함수입니다. 만약 `const v1 = a + b;` 코드가 입력되면 이 함수는 세 번 호출됩니다.
3. BinaryExpression 타입의 노드가 생성되면 호출되는 함수입니다. 2번과 같은 코드가 입력되면 이 함수는 한 번 호출됩니다.

## 바벨 플러그인 제작하기: 모든 콘솔 로그 제거
```
mkdir test-babel-custom-plugin
cd test-babel-custom-plugin
npm init -y
npm install @babel/core @babel/cli
```

> src/code.js
``` js
console.log('aaa');
const v1 = 123;
console.log('bbb');
function onClick(e) {
    const v = e.target.value;
}
function add(a, b) {
    return a + b;
}
```
목표는 위 코드의 콘솔 로그 2개를 제거하는 것입니다. 먼저 플러그인을 제작하기 위해서는 콘솔 로그 코드의 AST 구조를 이해해야 합니다.

> console.log('asdf'); 코드의 AST
``` json
{
  "type": "Program",
  "start": 0,
  "end": 20,
  "body": [
    {
      "type": "ExpressionStatement", // 1
      "start": 0,
      "end": 20,
      "expression": {
        "type": "CallExpression", // 2
        "start": 0,
        "end": 19,
        "callee": {
          "type": "MemberExpression", // 3
          "start": 0,
          "end": 11,
          "object": {
            "type": "Identifier",
            "start": 0,
            "end": 7,
            "name": "console"
          },
          "property": {
            "type": "Identifier",
            "start": 8,
            "end": 11,
            "name": "log"
          },
          // ...
```

1. 콘솔 로그 코드는 ExpressionStatement 노드로 시작합니다.
2. 함수 또는 메소드를 호출하는 코드는 CallExpression 노드로 만들어집니다.
3. 메소드 호출은 CallExpression 노드 내부에서 MemberExpression 노드로 만들어집니다. MemberExpression 노드 내부에 객체와 메소드의 이름 정보가 보입니다.

> 콘솔 로그를 제거하는 플러그인 코드 plugins/remove-log.js
``` js
module.exports = function({ types: t }) {
  return {
    visitor: {
      ExpressionStatement(path) { // 1
        if(t.isCallExpression(path.node.expression)) { // 2
          if(t.isMemberExpression(path.node.expression.callee)) { // 3
            const memberExp = path.node.expression.callee;
              if(
                memberExp.object.name === 'console' && // 4
                memberExp.property.name === 'log'
              ) path.remove(); // 5
          }
        }
      }
    }
  }
}
```

1. ExpressionStatement 노드가 생성되면 호출되도록 메소드를 등록합니다.
2. ExpressionStatement 노드의 expression 속성이 CallExpression 노드인지 검사합니다.
3. callee 속성이 MemberExpression 노드인지 검사합니다.
4. console 객체의 log 메소드가 호출된 것인지 검사합니다.
5. 모든 조건을 만족하면 AST에서 ExpressionStatement 노드를 제거합니다.

## 바벨 플러그인 제작하기: 함수 내부에 콘솔 로그 추가
이번에는 이름이 on으로 시작하는 모든 함수에 콘솔 로그를 추가해주는 플러그인을 제작해 봅니다. 먼저 AST구조를 파악합니다.

> function f1(p1) { let v1; } 코드의 AST
``` js
{
  "type": "Program",
  "start": 0,
  "end": 27,
  "body": [
    {
      "type": "FunctionDeclaration", // 1
      "start": 0,
      "end": 27,
      "id": {
        "type": "Identifier",
        "start": 9,
        "end": 11,
        "name": "f1" // 2
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 12,
          "end": 14,
          "name": "p1"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 16,
        "end": 27,
        "body": [...], // 3
        // ...
```

1. 함수를 정의하는 코드는 FunctionDeclaration 노드로 만들어집니다.
2. 함수 이름은 id 속성이 들어 있습니다. 우리는 이 값으로 on으로 시작하는지 검사하면 됩니다.
3. BlockStatement 노드의 body 속성에는 함수의 모든 내부 코드에 대한 노드가 배열로 담겨 있습니다. 우리는 이 배열의 가장 앞쪽에 콘솔 로그 노드를 넣으면 됩니다.

> plugins/insert-log.js
``` js
module.exports = function({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path) { // 1
        if(path.node.id.name.substr(0, 2) === 'on') { // 2
          path.get('body').unshiftContainer( // 3
            'body',
            t.expressionStatement( // 코드 끝까지 4
              t.callExpression(
                t.identifier('console'),
                t.identifier('log'),
              ),
              [t.stringLiteral(`call ${path.node.id.name}`)],
            ),
          ),
      }
    }
  }
}
```

1. FunctionDeclaration 노드가 생성되면 호출되는 함수를 정의합니다.
2. 함수 이름이 on으로 시작하는지 검사합니다.
3. body 배열의 앞쪽에 노드를 추가하기 위해 unshiftContainer 메소드를 호출합니다.
4. 콘솔 로그 노드를 생성합니다. 이 노드는 `console.log(`call ${path.node.id.name}`;` 형태의 코드를 담고 있습니다.