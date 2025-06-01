require("dotenv").config();
const db = require("./models/config");
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());

const {
  mainRouter,
  postRouter,
  userRouter,
  mypageRouter,
  myprojectRouter,
  teamprojectRouter,
  authRouter,
  workspaceRouter,
  detailRouter,
} = require("./routers");
const { getCookie } = require("./middlewares/Cookie.middleware");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({limit : "100MB"}));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ limit: "100MB", extended: false }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
// app.use("/music", express.static(path.join(__dirname, "public/musics")));

app.use("/user", userRouter);
app.use("/main", mainRouter);
app.use("/post", postRouter);
app.use("/mypage", mypageRouter);
app.use("/myproject", myprojectRouter);
app.use("/teamproject", teamprojectRouter);
app.use("/api/auth", authRouter);
app.use("/workspace", workspaceRouter);
app.use("/detail", detailRouter);


app.get("/", (req, res) => {
  console.log("cookie11111");
  // getCookie(req, res, next);
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

  const token = jwt.sign({ uid: id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  res.cookie("login_access_token", token, {
    httpOnly: false,
    maxAge: 120 * 60 * 60 * 1000,
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
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.listen(4000, () => {
  console.log("server on~");
});
