const router = require("express").Router();
const { getMyPost } = require("../controllers/post/post.controller");
const mypageController = require("../controllers/mypageController");
const { auth } = require("../middlewares/authMiddleware");

router.get("/getMyPost", auth, getMyPost);

router.get("/getLikedPosts", auth, mypageController.getLikedPosts);

router.get("/getCommentedPosts", auth, mypageController.getCommentedPosts);

router.get("/getMyWorkspace", auth, mypageController.getMyWorkspace);

module.exports = router;
