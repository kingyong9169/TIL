---
layout: default
title: position
parent: css
nav_order: 8
has_children: false
permalink: /css/position/
---

# position
`position` 속성은 태그를 어떻게 위치시킬지를 정의하며, 아래의 5가지 값을 갖습니다.
- `static`: 기본값, 다른 태그와의 관계에 의해 자동으로 배치되며 위치를 임의로 설정해 줄 수 없습니다.
- `relative`: 원래 있던 위치를 기준으로 좌표를 지정합니다.
- `absolute`: 절대 좌표와 함께 위치를 지정해 줄 수 있습니다.
- `fixed`: 스크롤과 상관없이 항상 문서 좌상단 좌표 기준으로 고정합니다.
- `sticky`: 스크롤링 시 효과가 나타납니다.
- `inherit`: 부모 태그의 속성값을 상속받습니다.

좌표를 지정 해주기 위해서는 `left`, `right`, `top`, `bottom` 속성과 함께 사용합니다.

`position`을 `absolute`나 `fixed`로 설정 시 가로 크기가 100%가 되는 `block` 태그의 특징이 사라지게 됩니다.

## position: static
`position` 속성을 별도로 지정해주지 않으면 기본값인 `static`이 적용됩니다. `position` 속성이 `static`인 요소는 `HTML` 문서 상에서 원래 있어야하는 위치에 배치됩니다.

이 말은 요소들이 `HTML`에 작성된 순서 그대로 브라우저 화면에 표시가 된다는 것을 뜻하며, 따라서 `top, left, bottom, right` 속성값은 `position` 속성이 `static`일 때는 무시됩니다.

예를 들어, 다음과 같이 `<main>` 요소 아래에 3개의 `<div>` 요소가 있다면 맨 위에 첫 번째 요소, 중간에 두 번째 요소, 제일 아래에 세 번째 요소가 나란히 순서대로 배치됩니다.

``` html
<main>
  <div>첫 번째 요소</div>
  <div>두 번째 요소</div>
  <div>세 번째 요소</div>
</main>
```

``` css
main {
  width: 300px;
  height: 400px;
  background: tomato;
}

div {
  width: 200px;
  height: 100px;
  border: 1px solid;
  background: yellow;
  text-align: center;
  line-height: 100px;
  box-sizing: border-box;
}

div:nth-of-type(2) {
  position: static;
  background: cyan;
  opacity: 0.8;
}
```

## position: relative
`position` 속성을 `relative`로 설정하게 되면, 요소를 원래 위치에서 벗어나게 배치할 수 있게 됩니다. 요소를 원래 위치를 기준으로 상대적(relative)으로 배치해준다고 생각하시면 이해가 쉬울 것 같은데요. 요소의 위치 지정은 `top, bottom, left, right` 속성을 이용해서, 요소가 원래 위치에 있을 때의 상하좌우로 부터 얼마나 떨어지게 할지를 지정할 수 있습니다.

예를 들어, 두 번째 <div> 요소의 `position` 속성을 `relative`로 변경하고, 요소의 원래 위치로 부터 위에서 28px, 왼쪽에서 48px 떨어지도록 `top`과 `left` 속성을 설정해보겠습니다.

``` css
div:nth-of-type(2) {
  position: relative;
  top: 28px;
  left: 48px;
  background: cyan;
  opacity: 0.8;
}
```

## position: absolute
`position` 속성값 중 가장 난해하고 주의해서 사용해야하는 속성값은 `absolute`입니다. 아마도 `absolute`라는 영단어의 의미 때문일텐데 `relative` 속성의 정반대 개념이라고 많이 오해를 합니다. 오히려 `absolute` 속성값은 `relative` 속성값과 함께 사용되는 경우가 많은 데 말입니다.

`position` 속성을 `absolute`로 지정하면 사실 전혀 절대적(absolute)으로 요소를 배치해주지 않습니다. 오히려 배치 기준이 상황에 따라 굉장히 달라질 수 있는데요. 흥미롭게도 `position` 속성이 `absolute`일 때 해당 요소는 배치 기준을 자신이 아닌 `상위 요소`에서 찾습니다. `DOM 트리`를 따라 올라가다가 `position` 속성이 `static`이 아닌 첫 번째 상위 요소가 해당 요소의 배치 기준으로 설정되는데요. 만약에 해당 요소 상위에 `position` 속성이 `static`이 아닌 요소가 없다면, DOM 트리에 최상위에 있는 `<body>` 요소가 배치 기준이 됩니다.

알고리즘이 상당히 복잡하게 느껴지죠? 하지만 실제로 `absolute` 속성값을 사용할 때 이러한 복잡한 특성을 활용하는 경우는 드뭅니다. 대부분의 경우, 부모 요소(가장 가까운 상위 요소)를 기준으로 `top, left, bottom, right` 속성을 적용해야하기 때문입니다. 따라서 어떤 요소의 `display` 속성을 `absolute`로 설정하면, 부모 요소의 `display` 속성을 `relative`로 지정해주는 것이 관례입니다.

``` css
main {
  position: relative;
  width: 300px;
  height: 400px;
  background: tomato;
}

div {
  width: 200px;
  height: 100px;
  border: 1px solid;
  background: yellow;
  text-align: center;
  line-height: 100px;
  box-sizing: border-box;
}

div:nth-of-type(2) {
  position: absolute;
  bottom: 8px;
  right: 16px;
  background: cyan;
  opacity: 0.8;
}
```

여기서 꼭 짚고 넘어가야하는 부분이 있는데요. 바로 `position: absolute`인 요소는 `HTML 문서 상에서 독립되어` 앞뒤에 나온 요소와 더 이상 상호작용을 하지 않게 된다는 것입니다. 따라서 첫 번째 요소 아래에 바로 두 번째 요소가 배치됩니다.


# position: sticky
`<div>` 요소의 부모인 `<main>` 요소의 높이를 줄이고 스크롤링이 가능해지도록 `height`외 `overflow` 속성을 조정해줍니다.

그 다음, 두번째`<div>` 요소의 `position` 속성을 `sticky`로 변경하고, `top` 속성을 `0`으로 설정해주겠습니다.
``` css
main {
  width: 300px;
  height: 120px;
  overflow: auto;
  background: tomato;
}

div {
  width: 200px;
  height: 100px;
  border: 1px solid;
  background: yellow;
  text-align: center;
  line-height: 100px;
  box-sizing: border-box;
}

div:nth-of-type(2) {
  position: sticky;
  top: 0;
  background: cyan;
}
```

이제 스크롤바를 아래로 내려서 화면을 위로 올려보면, 두 번째 요소가 화면 상단에 스티커처럼 붙어서 움직이지 않는 것을 알 수 있습니다. 반면에 `position: static`인 세 번째 요소는 이에 구애받지 않고 화면에 따라 올라가는 것을 알 수 있습니다.