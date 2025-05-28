const router = require("express").Router();
const { getMyPost } = require("../controllers/post/post.controller");
const { auth } = require("../middlewares/authMiddleware");

router.get("/getMyPost", auth, getMyPost);

module.exports = router;
