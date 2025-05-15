require("dotenv").config();
require("./models/config");
const express = require("express");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const {
  loginCheck,
  mainRouter,
  postRouter,
  signRouter,
  mypageRouter,
  myprojectRouter,
  teamprojectRouter,
} = require("./routers");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use("/public", express.static(path.join(__dirname, "public")));
// app.use("/music", express.static(path.join(__dirname, "public/musics")));
// app.use(cookieParser());
// app.use(loginCheck);

app.use("/", signRouter);
app.use("/main", mainRouter);
app.use("/post", postRouter);
app.use("/mypage", mypageRouter);
app.use("/myproject", myprojectRouter);
app.use("/teamproject", teamprojectRouter);

app.listen(4000, (req, res) => {
  console.log("server on~");
});
