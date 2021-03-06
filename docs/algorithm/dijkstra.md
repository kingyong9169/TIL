---
layout: default
title: 다익스트라 알고리즘
parent: 알고리즘
nav_order: 1
permalink: /algorithm/dijkstra
---

# 다익스트라 알고리즘
[참고 링크1](https://yabmoons.tistory.com/364), [참고 링크2](https://m.blog.naver.com/ndb796/221234424646)

다이나믹 프로그래밍을 활용한 대표적인 Shortest Path 탐색 알고리즘입니다. 흔히 인공위성 GPS SW 등에서 가장 많이 사용됩니다. 다익스트라 알고리즘은 특정한 하나의 정점에서 다른 모든 정점으로 가는 최단 경로를 알려줍니다. **다만 이 때 음의 간선을 포함할 수 없습니다.** 물론 현실 세계에서는 음의 간선이 존재하지 않기 때문에 다익스트라는 **현실 세계에 사용하기 매우 적합한 알고리즘 중 하나**라고 할 수 있습니다.

## 다이나믹 프로그래밍(DP)
다익스트라 알고리즘이 다이나믹 프로그래밍인 이유는 **최단 거리는 여러 개의 최단 거리로 이루어져있기 때문입니다.** 작은 문제가 큰 문제의 부분 집합에 속해있다고 볼 수 있습니다. 기본적으로 다익스트라는 **하나의 최단 거리를 구할 때 그 이전까지 구했던 최단 거리 정보를 그대로 사용**한다는 특징이 있습니다.

<img width="360" alt="스크린샷 2021-12-20 오후 4 04 13" src="https://user-images.githubusercontent.com/62797441/146725878-cd785d14-0547-4c03-83ef-887b204668dd.png">

다음 그림과 같이 1에 붙어 있는 노드인 2, 3, 4까지의 최단 거리는 각각 3, 6, 7입니다. 1에서 3까지 가는 최소 비용은 6입니다. 거리가 6이기 때문입니다.

하지만 2를 처리하게 된다면

<img width="360" alt="스크린샷 2021-12-20 오후 4 04 25" src="https://user-images.githubusercontent.com/62797441/146725871-222323aa-b6a4-479c-955c-a031207a2e04.png">

위와 같이 경로 1->3의 비용이 6인데 경로 1->2->3 총 비용 4로 더 저렴하다는 것을 알 수 있습니다. 이 때 현재까지 알고 있던 3으로 가는 최소 비용 6을 새롭게 4로 갱신하는 겁니다. 다시 말해 다익스트라 알고리즘은 **현재까지 알고 있던 최단 경로를 계속해서 갱신**합니다.

<img width="360" alt="스크린샷 2021-12-20 오후 4 04 31" src="https://user-images.githubusercontent.com/62797441/146725864-7698e955-f32b-4cdb-87f8-5a639a02af59.png">

## 작동 과정
- 1. 출발 노드를 설정합니다.
- 2. 출발 노드를 기준으로 각 노드의 최소 비용을 저장합니다.
- 3. 방문하지 않은 노드 중에서 가장 비용이 적은 노드를 선택합니다.
- 4. 해당 노드를 거쳐서 특정한 노드로 가는 경우를 고려하여 최소 비용을 갱신합니다.
- 5. 3번~4번 과정을 반복합니다.

## 실제 예시
<img width="480" alt="스크린샷 2021-12-20 오후 4 25 23" src="https://user-images.githubusercontent.com/62797441/146728468-e74fa596-6bd5-439c-978d-e88c97bb14db.png">

위와 같이 그래프가 있습니다. 실제로 처리할 때 이차원 배열 형태로 처리해야 합니다. 바로 다음과 같이 해줍니다. 아래 표의 의미는 특정 행에서 열로 가는 비용입니다.

|   |노드 1|노드 2|노드 3|노드 4|노드 5|노드 6|
|----|----|----|----|----|----|----|
|**노드 1**|0|2|5|1|무한|무한|
|**노드 2**|2|0|3|2|무한|무한|
|**노드 3**|5|3|0|3|1|5|
|**노드 4**|1|2|3|0|1|무한|
|**노드 5**|무한|무한|5|1|0|2
|**노드 6**|무한|무한|5|무한|2|0|

이 상태에서 1번 노드를 선택합니다.

<img width="480" alt="스크린샷 2021-12-20 오후 4 25 31" src="https://user-images.githubusercontent.com/62797441/146728466-6e026871-2905-40f5-b735-a7e6987d61fb.png">

노드 1을 선택한 상태에서, 이와 연결된 세 개의 간선(2, 3, 4)를 확인한 상태입니다. 배열을 만든 뒤에는 이 최소 비용 배열을 계속해서 갱신합니다. 현재 방문하지 않은 노드 중에서 가장 비용이 적은 노드는 4번 노드입니다.

<img width="480" alt="스크린샷 2021-12-20 오후 4 25 38" src="https://user-images.githubusercontent.com/62797441/146728462-5525e353-11af-44f9-a724-27cb41adaa26.png">

보면 기존에 5로 가는 최소 비용은 무한이었습니다. 하지만 4를 거쳐서 5로 가는 경우는 비용이 2이므로 최소 비용 배열을 갱신해줍니다. 또한 4를 거쳐서 3으로 가는 경우는 비용이 4이므로 기존보다 더 저렴합니다. 따라서 최소 비용 배열을 갱신해줍니다.

|   |노드 1|노드 2|노드 3|노드 4|노드 5|노드 6|
|----|----|----|----|----|----|----|
|**노드 1**|0|2|4|1|2|무한|
|**노드 2**|2|0|3|2|무한|무한|
|**노드 3**|5|3|0|3|1|5|
|**노드 4**|1|2|3|0|1|무한|
|**노드 5**|무한|무한|5|1|0|2
|**노드 6**|무한|무한|5|무한|2|0|

이제 다음으로 방문하지 않은 노드 중에서 가장 비용이 적은 노드는 2번 노드입니다.
<img width="480" alt="스크린샷 2021-12-20 오후 4 25 45" src="https://user-images.githubusercontent.com/62797441/146728458-ea27caf7-0782-4102-bf9d-5c271d269c04.png">

2를 거쳐서 가더라도 비용이 갱신되는 경우는 없습니다.

다음으로 방문하지 않은 노드 중에서 가장 비용이 적은 노드는 5번 노드입니다.
<img width="480" alt="스크린샷 2021-12-20 오후 4 25 51" src="https://user-images.githubusercontent.com/62797441/146728455-350964ce-6fbd-4aa8-94fb-2606a087c026.png">

위와 같이 5를 거쳐서 3으로 가는 경우, 경로의 비용이 3이므로 기존의 4보다 더 저렴합니다. 따라서 3으로 바꿉니다.
또한, 5를 거쳐서 6으로 가는 경우 경로의 비용이 4로 기존의 무한보다 더 저렴합니다. 따라서 6으로 바꿉니다.

|   |노드 1|노드 2|노드 3|노드 4|노드 5|노드 6|
|----|----|----|----|----|----|----|
|**노드 1**|0|2|3|1|2|4|
|**노드 2**|2|0|3|2|무한|무한|
|**노드 3**|5|3|0|3|1|5|
|**노드 4**|1|2|3|0|1|무한|
|**노드 5**|무한|무한|5|1|0|2
|**노드 6**|무한|무한|5|무한|2|0|

이후에 방문하지 않은 노드 중에서 가장 저렴한 노드 3을 방문합니다.
<img width="480" alt="스크린샷 2021-12-20 오후 4 25 58" src="https://user-images.githubusercontent.com/62797441/146728450-b72c135a-2119-4d0a-9842-91b543e2955b.png">

최소 비용 갱신은 일어나지 않습니다.

마지막으로 남은 노드 6을 살펴봅니다.

<img width="480" alt="스크린샷 2021-12-20 오후 4 26 05" src="https://user-images.githubusercontent.com/62797441/146728441-d7b15e4a-727c-44c6-8c66-ac6730803d79.png">

노드 6을 방문한 뒤에도 결과는 같습니다.

따라서 노드 1을 선택한 상태에서 노드 1~6까지 최소 비용 배열을 갱신한 결과는 아래와 같습니다.

|   |노드 1|노드 2|노드 3|노드 4|노드 5|노드 6|
|----|----|----|----|----|----|----|
|**노드 1**|0|2|3|1|2|4|
|**노드 2**|2|0|3|2|무한|무한|
|**노드 3**|5|3|0|3|1|5|
|**노드 4**|1|2|3|0|1|무한|
|**노드 5**|무한|무한|5|1|0|2|
|**노드 6**|무한|무한|5|무한|2|0|

마찬가지로 노드2~5의 경우도 똑같은 방법으로 해주면 됩니다.