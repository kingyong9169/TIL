---
layout: default
title: 벨만포드 알고리즘
parent: 알고리즘
nav_order: 3
permalink: /algorithm/bellman_ford
---

# 벨만포드 알고리즘
벨만포드 알고리즘은 다익스트라에서 할 수 없었던 **음의 가중치도 계산할 수 있도록 한 방법**이다. 그러므로 벨만포드도 다익스트라와 마찬가지로 단일노드 s에서 출발해 그래프 내의 모든 다른 노드에 도착하는 가장 짧은 경로를 찾는 문제다. 하지만 다익스트라 알고리즘보다 시간복잡도가 높으므로 상황에 맞게 사용해야 한다.

# 개념
시작노드 s에서 도착노드 v까지 이르는 최단 경로는 s에서 u까지의 최단경로 + u에서 v사이의 가중치를 더한 값입니다.
`D(s, v) = D(s, u) + W(u, v)`

밸만-포드 알고리즘은 s와 u사이의 최단 거리를 구할 때, 그래프 내 모든 edge에 대해서 `edge relaxation` 을 수행해준다.

밸만-포드 알고리즘에서는 모든 엣지에 대한 edge relaxation을 `|V| - 1`회 수행한다.

## edge relaxation 이란?
<img src="https://i.imgur.com/nqdnANR.png">

기존의 d(z)가 75였는데 탐색 과정에서 `d(u) + e = 60`으로 길이가 더 짧을 때, 노드와 엣지의 정보를 업데이트 해주는 것을 말한다.

## 예시
<img src="http://people.inf.elte.hu/hytruongson/Bellman-Ford/10-bellmanford.jpg">

모든 엣지에 대한 edge relaxation을 1회 수행한 것이다. edge relaxation을 수행할 때 거리 정보 뿐만아니라 최단경로 또한 update합니다.

# Negative Cycle
<img src="https://i.imgur.com/46tJqd7.png">

음수 가중치가 사이클을 이루고 있는 경우에는 벨만 포드 알고리즘은 작동하지 않는다.

위의 그림에서 c, d와 e, f가 사이클을 이루고 있는 것을 볼 수 있다. c, d의 경우에는 사이클을 돌수록 distance가 커져서 최단 경로를 구할 때 문제가 되지 않지만 e, f의 경우에는 사이클을 돌수록 distance가 작아져서 최단 경로를 구하는 것이 의미가 없어진다.
1. 초깃값 설정을 한다. (시작정점 / 시작정점 외 정점들)
2. edge relaxation : 첫번재 반복을 한다. 최단거리를 찾기 위함. (정점의 개수(V) - 1번(모든 간선 순회))
3. 벨만포드는 총 `V - 1`번 반복해야하는데 `V`번 반복 후 `V`번째에 만약 거리가 갱신되면 음의 사이클이 존재하는 것이므로 -1 리턴

``` js
function bellmanFord(n, m, graph, node, start) {
    const distance = {};
    for(const v of node)
        distance[v] = INF;
    
    distance[start] = 0;

    for(let i = 0 ; i < n ; i++) {
        for(const u in graph) {
            for(const [v, e] of graph[u]) {
                if(distance[v] > distance[u] + e) {
                    if(i === n - 1) return -1;
                    distance[v] = distance[u] + e;
                }
            }
        }
    }

    return distance;
}
```
