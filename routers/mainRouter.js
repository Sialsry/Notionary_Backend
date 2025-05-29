const { getAllCategory, getSubCategory } = require("../controllers/category/category.controller");
const { CreateComment, getAllComment } = require("../controllers/comment/comment.controller");
const { CreateHeart, DeleteHeart } = require("../controllers/heart/heart.controller");
const { getAllPost, getSubPost, getEtcPost } = require("../controllers/post/post.controller");

const router = require("express").Router();
const axios = require("axios");
// const {musicController} =require('../controllers');



// 전체 게시글 조회 라우팅
router.get("/", async (req, res) => {
    const data = await getAllPost();
    res.json(data);
});

// 세부 카테고리 게시글 조회 라우팅
router.post('/subpost', async(req, res) => {
    const { category_name , SubCategory} = req.body;
    console.log("요청된 카테고리 이름",category_name)
    console.log("요청된 세부 카테고리들", SubCategory);
    const data  = await getSubPost(category_name, SubCategory)
    res.json(data);
})

// 기타 카테고리 게시글 조회 라우팅
router.get("/etc", async (req, res) => {
  const data = await getEtcPost();
  res.json(data);
});
// 전체 카테고리 조회 라우팅
router.get('/category', async(req, res) => {
    const data = await getAllCategory();
    console.log(data);
    res.json(data);
})

// 댓글 추가 라우팅
router.post('/comment', async(req, res) => {
    const { uid, post_id, category_id,  content } = req.body;
    // console.log("찍히냐고",uid, post_id, category_id,  content);
    const data = await CreateComment({ uid, post_id, category_id, content })
    res.json(data);
})


// 게시글 댓글 조회 라우팅팅
router.get('/comment/:post_id', async (req, res) => {
    const { post_id } = req.params;
    console.log(post_id)
    const data = await getAllComment(post_id);
    res.json(data);
})

// 게시글 좋아요 추가 라우팅
router.post('/heart', async(req, res) => {
    console.log("좋아요 추가 및 조회", req.body)
    const {uid, post_id} = req.body;
    const data = await CreateHeart({uid, post_id})
    res.json(data);
})

// 게시글 좋아요 취소 라우팅
router.delete('/heartDelete', async (req, res) => {
    console.log('요청 바디', req.body);
    const {uid, post_id} = req.body;
    const data = await DeleteHeart({uid, post_id})
    res.json(data);
})

// // 세부 카테고리 조회 라우팅
// router.get('/category/:id', async (req, res) => {
//     const categoryId = req.params.id;
//     console.log(categoryId, "12232");
//     const data  = await getSubCategory();
//     res.json(data);
// })





module.exports = router;


