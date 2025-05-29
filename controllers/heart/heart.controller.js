const { Heart, User} = require('../../models/config')


const CreateHeart = async ({ post_id, uid }) => {
  try {
    await Heart.create({ post_id, uid });
    const hearts = await Heart.findAll({
      where: { post_id },
      include: [{
        model: User,
        attributes: ['nick', 'profImg']
      }]
    });

    const heartUsers = hearts.map(el => ({
      uid : el.uid, 
      nick: el.User.nick,
      profImg : el.User.profImg
    }));

    return {
      state: 200,
      message: "좋아요 성공 및 좋아요 유저 리스트 조회 완료",
      data: heartUsers
    };
  } catch (error) {
    return {
      state: 400,
      message: "좋아요 실패!!",
      error
    };
  }
};

// (async () => {
//   const result = await CreateHeart({
//     uid: 'suho123',
//     post_id: 3
//   });
//   console.log('CreateHeart 결과', result);
// })();

// (async () => {
//   const result = await CreateHeart({
//     uid: 'suho123',
//     post_id: 100
//   });
//   console.log('CreateHeart 결과', result);
// })();



// 좋아요 취소
const DeleteHeart = async({post_id, uid}) => {
    try {
        const data = await Heart.destroy({
                where : {post_id : post_id, uid : uid}
        })
        return {state : 200, message : "좋아요 취소", data}
    } catch (error) {
        return {state : 404, message : "좋아요 취소 실패!!", error}
    }
}

// (async () => {
//   const result = await DeleteHeart({
//     post_id : 8,
//     uid: 'suho123'
//   });
//   console.log('DeleteHeart 결과', result);
// })();


module.exports =  {CreateHeart, DeleteHeart}

