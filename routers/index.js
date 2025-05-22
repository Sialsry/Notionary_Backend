const mainRouter = require("./mainRouter");
const postRouter = require("./postRouter");
const signRouter = require("./signRouter");
const mypageRouter = require("./mypageRouter");
const myprojectRouter = require("./myprojectRouter");
const teamprojectRouter = require("./teamprojectRouter");
const loginCheck = require("./middleware");
const workspaceRouter = require('./workspaceRouter')

module.exports = {
  workspaceRouter,
  mainRouter,
  postRouter,
  signRouter,
  mypageRouter,
  myprojectRouter,
  teamprojectRouter,
  loginCheck,
};
