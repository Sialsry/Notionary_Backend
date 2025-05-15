const mainRouter = require("./mainRouter");
const postRouter = require("./postRouter");
const signRouter = require("./signRouter");
const mypageRouter = require("./mypageRouter");
const myprojectRouter = require("./myprojectRouter");
const teamprojectRouter = require("./teamporjectRouter");
const loginCheck = require("./middleware");

module.exports = {
  mainRouter,
  postRouter,
  signRouter,
  mypageRouter,
  myprojectRouter,
  teamprojectRouter,
  loginCheck,
};
