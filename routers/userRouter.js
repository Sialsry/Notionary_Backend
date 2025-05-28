// 유저 라우터
const router = require("express").Router();
const userController = require("../controllers/userController");
const { auth } = require("../middlewares/authMiddleware");
const { profileUpload } = require("../middlewares/multerMiddleware");

// 유저 정보 조회
router.get("/info", auth, userController.getUserInfo);

// 유저 정보 수정. multer 미들웨어 사용
router.post(
  "/update",
  auth,
  profileUpload, // 프로필 사진 업로드 미들웨어
  userController.updateUserInfo
);

module.exports = router;
