// 유저 컨트롤러
const { User } = require("../models/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
// const { upload } = require("../middlewares/multerMiddleware");
const fs = require("fs");
const path = require("path");

// 유저 정보 조회
exports.getUserInfo = async (req, res) => {
  try {
    const { uid } = req.user;
    const user = await User.findOne({
      where: { uid },
      attributes: ["uid", "nick", "profImg", "gender", "phone", "dob", "addr"],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "유저 정보를 찾을 수 없습니다.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "유저 정보를 조회했습니다.",
      user,
    });
  } catch (error) {
    console.error("Error getting user info:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

// 유저 정보 수정: nick, profImg, phone, dob, address, gender

// 유저 비밀번호 변경: upw

// 유저 탈퇴
