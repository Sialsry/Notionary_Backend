const jwt = require("jsonwebtoken");
const { User } = require("../models/config");

exports.auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "인증이 필요합니다.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    // Find user
    const user = await User.findOne({ where: { uid: decoded.uid } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "유효하지 않은 사용자입니다.",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "인증에 실패했습니다.",
    });
  }
};
