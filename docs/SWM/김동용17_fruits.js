// 매월 25일 출력

const servingFruits = (season, day) => { // 제공하는 과일
  if (season === "봄" || season === "여름") {
    if (day % 10 === 1 || day % 10 === 5) return "딸기";
    if (day % 10 === 3 || day % 10 === 7) return "수박";
    return null;
  } else {
    if (day % 10 === 1 || day % 10 === 5) return "사과";
    if (day % 10 === 3 || day % 10 === 7) return "배";
    return null;
  }
};

const servingQuantityPerPerson = (fruitName, personNum) => { // 사람 당 제공하는 과일의 갯수
  if (fruitName === "딸기") return personNum * 5;
  if (fruitName === "수박") return Math.ceil(personNum % 10);
  if (fruitName === "사과") return personNum;
  else Math.ceil(personNum % 2);
};

const separateSeason = (month) => { // 계절 구분하기
  switch (month) {
    case [3, 4, 5].includes(month):
      return "봄";
    case [6, 7, 8].includes(month):
      return "여름";
    case [9, 10, 11].includes(month):
      return "가을";
    case [12, 1, 2].includes(month):
      return "겨울";
  }
};

const DAY_NUM = 30; // 날짜 수

const desertPurchaseStatement = (month, personNum) => { // 디저트 구매내역서
  const season = separateSeason(month); // 계절 구분해서 season에 저장

  for (let i = 1; i <= DAY_NUM; i++) { // 날짜 수만큼 반복
    const fruitName = servingFruits(season, i); // 제공하는 과일을 과일 이름 변수에 저장
    const fruitQuantity = servingQuantityPerPerson(fruitName, personNum); // 사람 당 제공하는 과일의 개수를 과일 양 변수에 저장
    console.log(
      month + "월" + i + "일:" + fruitName + " " + fruitQuantity + "개" // ex) 3월 1일: 딸기 350개 출력
    );
  }
};

desertPurchaseStatement(3, 71);