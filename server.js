require("dotenv").config();
const db = require("./models/config");
const cors = require("cors");
const express = require("express");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const bcrypt = require("bcrypt");
const { loginCheck } = require("./middlewares/authMiddleware");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());

const {
  mainRouter,
  postRouter,
  signRouter,
  mypageRouter,
  myprojectRouter,
  teamprojectRouter,
  authRouter,
} = require("./routers");

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
// app.use("/public", express.static(path.join(__dirname, "public")));
// app.use("/music", express.static(path.join(__dirname, "public/musics")));
// app.use(loginCheck);

// app.use("/", signRouter);
app.use("/main", mainRouter);
app.use("/post", postRouter);
app.use("/mypage", mypageRouter);
app.use("/myproject", myprojectRouter);
app.use("/teamproject", teamprojectRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Notionary API is running");
});

app.get("/kakao/login", (req, res) => {
  const kakaoAuth = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}`;
  res.redirect(kakaoAuth);
});

app.get("/auth/kakao/callback", async (req, res) => {
  const { code } = req.query;
  const tokenRequest = `https://kauth.kakao.com/oauth/token`;
  const data = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URL,
    code,
    client_secret: process.env.KAKAO_CLIENT_SECRET_KEY,
  });
  const tokenResponse = await axios.post(tokenRequest, data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const { access_token, refresh_token } = tokenResponse.data;

  const { data: userData } = await axios.get(
    "https://kapi.kakao.com/v2/user/me",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const { id, properties } = userData;
  const { nickname, profile_image } = properties;
  console.log(id, nickname, profile_image);
  // DB에 유저 정보 저장
  // 새로 가입한 유저는 DB에 저장
  // 기존 유저는 DB에서 정보 가져오기
  const user = await db.User.findOne({ where: { uid: id } });
  if (!user) {
    await db.User.create({
      uid: id,
      upw: "kakao",
      nick: nickname,
      profImg: profile_image,
    });
  }

  const token = jwt.sign({ id, properties }, "jwt_key", { expiresIn: "1h" });
  res.cookie("login_access_token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 60 * 1000,
  });
  res.cookie("kakao_access_token", access_token, {
    httpOnly: true,
    maxAge: 60 * 60 * 60 * 1000,
  });
  res.redirect("http://localhost:3000/main");
});

app.get("/logout", (req, res) => {
  // 로그아웃
  const redirect_kakao_logout = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_CLIENT_ID}&logout_redirect_uri=${process.env.LOGOUT_REDIRECT_URL}`;
  res.redirect(redirect_kakao_logout);
});
app.get("/auth/kakao/logout/callback", (req, res) => {
  // 로그아웃 콜백
  try {
    res.clearCookie("login_access_token");
    res.clearCookie("kakao_access_token");
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.listen(4000, () => {
  console.log("server on~");
});
