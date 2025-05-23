const { CreatePost } = require("../controllers/post/post.controller");
const { upload } = require("../middlewares/multer");

const router = require("express").Router();
// const {musicController} =require('../controllers');

router.post("/post", upload.array(), async (req, res) => {
    const data = await CreatePost(post_id, uid, category_id, title, content, imgPaths, videoPaths)
    res.json(data)
});

module.exports = router;
