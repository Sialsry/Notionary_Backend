// multerMiddleware.js - 파일명 정리 버전
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { User } = require("../models/config");

// 업로드할 폴더 경로
const uploadDir = path.join(__dirname, "..", "uploads", "profile");
// 폴더가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 파일명 정리 함수
const sanitizeFilename = (filename) => {
  return filename
    .replace(/\s+/g, "_") // 공백을 언더스코어로 변경
    .replace(/[^\w\-_.]/g, "") // 영문, 숫자, 하이픈, 언더스코어, 점만 허용
    .replace(/_{2,}/g, "_") // 연속된 언더스코어를 하나로
    .toLowerCase(); // 소문자로 변환
};

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);

    // 원본 파일명에서 확장자 제거하고 정리
    let baseName = path.basename(file.originalname, ext);

    // UTF-8 디코딩 처리
    try {
      baseName = Buffer.from(baseName, "latin1").toString("utf8");
    } catch (error) {
      console.log("파일명 디코딩 실패, 원본 사용:", baseName);
    }

    // 파일명 정리
    const sanitizedName = sanitizeFilename(baseName);

    // 타임스탬프와 랜덤 문자열 추가로 중복 방지
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const finalName = `${sanitizedName}_${timestamp}_${randomString}${ext}`;

    console.log("원본 파일명:", file.originalname);
    console.log("정리된 파일명:", finalName);

    cb(null, finalName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    if (!allowedExts.includes(ext)) {
      return cb(
        new Error(
          `허용되지 않는 파일 형식입니다. 허용 형식: ${allowedExts.join(", ")}`
        )
      );
    }
    cb(null, true);
  },
});

// 프로필 사진 업로드 미들웨어
const profileUpload = (req, res, next) => {
  upload.single("profImg")(req, res, (err) => {
    if (err) {
      console.error("파일 업로드 오류:", err);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};

module.exports = {
  upload,
  profileUpload,
};
