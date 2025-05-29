// userController.js - 개선된 버전

const { User } = require("../models/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
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
    const { nick, gender, phone, dob, addr } = req.body;

    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    // 현재 유저 정보 조회
    const currentUser = await User.findOne({
      where: { uid },
      attributes: ["profImg"],
    });

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    // 업데이트할 사용자 데이터 객체
    const updateData = {
      nick: nick || currentUser.nick,
      gender: gender || currentUser.gender,
      phone: phone || currentUser.phone,
      dob: dob || currentUser.dob,
      addr: addr || currentUser.addr,
    };

    // 프로필 사진이 업로드된 경우
    if (req.file) {
      // 기존 프로필 사진 삭제 (선택사항)
      if (currentUser.profImg && !currentUser.profImg.startsWith("http")) {
        const oldProfImgPath = path.join(
          __dirname,
          "..",
          "uploads",
          "profile",
          path.basename(currentUser.profImg)
        );
        if (fs.existsSync(oldProfImgPath)) {
          try {
            fs.unlinkSync(oldProfImgPath);
            console.log("기존 프로필 이미지 삭제 완료");
          } catch (unlinkError) {
            console.error("기존 파일 삭제 실패:", unlinkError);
          }
        }
      }

      // 새 프로필 이미지 URL 설정
      updateData.profImg = `http://localhost:4000/uploads/profile/${req.file.filename}`;
      console.log("새 프로필 이미지 URL:", updateData.profImg);
    }

    // 데이터베이스 업데이트
    const [updatedRows] = await User.update(updateData, {
      where: { uid },
    });

    if (updatedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "업데이트할 정보가 없습니다.",
      });
    }

    // 업데이트된 유저 정보 반환
    const updatedUser = await User.findOne({
      where: { uid },
      attributes: ["uid", "nick", "profImg", "gender", "phone", "dob", "addr"],
    });

    return res.status(200).json({
      success: true,
      message: "유저 정보가 업데이트되었습니다.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user info:", error);

    // 업로드된 파일이 있다면 삭제 (에러 시 정리)
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("임시 파일 삭제 실패:", unlinkError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
