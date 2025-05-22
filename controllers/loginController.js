const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/config");

// Login controller
exports.login = async (req, res) => {
  try {
    const { uid, upw } = req.body;

    // Validate input
    if (!uid || !upw) {
      return res.status(400).json({
        success: false,
        message: "아이디와 비밀번호를 모두 입력해주세요.",
      });
    }

    // Find user
    const user = await User.findOne({ where: { uid } });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "아이디 또는 비밀번호가 일치하지 않습니다.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(upw, user.upw);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "아이디 또는 비밀번호가 일치하지 않습니다.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { uid: user.uid, nick: user.nick },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success response with token
    return res.status(200).json({
      success: true,
      message: "로그인에 성공했습니다.",
      token,
      user: {
        uid: user.uid,
        nick: user.nick,
        profImg: user.profImg,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

// Verify token is valid
exports.verifyToken = async (req, res) => {
  try {
    // User is already verified by auth middleware
    return res.status(200).json({
      success: true,
      user: {
        uid: req.user.uid,
        nick: req.user.nick,
        profImg: req.user.profImg,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "인증에 실패했습니다.",
    });
  }
};
