---
layout: default
title: datalist
parent: HTML
nav_order: 1
permalink: /html/datalist
---

# datalist
datalist와 select는 비슷해보이지만, 차이점이 있습니다.

``` html
<form>
  <select name="language" >
    <option value="none">=== 선택 ===</option>
    <option value="korean">한국어</option>
    <option value="english">영어</option>
    <option value="chinese">중국어</option>
    <option value="spanish">스페인어</option>
  </select>
</form>
```
select는 사용자가 선택할 수 있는 선택 항목을 제공하고, 그 범위에서만 선택이 가능합니다.


``` html
<input list="fruitslist" name="fruits" id="fruits">
<datalist id="fruitslist">
  <option value="apple" label="사과">
  <option value="banana" label="바나나">
  <option value="grape" label="포도">
  <option value="orange" label="오렌지">
</datalist>
```
- datalist는 option 목록에 없는 값도, 사용자의 입력을 받을 수 있습니다.
- 사용자가 입력창에 타이핑을, option목록에서 일치하는 값을 찾아서 자동완성 기능을 제공합니다.
- 자동완성 기능을 제공하기 때문에, 사용자가 선택해야 할 목록이 매우 많을 경우 유용합니다. 사용자가 자동완성 기능으로 쉽게 원하는 값을 찾을 수 있습니다.