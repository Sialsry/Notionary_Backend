const { CreatePost } = require("../controllers/post/post.controller");
const { upload } = require("../middlewares/multer");

const router = require("express").Router();
// const {musicController} =require('../controllers');

router.post("/", upload.array('media', 5), async (req, res) => {
    const { post_id, uid, category_id, title, content } = req.body;
    console.log("서버에 전달될 목록",post_id, uid, category_id, title, content )
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
    const imgPaths = req.files
    .filter(file => file.mimetype.startsWith('image/'))
    .map(file => file.path);

    const videoPaths = req.files
    .filter(file => file.mimetype.startsWith('video/'))
    .map(file => file.path);

    const data = await CreatePost({post_id, uid, category_id, title, content, imgPaths, videoPaths})
    res.json(data)
});

module.exports = router;
