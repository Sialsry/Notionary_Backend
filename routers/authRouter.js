const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const loginController = require("../controllers/loginController");
const { auth } = require("../middlewares/authMiddleware");

// 기존 인증 관련 라우트
router.post("/check-id", authController.checkIdDuplicate);
router.post("/register", authController.register);

// 로그인 관련 라우트 추가
router.post("/login", loginController.login);
router.get("/verify", auth, loginController.verifyToken);

module.exports = router;
