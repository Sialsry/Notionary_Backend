const router = require("express").Router();
const detailController = require("../controllers/detailController");
const { auth } = require("../middlewares/authMiddleware");

// 게시글 상세 조회 (로그인 선택적)
router.get("/:post_id", auth, detailController.getPostDetail);

// 좋아요 토글 (로그인 필수)
router.post("/:post_id/like", auth, detailController.toggleLike);

// 댓글 관련 (로그인 필수)
router.post("/:post_id/comments", auth, detailController.createComment);
router.put("/comments/:comment_id", auth, detailController.updateComment);
router.delete("/comments/:comment_id", auth, detailController.deleteComment);

// 게시글 삭제 (로그인 필수)
router.delete("/:post_id", auth, detailController.deletePost);

module.exports = router;
