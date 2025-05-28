const {Comment, User} = require('../../models/config')

const CreateComment = async ({uid, post_id, category_id, content}) => {
    try {
        console.log('CreateComment 호출 인자:', { uid, post_id, category_id, content });
        const data = await Comment.create({uid, post_id, category_id, content})
        return {state : 200, message : "댓글 추가 성공", data}
    } catch (error) {
        return {state : 400, message : "댓글 추가 실패", error} 
    }
}

// (async () => {
// const result = await CreateComment({
//   uid: 'suho123',
//   post_id: 100,
//   category_id: 2,
//   content: '게시글 내용ㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎ'
// });

//   console.log('CreatePost 결과:', result);
// })();
const getAllComment = async (post_id) => {
  try {
    const data = await Comment.findAll({
      where: { post_id },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: User,
          attributes: ['nick', 'profImg'],
        }
      ]
    });
    // console.log('댓글 조회 결과:', data);
    return { state: 200, message: "댓글 조회 성공", data };
  } catch (error) {
    return { state: 500, message: "댓글 조회 실패", error };
  }
};
// (async () => {
//   const result = await getAllComment(100);
//   console.log('결과:', result);
// })();


module.exports = {CreateComment, getAllComment}