const mainRouter = require("./mainRouter");
const postRouter = require("./postRouter");
const userRouter = require("./userRouter");
const mypageRouter = require("./mypageRouter");
const myprojectRouter = require("./myprojectRouter");
const teamprojectRouter = require("./teamprojectRouter");
const loginCheck = require("../middlewares/middleware");
const authRouter = require("./authRouter");

module.exports = {
  mainRouter,
  postRouter,
  userRouter,
  mypageRouter,
  myprojectRouter,
  teamprojectRouter,
  loginCheck,
  authRouter,
};
