const { Category } = require("../../models/config")


// 전체 카테고리 데이터 가져오는 함수
const getAllCategory = async () => {
    try {
        const data =  await Category.findAll({
            order : [['category_id', 'ASC']],
            attributes : ['category_id', 'category_name'],
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


const getSubCategory = () => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = {getAllCategory, getSubCategory}