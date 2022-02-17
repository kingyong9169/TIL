---
layout: page
title: navigation
parent: admin 개발
grand_parent: CMI 프로젝트 기록
nav_order: 1
has_children: false
permalink: /cmi/admin/navigation
---

# navigation
admin 웹사이트에서는 기존에는 scraper로만 이루어져 있었습니다. 하지만 학생회가 공지사항을 올릴 수 있는 공간을 만들고자 admin 사이트에서 게시판을 만들게 되었고 그로 인해 navigation 또한 기존의 공지사항, 학생 식당, 기숙사 식당, 학사일정 이 2개에서

```
게시판
|-- 게시글 목록
|-- 게시글 작성
스크래퍼
|-- 공지사항
|-- 학생 식당
|-- 기숙사 식당
|-- 학사일정
```

이러한 구조로 바꾸게 되었습니다.

기존에는 스크래퍼 페이지 밖에 없어 navigation을 ScraperPage컴포넌트에서 import 했지만 BoardPage에서도 navigation이 필요하기 때문에 App 컴포넌트에서 navigation을 import해야 했습니다. 하지만 로그인 페이지에서 navigation이 보이면 안되기 때문에 useMatch 훅을 통해 login path와 일치하면 navigation을 return하지 않도록 했습니다. 여기서 주의할 점은 router-router-dom 훅은 router 컴포넌트 내부에서 사용해야 한다는 것입니다.