const { getAllCategory, getSubCategory } = require("../controllers/category/category.controller");
const { getAllPost, getSubPost } = require("../controllers/post/post.controller");

const router = require("express").Router();
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


// 전체 카테고리 조회 라우팅
router.get('/category', async(req, res) => {
    const data = await getAllCategory();
    console.log(data);
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


