const mysql = require("mysql2/promise");

// 데이터베이스 연결 설정
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "tkcjf9520!",
  database: "notionary",
};

// 카테고리 데이터
const categoryData = [
  [1, "전체", 1, null],
  [2, "IT", 1, null],
  [3, "기술스택", 1, null],
  [4, "디자인", 1, null],
  [5, "여행", 1, null],
  [6, "기타", 1, null],
  [7, "앱개발", 2, 2],
  [8, "웹 개발", 2, 2],
  [9, "개발 PM", 2, 2],
  [10, "블록체인 개발", 2, 2],
  [11, "데이터분석가", 2, 2],
  [12, "데이터 엔지니어", 2, 2],
  [13, "웹 마스터", 2, 2],
  [14, "백엔드/서버개발", 2, 2],
  [15, "프론트엔드", 2, 2],
  [16, "보안컨설팅", 2, 2],
  [17, "C언어", 2, 3],
  [18, "C++", 2, 3],
  [19, "C#", 2, 3],
  [20, "java", 2, 3],
  [21, "javscript", 2, 3],
  [22, "jQuery", 2, 3],
  [23, "Node.js", 2, 3],
  [24, "MySQL", 2, 3],
  [25, "React", 2, 3],
  [26, "HTML", 2, 3],
  [27, "CSS", 2, 3],
  [28, "Python", 2, 3],
  [29, "PHP", 2, 3],
  [30, "React-Native", 2, 3],
  [31, "Redux", 2, 3],
  [32, "가구디자인", 2, 4],
  [33, "그래픽 디자인", 2, 4],
  [34, "건축디자인", 2, 4],
  [35, "광고디자인", 2, 4],
  [36, "게임디자인", 2, 4],
  [37, "공간디자인", 2, 4],
  [38, "공공 디자인", 2, 4],
  [39, "공예디자인", 2, 4],
  [40, "로고 디자인", 2, 4],
  [41, "모바일 디자인", 2, 4],
  [42, "국내여행", 2, 5],
  [43, "해외여행", 2, 5],
  [44, "맛집 탐방", 2, 5],
  [45, "액티비티 여행", 2, 5],
  [46, "호캉스", 2, 5],
  [47, "캠핑", 2, 5],
  [48, "차박", 2, 5],
  [49, "역사 탐방", 2, 5],
  [50, "문화 체험", 2, 5],
  [51, "자연 경관 여행", 2, 5],
  [52, "자유 주제", 2, 6],
  [53, "Q&A", 2, 6],
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
