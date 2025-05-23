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

// 유저 정보 수정
exports.updateUserInfo = async (req, res) => {
  try {
    const { uid } = req.user;
    console.log("req.user", req.user);
    console.log("req.body", req.body);
    // 프로필 사진이 업로드된 경우
    if (req.file) {
      const oldProfImg = await User.findOne({
        where: { uid },
        attributes: ["profImg"],
      });
      const oldProfImgPath = path.join(
        __dirname,
        "..",
        "uploads",
        "profile",
        oldProfImg.profImg
      );
      // 기존 프로필 사진 삭제
      if (fs.existsSync(oldProfImgPath)) {
        fs.unlinkSync(oldProfImgPath);
      }
      req.body.profImg = req.file.filename;
    }
    await User.update({
      where: { uid },
      // profImg: req.body.profImg,
      nick: req.body.nick,
      phone: req.body.phone,
      dob: req.body.dob,
      addr: req.body.addr,
    });
  } catch (error) {
    console.error("Error updating user info:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};
