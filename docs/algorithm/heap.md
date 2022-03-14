---
layout: default
title: 힙
parent: 알고리즘
nav_order: 2
permalink: /algorithm/heap
---

# 힙
- 최댓값이나 최솟값을 찾아내는 연산을 빠르게 하기 위해 고안된 완전이진트리를 기본으로 한 자료구조
- 최소힙, 최대힙이 존재

# 최소힙
작은 값을 항상 트리의 위에 있게 해서 트리의 루트에는 가장 작은 값이 오도록 함.

# 최대힙
가장 큰 값이 맨 위에 오도록 함. 모든 노드는 자기 부모 노드가 자기보다 큰 값을 가지고 있음

# 힙에 데이터를 삽입하고 값을 삽입하는 방법

## 최소힙에 데이터를 삽입하는 방법
1. 값을 삽입하려고 할 때 완전이진트리의 요건을 만족시키기 위한 자리에 삽입
2. 자신의 값과 자신의 부모노드값을 비교하여 자신의 값이 더 작으면 자리를 바꾼다.
3. 2번의 과정을 자신의 값이 부모노드값보다 작을 때까지 혹은 루트에 도착할 때까지 반복한다.

-> 이 작업은 밸런스가 맞춰져 있는 완전이진트리에서 이루어지니까 한 레벨씩 루트까지 올라간다면 한 번 돌때마다 절반씩 비교할 것이 사라진다. 따라서 O(log n)의 시간복잡도를 가진다.

## 최소힙에서 최솟값 꺼내오기
1. 루트에서 최솟값을 가져온다.
2. 루트 자리가 비어있으니 채워야 한다. 완전 이진 트리의 맨 마지막 노드를 가져온다.
3. 가져오니까 정렬이 안되어 있는 상태이므로 자신의 자식 노드와 비교해서 자기보다 작은 노드와 자리를 바꾼다.
4. 3번을 반복하다가 자식이 자기보다 크거나 리프노드에 도달하게 되면 멈춘다.
-> 마찬가지로 루트에서 한 레벨씩 내려가다가 맨 마지막 레벨까지 내려갈 수 있으니 최대 O(log n)의 시간복잡도를 가진다.

### bubble_up
힙에 값을 삽입할 때 부모와 비교해서 값이 크거나 작으면(최소 힙의 경우 부모가 자신보다 크면, 최대 힙의 경우 부모가 자신보다 작으면) 부모와 값을 교환해서 올바르게 정렬이 될 때 까지 올라가는 것을 편의상 bubbleUp이라 한다.

### bubble_down
힙에서 값을 꺼내올 때 아래 자식들과 비교해서 값이 크거나 작으면(최소 힙의 경우 자식이 자신보다 값이 작으면, 최대 힙의 경우 자식이 자신보다 값이 크면) 자식과 값을 교환해서 올바르게 정렬이 될 때 까지 내려가는 것을 편의상 bubbleDown이라고 하겠다.

**최대힙은 최소힙과 값의 비교 연산자만 다르기 때문에 생략하겠다.**

# 힙은 배열로 구현
<img width="503" alt="완전이진트리" src="https://user-images.githubusercontent.com/62797441/158027261-11ca7b50-0c18-4bd9-a7a6-8e057edcd7e4.png">

- 다른 자료구조와 달리 힙은 자식에 대한 포인터를 갖지 않고 배열을 사용해서 자료를 정한다.
- 첫번째 배열 항목을 루트로 설정한 다음 각 왼쪽 항목과 오른쪽 항목을 순서대로 채움으로써 이진 힙을 다룰 수 있다.

## 이진 힙 배열 인덱스 구조
- 이진 힙의 경우 힙을 나타내기 위해 배열이 사용되는데 다음과 같이 인덱스를 사용한다. 이 때 N은 노드의 인덱스이다.
  - 자신: N
  - 부모: (N - 1) / 2
  - 왼쪽 자식: (N * 2) + 1
  - 오른쪽 자식: (N * 2) + 2

완전 이진 트리를 그려보면 알 수 있다.

# 기본 힙 js 코드
``` js
class Heap {
    constructor() {
        this.items = [];
    }

    swap = (index1, index2) => {
        let temp = this.items[index1];
        this.items[index1] = this.items[index2];
        this.items[index2] = temp;
    }

    parentIndex = (index) => Math.floor((index - 1) / 2);
    leftChildIndex = (index) => index * 2 + 1;
    rightChildIndex = (index) => index * 2 + 2;

    parent = (index) => this.items[this.parentIndex(index)]
    leftChild = (index) => this.items[this.leftChildIndex(index)];
    rightChild = (index) => this.items[this.rightChildIndex(index)];

    getLength = () => this.items.length;

    bubbleUp() {}
    bubbleDown() {}

    push(item) {
        this.items[this.items.length] = item;
        this.bubbleUp();
    }

    pop() {
        let item = this.items[0];
        this.items[0] = this.items[this.items.length - 1];
        this.items.pop();
        this.bubbleDown();
        return item;
    }
}
```

# 최소힙 js 코드
``` js
const Heap = require("./heap");

class MinHeap extends Heap {
    bubbleUp() {
        let index = this.items.length - 1;
        while(this.parent(index) && this.parent(index) > this.items[index]) {
            this.swap(index, this.parentIndex(index));
            index = this.parentIndex(index);
        }
    }

    bubbleDown() {
        let index = 0;
        while(this.leftChild(index) && this.leftChild(index) < this.items[index] || 
            this.rightChild(index) && this.rightChild(index) < this.items[index]) {
            let smallerIndex = this.leftChildIndex(index);
            if(this.rightChild(index) && this.rightChild(index) < this.items[smallerIndex])
                smallerIndex = this.rightChildIndex(index);
            this.swap(index, smallerIndex);
            index = smallerIndex;
        }
    }
}
```

# 최대힙 js 코드
``` js
const Heap = require("./heap");

class MaxHeap extends Heap {
    bubbleUp(){
        let index = this.items.length - 1;
        while(this.parent(index) && this.parent(index) < this.items[index]){
            this.swap(index, this.parentIndex(index));
            index = this.parentIndex(index);
        }
    }

    bubbleDown(){
        let index = 0;
        while(this.leftChild(index) && this.leftChild(index) > this.items[index] || 
            this.rightChild(index) && this.rightChild(index) > this.items[index]) {
            let largerIndex = this.leftChildIndex(index);
            if(this.rightChild(index) && this.rightChild(index) > this.items[largerIndex])
                largerIndex = this.rightChildIndex(index);
            this.swap(largerIndex, index);
            index = largerIndex;
        }
    }
}
```
