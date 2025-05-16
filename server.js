require("dotenv").config();
const db = require("./models/config");
const cors = require("cors");
const express = require("express");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const morgan = require("morgan");

const {
  mainRouter,
  postRouter,
  signRouter,
  mypageRouter,
  myprojectRouter,
  teamprojectRouter,
  authRouter,
} = require("./routers");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
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
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Notionary API is running");
});

app.listen(4000, (req, res) => {
  console.log("server on~");
});
