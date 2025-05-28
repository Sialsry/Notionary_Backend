const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// Base64 또는 URL 이미지를 파일로 저장
async function saveImage(imageData, directory = "uploads/profile") {
  // 디렉토리가 없으면 생성
  const uploadDir = path.join(__dirname, "..", directory);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${uuidv4()}.jpg`;
  const filePath = path.join(uploadDir, fileName);

  // URL인 경우 다운로드
  if (imageData.startsWith("http")) {
    const response = await axios.get(imageData, {
      responseType: "arraybuffer",
    });
    fs.writeFileSync(filePath, response.data);
    return `/${directory}/${fileName}`;
  }

  // Base64 인 경우 파일로 저장
  if (imageData.startsWith("data:image")) {
    const base64Data = imageData.split(";base64,").pop();
    fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
    return `/${directory}/${fileName}`;
  }

  // db에 저장

  return imageData; // 이미 경로인 경우 그대로 반환
}

module.exports = { saveImage };
