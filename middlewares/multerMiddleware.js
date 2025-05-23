// multer 미들웨어. 유저 프로필 사진 업로드를 위한 미들웨어
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { User } = require("../models/config");
const { Op } = require("sequelize");

// 업로드할 폴더 경로
const uploadDir = path.join(__dirname, "..", "uploads", "profile");
// 폴더가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new Error("Only .jpg, .jpeg and .png files are allowed"));
    }
    cb(null, true);
  },
});
// 프로필 사진 업로드 미들웨어
const profileUpload = (req, res, next) => {
  upload.single("profImg")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};
// 프로필 사진 삭제 미들웨어
