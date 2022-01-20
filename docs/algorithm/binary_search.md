---
layout: default
title: 이진탐색 알고리즘
parent: 알고리즘
nav_order: 4
permalink: /algorithm/binary_search
---

# 이진탐색 알고리즘
[참고 자료](https://jackpot53.tistory.com/33)

``` js
function binarySearch(list, key) {
    // 맨처음 low = 0, high는 배열의 끝이다.
    let low = 0;
    let high = list.length - 1;

    while(low <= high) {
        const mid = parseInt((high + low)/2); // mid 값을 계산.

        if (key > list[mid]) // 키값이 더 크면 왼쪽을 버린다.
            low = mid + 1;
        else if (key < list[mid]) // 키값이 더 작으면 오른쪽을 버린다.
            high = mid - 1;
        else
            return mid; // key found
    }
    return -1;  // key not found
}
```
주어진 자료에서 중복되지 않은 값이 주어질 때 그 데이터 내에 특정 값이 존재하는지 검색하는 방법 중 이진탐색은 자료를 정렬한 후 분할정복 방식으로 데이터를 1/2씩 나누면서 값이 존재하는지 확인하는 알고리즘입니다.

이진탐색이 데이터 내 특정 값을 정확히 찾는 것이지만 lower bound, upper bound는 이진탐색 알고리즘에서 약간 변형된 것으로 중복된 자료가 있을 때 유용하게 탐색할 수 있는 알고리즘으로

lower bound는 데이터 내 특정 **k값보다 같거나 큰 값**이 처음 나오는 위치를 리턴해주고 upper bound는 **k값보다 처음으로 큰 값**이 나오는 위치를 리턴해주는 알고리즘입니다.

## lower bound
``` js
function lowerBound(array, value) {
    let low = 0;
    let high = array.length;
    while (low < high) {
        const mid = parseInt((high + low)/2);
        if (value <= array[mid]) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    return low;
}
```
이진탐색과 다른 점은 크기가 9인 `const list = [1, 2, 2, 3, 3, 3, 4, 6, 7]`이 주어질 때 이진탐색은 정확히 같은 값이 있는 곳을 찾는거지만 lower bound는 주어진 값보다 같거나 큰 값이 처음으로 나오는 index를 리턴해야 하는데 만약 배열의 모든 수가 타겟 값보다 작다면 범위 밖 index를 리턴해줘야 합니다. 따라서 `high`는 `array.length`로 지정해줍니다.

또한, 탐색한 값이 주어진 값보다 크거나 같으면 바로 리턴하지 않고 처음으로 나오는 값 즉, 중복된 값의 위치를 찾기 위해 범위를 더 좁히면서 찾습니다. 따라서 `high = mid`로 지정해서 범위를 좀 더 좁혀 나가면서 찾아갑니다.

## upper bound
``` js
function upperBound(array, value) {
    let low = 0;
    let high = array.length;
    while (low < high) {
        const mid = parseInt((high + low)/2);
        if (value >= array[mid]) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
}
```
lower bound와 마찬가지로 upper bound는 주어진 값보다 큰 값이 처음으로 나오는 index를 리턴해야 하는데 만약 배열의 모든 수가 타겟 값보다 작다면 범위 밖 index를 리턴해줘야 합니다. 따라서 `high`는 `array.length`로 지정해줍니다.

또한, 탐색한 값이 주어진 값보다 크다면 바로 리턴하지 않고 최초로 큰 값이 있는 위치를 찾기 위해 `high = mid`를 지정하여 범위를 더 좁히면서 찾아갑니다.
