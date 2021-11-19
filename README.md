# ⚽️ TIL, 배운 것을 그때그때 기록하자

프로젝트를 진행하며 겪었던 경험(어떤 문제가 있었고 어떻게 해결했는지), 스터디, 코딩테스트 준비, FE 준비, 매일 공부하며 새로 알게 된 지식 등 배운 것을 구체적으로 기록하려고 합니다.

- [TIL 페이지](https://kingyong9169.github.io/TIL/)
- [GitHub](https://github.com/kingyong9169)
- [Velog](https://velog.io/@kingyong9169)
- [코딩테스트 스터디](https://github.com/thdwlsgus0/algo_spot)

## just-the-docs, jekyll 세팅 방법

jekyll 세팅 [jekyll](https://jekyllrb.com/docs/)을 먼저 진행한 후에
just-the-docs 테마 사용법 [just-the-docs](https://pmarsceill.github.io/just-the-docs/)을 통해 테마 적용을 해주세요.

## Navigation 카테고리 구성 방법

- 모든 포스팅 마크다운 문서는 `./docs` 폴더 내에 만듭니다. 카테고리를 계층 관계로 표현하고 싶은 경우 밑의 예시와 같이 폴더 구조를 만듭니다.
- `index.md` 파일은 Navigation바에서 해당 항목을 눌렀을 때 처음 나오는 페이지를 의미합니다.

```
docs/
├─ category1/
│  ├─ index.md
│  ├─ post1.md
├─ category2/
│  ├─ index.md
│  ├─ post2.md
```

## 포스팅 작성 방법

모든 마크다운 문서 최상단에 `YAML`을 설정합니다([navigation구조](https://pmarsceill.github.io/just-the-docs/docs/navigation-structure/)를 참고하세요).

```YAML
---
layout: default
title: css Variable
parent: css
grand_parent: FE
nav_order: 1
has_children: false
permalink: /FE/css/cssvar
---
```

| 속성          | 의미                                            |
| ------------ | ---------------------------------------------- |
| layout       | 생략하고 카테고리를 눌렀을 때 테마 적용이 되지 않습니다     |
| title        | 페이지에 표시될 제목                               |
| parent       | 부모 페이지의 title                               |
| grand_parent | 부모의 부모 페이지의 title                          |
| nav_order    | 사이드바에 표시될 페이지 순서(디폴트값은 알파벳순 정렬)     |
| has_children | 사이드바에서 자식 페이지 포함 여부                     |
| permalink    | permalink에 쓰여진 url로 요청이 들어오면 _site에 존재하는 {해당 파일명}.html을 불러와 삽입합니다.     |

위 `YAML`을 작성 후 마크다운 문법에 따라 포스팅을 작성하면 됩니다.

## Admin 세팅
게시글을 md문법으로 작성하면 되지만 admin페이지를 통해 쉽게 게시글을 작성할 수 있다는 것을 알게 되어 방법을 공유합니다. [참조 링크](https://honbabzone.com/jekyll/start-gitHubBlog/#step-6-admin-%EC%84%B8%ED%8C%85) 먼저, Gemfile파일 안에 해당 부분을 작성합니다.

`gem 'jekyll-admin', group: :jekyll_plugins`

```
bundle install
jekyll serve
```
명령어를 실행하여 <http://localhost:4000/admin/>에 접근하여 게시물을 작성하고 수정할 수 있습니다.

## 자동 git commit, push

`npm init`을 통해 먼저 `package.json`파일을 작성한 후 shell script 파일을 작성합니다.
```
"scripts": {
    "commit": "commit/commit.sh"
  },
```
위 코드를 `package.json`에 추가해주고 `npm run commit`명령어를 입력합니다.<br>
아마도 `Permission denied` 라는 오류가 발생할테지만 터미널 창에 `chmod +x commit/commit.sh`를 입력하고 다시 `npm run commit`명령어를 입력하면 성공하는 모습을 볼 수 있습니다. [참고 문서](https://awsm.page/nodejs/run-shell-scripts-using-npm-script/)

## shell script 종료 상태 확인 방법
```
if [ $? -ne 1 ]; then
    echo 'commit success😀'
fi
```
코드를 shell script 파일 아래에 작성해줍니다. [참고 문서](https://stackoverflow.com/questions/26675681/how-to-check-the-exit-status-using-an-if-statement)