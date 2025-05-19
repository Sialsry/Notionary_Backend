const { Post, Category } = require('../../models/config');


// 일단 전체 카테고리에 대한 게시글 조회 함수수
const getAllPost = async () => {
  try {
    const data = await Category.findAll({
      include: [
        {
          model: Post,       
          attributes: ['post_id', 'category_id', 'title', 'imgPaths', 'content'],
        },
      ],
      raw: true, 
    });
    console.log(data);
    return { state: 200, message: '전체 게시글 조회 성공', data };
  } catch (error) {
    return { state: 404, message: '전체 게시글 조회 실패', error };
  }
};

(async () => {
    const result = await getAllPost();
    console.log('getAllPost 결과:', result);
})();


module.exports = { getAllPost };