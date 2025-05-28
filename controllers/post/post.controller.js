const { sequelize } = require("../../models/config");
const { Post, Category, Comment, Heart } = require("../../models/config");

// 일단 전체 카테고리에 대한 게시글 조회 함수
const getAllPost = async () => {
  try {
    const data = await Category.findAll({
      where: { depth: 1 },
      include: [
        {
          model: Post,
          attributes: [
            "post_id",
            "uid",
            "category_id",
            "title",
            "imgPaths",
            "videoPaths",
            "content",
            "createdAt",
          ],
          include: [
            {
              model: Comment,
              attributes: ["uid", "post_id", "content", "createdAt"],
            },
            {
              model: Heart,
              attributes: ["uid"],
            },
          ],
        },
        {
          model: Category,
          as: "ParentCategory",
          attributes: ["category_name"],
        },
      ],
      order: [[{ model: Post }, "createdAt", "DESC"]],
    });

    const fixdata = data.map((category) => category.toJSON());

    return { state: 200, message: "전체 게시글 조회 성공", data: fixdata };
  } catch (error) {
    return { state: 404, message: "전체 게시글 조회 실패", error };
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
          attributes: [
            "post_id",
            "uid",
            "category_id",
            "title",
            "imgPaths",
            "videoPaths",
            "content",
            "createdAt",
          ],
          order: [["createdAt", "DESC"]],
        },
        {
          model: Category,
          as: "ParentCategory",
          attributes: ["category_name"],
          where: categoryName ? { category_name: categoryName } : {},
        },
      ],
      order: [[{ model: Post }, "createdAt", "DESC"]],
    });
    const fixdata = data.map((el) => el.toJSON());
    return {
      state: 200,
      message: "세부 카테고리 게시글 조회 성공!!!",
      data: fixdata,
    };
  } catch (error) {
    return { state: 484, message: "세부 카테고리 게시글 조회 실패!!", error };
  }
};

const CreatePost = async ({
  post_id,
  uid,
  category_id,
  title,
  content,
  imgPaths,
  videoPaths,
}) => {
  try {
    const data = await Post.create({
      post_id,
      uid,
      category_id,
      title,
      content,
      imgPaths: JSON.stringify(imgPaths),
      videoPaths: JSON.stringify(videoPaths),
    });
    return { state: 200, message: "게시글 등록 성공!!!", data };
  } catch (error) {
    return { state: 484, message: "게시글 등록 실패!!!", error };
  }
};

const getMyPost = async (req, res) => {
  try {
    const { uid } = req.user; // 로그인한 유저의 uid를 가져옵니다.
    console.log("내 게시글 조회를 위한 uid: ", uid);

    const data = await Post.findAll({
      where: { uid },
      order: [["createdAt", "DESC"]],
      attributes: [
        "post_id",
        "category_id",
        "title",
        "imgPaths",
        "content",
        "createdAt",
      ],
      include: [
        {
          model: Category,
          attributes: ["category_name"],
        },
        {
          model: Comment,
          attributes: ["id", "content", "createdAt"],
        },
        {
          model: Heart,
          attributes: ["uid"],
          required: false, // 좋아요가 없는 경우에도 게시글을 조회할 수 있도록 설정
        },
      ],
    });
    console.log("내 게시글 데이터: ", data);

    if (data.length === 0) {
      return { state: 404, message: "내 게시글이 없습니다." };
    }

    // JSON 형태로 변환하여 반환
    const formattedData = data.map((post) => post.toJSON());
    // 필요한 데이터 형태
    // {
    //   post_id: 1,
    // title: "첫 번째 게시글",
    // category_name: "프론트엔드",
    // imgPaths: null,
    // hearts: 10,
    // comments: 5,
    // created_at: "2023-10-01",
    //   }

    formattedData.forEach((post) => {
      post.category_name = post.Category.category_name; // 카테고리 이름 추가
      post.comments = post.Comments ? post.Comments.length : 0; // 댓글 개수 추가
      delete post.Category; // 불필요한 Category 필드 제거
      post.imgPaths = post.imgPaths ? post.imgPaths.split(",") : []; // 이미지 경로 배열로 변환
      post.created_at = post.createdAt.toISOString().split("T")[0]; // 날짜 형식 변환
      post.hearts = post.Hearts ? post.Hearts.length : 0; // 좋아요 개수 추가
      delete post.Hearts; // 불필요한 Hearts 필드 제거
    });

    console.log("포맷된 내 게시글 데이터: ", formattedData);

    return res.status(200).json({
      success: true,
      message: "내 게시글 조회 성공",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "내 게시글 조회 실패",
      error: error.message,
    });
  }
};

module.exports = {
  getAllPost,
  getSubPost,
  CreatePost,
  getMyPost,
};
