// 유저 라우터
const router = require("express").Router();
const userController = require("../controllers/userController");
const { auth } = require("../middlewares/authMiddleware");

// 유저 정보 조회
router.get("/info", auth, userController.getUserInfo);

// 유저 정보 수정
// router.put("/info", auth, userController.updateUserInfo);

// // 유저 비밀번호 변경
// router.put("/password", auth, userController.updateUserPassword);

// // 유저 프로필 사진 변경
// router.put("/profile", auth, userController.updateUserProfile);

// // 유저 탈퇴
// router.delete("/delete", auth, userController.deleteUser);

module.exports = router;
