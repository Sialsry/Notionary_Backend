const { getAllPost } = require("../controllers/post/post.controller");

const router = require("express").Router();
// const {musicController} =require('../controllers');

router.get("/", async (req, res) => {
    const data = await getAllPost();
    res.json(data);
});

module.exports = router;


