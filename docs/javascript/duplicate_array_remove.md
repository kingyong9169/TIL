---
layout: page
title: 2차원 배열 중복 제거
parent: javascript
nav_order: 9
has_children: false
permalink: /js/duplicate_array_remove/
---

# 2차원 배열 중복 제거
`Set`객체는 요소의 중복을 제거할 수 있지만 2차원 배열의 요소를 중복 제거할 수는 없습니다. 그 이유는 `Set`객체 안의 각 배열 안의 요소는 같을 수 있지만 각 배열을 가리키는 주소는 모두 다르기 때문에 배열 안의 요소의 값이 같아도 다른 값으로 인식하기 때문에 `Set`객체 자체만으로 중복을 제거할 수 없습니다. 따라서 아래와 같이 객체 리터럴을 활용하여 2차원 배열의 중복을 제거할 수 있습니다.

``` js
const arr = [[7,3], [7,3], [3,8], [7,3], [7,3], [1,2]];

function multiDimensionalUnique(arr) {
    const uniques = [];
    const itemsFound = {};
    for(let i = 0 ; i < arr.length; i++) {
        const stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

multiDimensionalUnique(arr);
```