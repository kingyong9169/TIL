---
layout: default
title: stash
parent: Git
nav_order: 1
has_children: false
permalink: /git/stash
---

# git stash란 [참조 링크](https://gmlwjd9405.github.io/2018/05/18/git-stash.html)

## 들어가기
자신이 어떤 작업을 하다가 다른 작업을 해야할 일이 생겨 잠시 브랜치를 변경해야 할 일이 있는 상황이다. 이때, 아직 완료하지 않은 일을 commit하기에는 난감한 상황이다. 이럴 때 사용한다.

## git stash란?
아직 마무리하지 않은 작업을 스택에 잠시 저장할 수 있도록 하는 명령어이다. 이를 통해 아직 완료하지 않은 일을 commit하지 않고 나중에 다시 꺼내와 마무리할 수 있다.

### 1. `git stash or git stash save`
위 명령어를 통해 새로운 stash를 스택에 만들어 하던 작업을 임시로 저장한다.

이 과정을 통해 working directory는 깨끗해진다.

이제 새로운 작업을 위한 다른 브랜치로 변경할 수 있다.

#### untracked file 숨기기 [참조 링크](https://linuxhint.com/stash-untracked-files-in-git/)
1. `git stash --include-untracked`
2. `git stash -u`
3. `git add 후 git stash`

### 2. `git stash list`
여러 번 stash를 했다면 위의 명령어를 통해 저장한 stash 목록을 확인할 수 있다.

### 3. stash 적용하기(했던 작업을 다시 가져오기)

``` javascript
git stash apply 
// 가장 최근의 stash를 가져와 적용한다.
git stash apply [stash 이름] 
// stash 이름(ex. stash@{2}에 해당하는 stash를 적용한다.)
```
위의 명령어를 통해 했던 작업을 다시 가져온다.

> but 위의 명령어로는 staged 상태였던 파일을 자동으로 다시 staged 상태로 만들어 주지 않는다. `-index` 옵션을 주어야 staged 상태까지 복원한다. 이를 통해 원래 작업하던 파일의 상태로 돌아올 수 있다.
```
// staged 상태까지 저장
git stash apply --index
```

> 수정했던 파일들을 복원할 때 반드시 stash했을 때와 같은 브랜치일 필요는 없다. 만약 다른 작업 중이던 브랜치에 이전의 작업들을 추가했을 때 충돌이 있으면 알려준다.

### 4. stash 제거하기
```
git stash drop
// 가장 최근의 stash를 제거한다.
git stash drop [stash 이름]
// stash 이름(ex. stash@{2}에 해당하는 stash를 제거한다.)
```

만약 적용과 동시에 스택에서 해당 stash를 제거하고 싶으면
```
git stash pop
// apply + drop의 형태
```

### 5. stash 되돌리기
``` javascript
// 가장 최근의 stash를 사용하여 패치를 만들고 그것을 거꾸로 적용한다.
git stash show -p | git apply -R
// stash 이름(ex. stash@{2})에 해당하는 stash를 이용하여 거꾸로 적용한다.
git stash show -p [stash 이름] | git apply -R
```

명령어가 길다.. stash-unapply라는 명령어를 등록하여 간단하게 사용할 수 있다.
``` javascript
git config --global alias.stash-unapply '!git stash show -p | git apply -R'
git stash apply
...
// alias로 등록한 stash 되돌리기 명령어
git stash-unapply
```