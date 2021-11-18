---
layout: default
title: ⚽️ TIL, 배운 것을 그때그때 기록하자
nav_order: 1000
has_children: false
permalink: //
---

# ⚽️ TIL, 배운 것을 그때그때 기록하자

프로젝트를 진행하며 겪었던 경험(어떤 문제가 있었고 어떻게 해결했는지), 스터디, 코딩테스트 준비, FE 준비, 매일 공부하며 새로 알게 된 지식 등 배운 것을 구체적으로 기록하려고 합니다.

- [블로그 페이지]()
- [GitHub](https://github.com/kingyong9169)
- [Velog](https://velog.io/@kingyong9169)
- [코딩테스트 스터디](https://github.com/thdwlsgus0/algo_spot)

## just-the-docs, jekyll 세팅 방법

just-the-docs 테마 사용법 전체에 대한 설명은 [just-the-docs](https://pmarsceill.github.io/just-the-docs/)에서 볼 수 있습니다. jekyll 방법을 원하시면 [jekyll](https://jekyllrb.com/docs/)을 참고하시면 됩니다.

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