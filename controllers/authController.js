const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/config");

// Check if a user ID is already in use
exports.checkIdDuplicate = async (req, res) => {
  try {
    const { uid } = req.body;

    // Validate input
    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "아이디를 입력해주세요.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { uid } });

    return res.status(200).json({
      success: true,
      isAvailable: !existingUser,
    });
  } catch (error) {
    console.error("Error checking ID duplicate:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { uid, upw, nick, gender, phone, dob, addr } = req.body;

    // Validate required fields
    if (!uid || !upw || !nick) {
      return res.status(400).json({
        success: false,
        message: "필수 항목을 모두 입력해주세요.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { uid } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "이미 사용중인 아이디입니다.",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(upw, saltRounds);

    // Set default profile image path
    const profImg = "/images/default_profile.png";

    // Create new user
    const newUser = await User.create({
      uid,
      upw: hashedPassword,
      nick,
      gender: gender || null,
      phone: phone || null,
      dob: dob || null,
      addr: addr || null,
      profImg,
    });

    // Generate JWT token
    const token = jwt.sign(
      { uid: newUser.uid, nick: newUser.nick },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success response
    return res.status(201).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};
