const { CreatePost, getUserWorkspaces } = require("../controllers/post/post.controller");
const { upload } = require("../middlewares/multer");

const router = require("express").Router();
// const {musicController} =require('../controllers');
   // console.log("서버에 전달될 목록",post_id, uid, category_id, title, content )
    // console.log("req.body:", req.body);
    // console.log("제목", req.body.title)
    // console.log("내용", req.body.content)

router.post("/", upload.array('media', 5), async (req, res) => {
    const { post_id, uid, category_id, fk_workspace_id, title, content , isWorkspaceShared, selectedPageIds,} = req.body;
 
    console.log("req.files:", req.files);
    const imgPaths = req.files
    .filter(file => file.mimetype.startsWith('image/'))
    .map(file => {
        const relativePath = file.path.replace(/\\/g, '/').replace(/^public\//, '');
        return `http://localhost:4000/${relativePath}`;
    });

    const videoPaths = req.files
    .filter(file => file.mimetype.startsWith('video/'))
    .map(file => {
        const relativePath = file.path.replace(/\\/g, '/').replace(/^public\//, '');
        return `http://localhost:4000/${relativePath}`;
    });

    const data = await CreatePost({post_id, uid, category_id, fk_workspace_id, title, content, imgPaths, videoPaths,  isWorkspaceShared,
    selectedPageIds,});

    res.json(data);
});

router.post("/getWorkspace", async (req, res) => {
    const { uid } = req.body;
    console.log("하 진짜", uid)
    const data = await getUserWorkspaces(uid)
    res.json(data);
})

module.exports = router;
