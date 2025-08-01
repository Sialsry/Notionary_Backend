const {
  CreatePost,
  getUserWorkspaces,
  UpdatePost,
  getPostById,
} = require("../controllers/post/post.controller");
const { upload } = require("../middlewares/multer");

const router = require("express").Router();
// const {musicController} =require('../controllers');
// console.log("서버에 전달될 목록",post_id, uid, category_id, title, content )
// console.log("req.body:", req.body);
// console.log("제목", req.body.title)
// console.log("내용", req.body.content)

router.post("/", upload.array("media", 5), async (req, res) => {
  const {
    post_id,
    uid,
    category_id,
    fk_workspace_id,
    title,
    content,
    isWorkspaceShared,
    workSpace_pages,
  } = req.body;
  const workspace_pages = JSON.stringify(
    workSpace_pages?.split(",").map((s) => Number(s.trim()))
  );
  console.log("fk1111", fk_workspace_id, workspace_pages);

  console.log("req.files:", req.files);
  const imgPaths = req.files
    .filter((file) => file.mimetype.startsWith("image/"))
    .map((file) => {
      const relativePath = file.path
        .replace(/\\/g, "/")
        .replace(/^public\//, "");
      return `http://localhost:4000/${relativePath}`;
    });

  const videoPaths = req.files
    .filter((file) => file.mimetype.startsWith("video/"))
    .map((file) => {
      const relativePath = file.path
        .replace(/\\/g, "/")
        .replace(/^public\//, "");
      return `http://localhost:4000/${relativePath}`;
    });

  const data = await CreatePost({
    post_id,
    uid,
    category_id,
    fk_workspace_id,
    title,
    content,
    imgPaths,
    videoPaths,
    isWorkspaceShared,
    workspace_pages,
  });

  res.json(data);
});

router.post("/getWorkspace", async (req, res) => {
  const { uid } = req.body;
  console.log("하 진짜", uid);
  const data = await getUserWorkspaces(uid);
  res.json(data);
});

router.put("/edit/:post_id", upload.array("media", 5), async (req, res) => {
  const { post_id } = req.params;
  const { uid, category_id, title, content } = req.body;
  console.log("▶▶▶ 백엔드 디버그: req.body.uid 값:", req.body.uid);

  const imgPaths = req.files
    .filter((file) => file.mimetype.startsWith("image/"))
    .map((file) => {
      const relativePath = file.path
        .replace(/\\/g, "/")
        .replace(/^public\//, "");
      return `http://localhost:4000/${relativePath}`;
    });

  const videoPaths = req.files
    .filter((file) => file.mimetype.startsWith("video/"))
    .map((file) => {
      const relativePath = file.path
        .replace(/\\/g, "/")
        .replace(/^public\//, "");
      return `http://localhost:4000/${relativePath}`;
    });
  const data = await UpdatePost({
    post_id,
    uid,
    category_id,
    title,
    content,
    imgPaths,
    videoPaths,
  });
  res.json(data);
});

router.get("/:post_id", async (req, res) => {
  const { post_id } = req.params;
  //   console.log("해당 게시글 ID",post_id)
  const data = await getPostById(post_id);
  res.json(data);
});

module.exports = router;
