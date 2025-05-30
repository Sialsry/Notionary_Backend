require("dotenv").config({ path: "../.env" });
const Sequelize = require("sequelize");
const User = require("./user");
const Team = require("./team");
const Post = require("./post");
const Comment = require("./comment");
const Category = require("./category");
const Heart = require("./heart");
const MyProject = require("./myproject");
const TeamProject = require("./teamproject");
const Workspace = require("./workspace");
const Workspacectgrs = require("./workspace.ctgrs");
const Page = require("./page");

const sequelize = new Sequelize(
  process.env.DATABASE_NAME, // 사용할 데이터 베이스 이름
  process.env.DATABASE_USER, // 사용할 계정(유저) 이름
  process.env.DATABASE_PASSWORD, // 사용할 계정의 비밀번호
  {
    // 사용할 데이터베이스의 속성
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    port: process.env.DATABASE_PORT,
  }
);
const page = Page.init(sequelize);
const workspacectgrs = Workspacectgrs.init(sequelize);
const workspace = Workspace.init(sequelize);
const user = User.init(sequelize);
const team = Team.init(sequelize);
const post = Post.init(sequelize);
const comment = Comment.init(sequelize);
const category = Category.init(sequelize);
const heart = Heart.init(sequelize);
const myproject = MyProject.init(sequelize);
const teamproject = TeamProject.init(sequelize);

const db = {
  Page: page,
  Workspacectgrs: workspacectgrs,
  Workspace: workspace,
  User: user,
  Team: team,
  Post: post,
  Comment: comment,
  Category: category,
  Heart: heart,
  MyProject: myproject,
  TeamProject: teamproject,
};

workspacectgrs.associate(db);
workspace.associate(db);
page.associate(db);
user.associate(db);
team.associate(db);
post.associate(db);
comment.associate(db);
category.associate(db);
heart.associate(db);
myproject.associate(db);
teamproject.associate(db);

sequelize
  .sync({ force: false  })
  .then(() => {
    console.log("시퀄라이즈 연결 성공");
  })
  .catch(console.log);

module.exports = db;

const datainit = async () => {
  const data = ["개인 워크스페이스"];
  await Promise.all(
    data.map((el) => {
      console.log(el, "hey");
      Workspace.create({
        workspace_name: el,
      });
    })
  );
};

// datainit();
