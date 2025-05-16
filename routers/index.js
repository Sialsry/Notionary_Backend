const mainRouter = require("./mainRouter");
const postRouter = require("./postRouter");
const signRouter = require("./signRouter");
const mypageRouter = require("./mypageRouter");
const myprojectRouter = require("./myprojectRouter");
const teamprojectRouter = require("./teamprojectRouter");
const loginCheck = require("../middlewares/middleware");
const authRouter = require("./authRouter");

module.exports = {
  mainRouter,
  postRouter,
  signRouter,
  mypageRouter,
  myprojectRouter,
  teamprojectRouter,
  loginCheck,
  authRouter,
};
