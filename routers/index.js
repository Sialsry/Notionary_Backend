const mainRouter = require("./mainRouter");
const postRouter = require("./postRouter");
const userRouter = require("./userRouter");
const mypageRouter = require("./mypageRouter");
const myprojectRouter = require("./myprojectRouter");
const teamprojectRouter = require("./teamprojectRouter");
const authRouter = require("./authRouter");
const workspaceRouter = require("./workspaceRouter");
const detailRouter = require("./detailRouter");

module.exports = {
  workspaceRouter,
  mainRouter,
  postRouter,
  userRouter,
  mypageRouter,
  myprojectRouter,
  teamprojectRouter,
  authRouter,
  detailRouter,
};
