const { Heart} = require('../../models/config')

const CreateHeart = async ({post_id, uid}) => {
    try {
        const data = await Heart.create({post_id, uid})
        return {state : 200, message : "좋아요 성공", data}
    } catch (error) {
        return {state : 400, message : "좋아요 실패!!", error}
    }
}

// (async () => {
//   const result = await CreateHeart({
//     uid: 'suho123',
//     post_id: 100
//   });
//   console.log('CreateHeart 결과', result);
// })();

module.exports =  {CreateHeart}

