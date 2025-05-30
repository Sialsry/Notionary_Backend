const mysql = require("mysql2/promise");

// 데이터베이스 연결 설정
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "bing123",
  database: "Reactproject",
};

// 카테고리 데이터
const categoryData = [
  // 1차 카테고리 (depth: 1)
  [1, "IT", 1, null],
  [2, "디자인", 1, null],
  [3, "교육", 1, null],
  [4, "금융", 1, null],
  [5, "취미", 1, null],
  [6, "기타", 1, null],

  // IT 하위 카테고리 (depth: 2, category_id_fk: 1)
  [7, "프로그래밍", 2, 1],
  [8, "인공지능", 2, 1],
  [9, "클라우드", 2, 1],
  [10, "사물인터넷", 2, 1],
  [11, "게임", 2, 1],
  [12, "네트워크", 2, 1],
  [13, "보안", 2, 1],
  [14, "기타", 2, 1],

  // 디자인 하위 카테고리 (depth: 2, category_id_fk: 2)
  [15, "UI/UX", 2, 2],
  [16, "그래픽디자인", 2, 2],
  [17, "건축디자인", 2, 2],
  [18, "공간디자인", 2, 2],
  [19, "기타", 2, 2],

  // 교육 하위 카테고리 (depth: 2, category_id_fk: 3)
  [20, "예체능", 2, 3],
  [21, "공학", 2, 3],
  [22, "의학", 2, 3],
  [23, "법학", 2, 3],
  [24, "인문학", 2, 3],
  [25, "사회과학", 2, 3],
  [26, "자연과학", 2, 3],
  [27, "기타", 2, 3],

  // 금융 하위 카테고리 (depth: 2, category_id_fk: 4)
  [28, "주식투자", 2, 4],
  [29, "가상화폐", 2, 4],
  [30, "부동산", 2, 4],
  [31, "재테크", 2, 4],
  [32, "기타", 2, 4],

  // 취미 하위 카테고리 (depth: 2, category_id_fk: 5)
  [33, "여행", 2, 5],
  [34, "스포츠/액티비티", 2, 5],
  [35, "예술/공예", 2, 5],
  [36, "독서/글쓰기", 2, 5],
  [37, "요리/음식", 2, 5],
  [38, "음악", 2, 5],
  [39, "게임", 2, 5],
  [40, "자연/힐링", 2, 5],
];

async function insertCategoryData() {
  let connection;

  try {
    // 데이터베이스 연결
    connection = await mysql.createConnection(dbConfig);
    console.log("데이터베이스에 연결되었습니다.");

    // INSERT 쿼리 수정
    const insertQuery = `
      INSERT INTO category (category_id, category_name, depth, category_id_fk) 
      VALUES ?
    `;

    // 데이터 삽입 실행 - 배열을 한 번 더 감싸야 함
    const [result] = await connection.query(insertQuery, [categoryData]);

    console.log(
      `성공적으로 ${result.affectedRows}개의 카테고리 데이터가 삽입되었습니다.`
    );
    console.log("삽입 완료!");
  } catch (error) {
    console.error("오류 발생:", error.message);

    // 중복 키 오류인 경우
    if (error.code === "ER_DUP_ENTRY") {
      console.log("중복된 데이터가 있습니다. 기존 데이터를 확인해주세요.");
    }
  } finally {
    // 연결 종료
    if (connection) {
      await connection.end();
      console.log("데이터베이스 연결이 종료되었습니다.");
    }
  }
}

// 함수 실행
insertCategoryData();
