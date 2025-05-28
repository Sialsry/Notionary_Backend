const { Post, Category, Comment} = require('../../models/config');


// 일단 전체 카테고리에 대한 게시글 조회 함수수
const getAllPost = async () => {
  try {
    const data = await Category.findAll({
      where: { depth: 1 },
      include: [
      {
        model: Post,
        attributes: ['post_id', 'uid','category_id', 'title', 'imgPaths', 'videoPaths', 'content', 'createdAt'],
        include: [
          {
            model: Comment,
            attributes: ['uid', 'post_id', 'content', 'createdAt'],
          },
        ],
      },
      {
        model: Category,
        as: 'ParentCategory',
        attributes: ['category_name'],
      },
    ],
       order: [[{ model: Post }, 'createdAt', 'DESC']],
    });
    const fixdata = data.map(category => category.toJSON());

    // console.log(fixdata);
    return { state: 200, message: '전체 게시글 조회 성공', data : fixdata};
  } catch (error) {
    return { state: 404, message: '전체 게시글 조회 실패', error };
  }
};

// (async () => {
//     const result = await getAllPost();
//     console.dir(result, { depth: null }); 
// })();

// 세부 카테고리 데이터 조회 및 게시글 조회 함수
const getSubPost = async (categoryName, subCategory) => {
  try {
      const data = await Category.findAll({
      where: {
        depth: 2,
        ...(subCategory ? { category_name: subCategory } : {}),
      },
      include: [
        {
          model: Post,
          attributes: ['post_id', 'uid', 'category_id', 'title', 'imgPaths', 'videoPaths', 'content', 'createdAt'],
          order: [['createdAt', 'DESC']],
        },
        {
          model: Category,
          as: 'ParentCategory',
          attributes: ['category_name'],
          where: categoryName ? { category_name: categoryName } : {},
        }
      ],
      order: [[{ model: Post }, 'createdAt', 'DESC']],
    });
    const fixdata = data.map(el => el.toJSON());
    return {state: 200, message: '세부 카테고리 게시글 조회 성공!!!', data: fixdata,};
  } catch (error) {
    return {state: 484,message: '세부 카테고리 게시글 조회 실패!!',error};
  }
};



// (async () => {
//     const result = await getSubPost('기타');
//     console.log('getSubPost 결과:', result);
// })();

const CreatePost = async ({ post_id, uid, category_id, title, content, imgPaths, videoPaths }) => {
  try {
      const data =  await Post.create({ post_id, uid, category_id, title, content, imgPaths : JSON.stringify(imgPaths), videoPaths : JSON.stringify(videoPaths)})
      return {state : 200, message : "게시글 등록 성공!!!", data}
  } catch (error) {
      return {state : 484, message : "게시글 등록 실패!!!", error}
  }
}


// (async () => {
//   const result = await CreatePost({
//     post_id : "1",
//     uid: 'user1',
//     category_id: 1,
//     title: '게시글 등록 첫번째',
//     content: '게시글 내용ㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎ',
//     imgPaths: ['img1.jpg', 'img2.jpg'],
//     videoPaths: ['video1.mp4', 'video02.mp4']
//   });
//   console.log('CreatePost 결과:', result);
// })();



module.exports = { getAllPost , getSubPost, CreatePost};