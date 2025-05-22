const { Category } = require("../../models/config")


// 전체 카테고리 데이터 가져오는 함수
const getAllCategory = async () => {
    try {
        const data =  await Category.findAll({
            order : [['category_id', 'ASC']],
            attributes : ['category_id', 'category_name'],
            raw :true
        });
        // console.log(data);
        return {state : 200, message : "전체 카테고리 조회 성공", data}
    } catch (error) {
        return {state: 404, message : "전체 카테고리 조회 실패!", error}
    }
}
// (async () => {
//     const result = await getAllCategory();
//     console.log('getAllCategory 결과:', result);
// })();


// 대표 카테고리 안에 있는 세부 카테고리 조회 함수
// const getSubCategory = async () => {
//     try {
//         const data = await Category.findAll({
//             where : { depth : 1},
//             include : [{
//                 model : Category,
//                 as : 'SubCategory',
//             }],
//             raw :true
//         });
//         return { state : 200 , message : "세부 카테고리 조회", data}
//     } catch (error) {
//         return {state : 406, message : "세부 카테고리 조회 실패!", error}        
//     }
// }


// (async () => {
//     const result = await getSubCategory();
//     console.log('getSubCategory 결과:', result);
// })();
module.exports = {getAllCategory}