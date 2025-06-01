const { where } = require("sequelize");
const {
  Post,
  Category,
  Comment,
  Heart,
  User,
  Workspacectgrs,
} = require("../../models/config");

// 일단 전체 카테고리에 대한 게시글 조회 함수
const getAllPost = async () => {
  try {
    const data = await Category.findAll({
      where: { depth: [1, 2] },
      include: [
        {
          model: Post,
          attributes: [
            "post_id",
            "uid",
            "category_id",
            "fk_workspace_id",
            "workspace_pages",
            "title",
            "imgPaths",
            "videoPaths",
            "content",
            "createdAt",
          ],
          include: [
            {
              model: User,
              attributes: ["nick", "profImg"],
            },
            {
              model: Comment,
              attributes: ["uid", "post_id", "content", "createdAt"],
            },
            {
              model: Heart,
              attributes: ["uid"],
            },
            {
              model: Workspacectgrs,
              attributes: [
                "workspace_id",
                "workspace_name",
                "workspacectgrs_name",
                "depth",
                "workspacesubctgrs_name",
                "parent_id",
              ],
            },
          ],
        },
        {
          model: Category,
          as: "ParentCategory",
          attributes: ["category_name", "depth"],
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
          include: [
            {
              model: User,
              attributes: ["nick", "profImg"],
            },
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
          attributes: ["category_name", "depth"],
          where: categoryName ? { category_name: categoryName } : {},
        },
      ],
      order: [[{ model: Post }, "createdAt", "DESC"]],
    });

    const fixdata = data.map((category) => category.toJSON());

    return {
      state: 200,
      message: "세부 카테고리 게시글 조회 성공!!!",
      data: fixdata,
    };
  } catch (error) {
    return { state: 484, message: "세부 카테고리 게시글 조회 실패!!", error };
  }
};

// (async () => {
// const result = await getSubPost();
//  console.dir(result, { depth: null });
// })();

// 기타 게시글 조회 함수
const getEtcPost = async () => {
  try {
    const data = await Category.findAll({
      where: { category_id: 6 },
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
              model: User,
              attributes: ["nick", "profImg"],
            },
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
          attributes: ["category_name", "depth"],
        },
      ],
      order: [[{ model: Post }, "createdAt", "DESC"]],
    });

    const fixdata = data.map((post) => post.toJSON());

    return {
      state: 200,
      message: "기타 카테고리 게시글 조회 성공",
      data: fixdata,
    };
  } catch (error) {
    return { state: 404, message: "기타 카테고리 게시글 조회 실패", error };
  }
};

// (async () => {
//   const result = await getEtcPost();
//   console.dir(result, { depth: null });
// })();

const CreatePost = async ({
  post_id,
  uid,
  category_id,
  fk_workspace_id,
  title,
  content,
  imgPaths,
  videoPaths,
  isWorkspaceShared,
  workspace_pages,
}) => {
  console.log(
    post_id,
    uid,
    category_id,
    fk_workspace_id,
    title,
    content,
    imgPaths,
    videoPaths,
    isWorkspaceShared,
    workspace_pages,
    "kkkk"
  );
  try {
    const category = await Category.findByPk(category_id);
    if (!category) {
      return { state: 404, message: "유효하지 않은 카테고리입니다." };
    }

    if (category.depth !== 2 && category.category_name !== "기타") {
      return {
        state: 400,
        message: "게시글은 세부 카테고리에만 등록할 수 있습니다.",
      };
    }

    const shared = isWorkspaceShared === true || isWorkspaceShared === "true";

    if (!shared) {
      fk_workspace_id = null;
    } else {
      if (!fk_workspace_id || !workspace_pages) {
        return {
          state: 400,
          message:
            "워크스페이스 공유를 선택한 경우, 워크스페이스 및 페이지 ID는 필수입니다.",
        };
      }
    }

    const data = await Post.create({
      post_id,
      uid,
      category_id,
      fk_workspace_id,
      workspace_pages,
      title,
      content,
      imgPaths: JSON.stringify(imgPaths),
      videoPaths: JSON.stringify(videoPaths),
      isWorkspaceShared,
      workspace_pages,
    });

    return { state: 200, message: "게시글 등록 성공!!!", data };
  } catch (error) {
    console.log(error, "error");
    return { state: 484, message: "게시글 등록 실패!!!", error };
  }
};

const UpdatePost = async ({
  post_id,
  uid,
  title,
  content,
  category_id,
  imgPaths,
  videoPaths,
}) => {
  try {
    const post = await Post.findByPk(post_id);
    if (!post) {
      return { state: 404, message: "해당 게시글을 찾을 수 없습니다." };
    }

    const data = await Post.update(
      {
        title,
        uid,
        content,
        category_id,
        imgPaths: JSON.stringify(imgPaths),
        videoPaths: JSON.stringify(videoPaths),
      },
      {
        where: { post_id },
      }
    );

    return { state: 200, message: "게시글 수정 성공!", data };
  } catch (error) {
    return { state: 500, message: "게시글 수정 실패", error };
  }
};

// // (async () => {
// //   const response = await UpdatePost({
// //     post_id: 9,
// //     uid: 4270722392,
// //     title: "비노dsdds",
// //     content: "모르sdsdsd요.",
// //     imgPaths: ["sdsdsdsdsd.jpg", "dsdsdsdsdsdsd.jpg"],
// //     videoPaths: ["dsdsdsdsd.mp4"],
// //     fk_workspace_id: 22,
// //   });

//   console.log("수정된 게시글:", response);
// })();

const getPostById = async (post_id) => {
  try {
    const data = await Post.findOne({ where: { post_id } });
    return { state: 200, message: "게시글 조회 성공", data };
  } catch (error) {
    console.error("게시글 조회 에러:", error);
    return { state: 500, message: "서버 오류", error };
  }
};

//  디버깅: 즉시 실행
// (async () => {
//   const testPostId = 2; // 확인할 post_id 값
//   const result = await getPostById(testPostId);
//   console.log("📌 게시글 조회 결과:", result);
// })();

const getUserWorkspaces = async (uid) => {
  try {
    const data = await Workspacectgrs.findAll({
      where: { uid },
      attributes: [
        "workspace_id",
        "workspace_name",
        "workspacectgrs_name",
        "workspacesubctgrs_name",
        "parent_id",
      ],
    });
    return { state: 200, message: "워크스페이스 조회 성공", data };
  } catch (error) {
    return { state: 500, message: "워크스페이스 조회 실패", error };
  }
};

// (async () => {
//   const result = await getUserWorkspaces("suho123");
//   console.log("유저 워크스페이스 ",result,);
// })();

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

    //imgPaths: '["http://localhost:4000/images/KakaoTalk_20211205_190958621_1748479502876.png"]'
    //imgPaths: "http://localhost:4000/images/KakaoTalk_20211205_190958621_1748479502876.png" 이렇게 되도록

    formattedData.forEach((post) => {
      post.category_name = post.Category.category_name; // 카테고리 이름 추가
      post.comments = post.Comments ? post.Comments.length : 0; // 댓글 개수 추가
      delete post.Category; // 불필요한 Category 필드 제거
      post.imgPaths = JSON.parse(post.imgPaths)[0]
        ? JSON.parse(post.imgPaths)[0] // JSON 문자열을 배열로 변환
        : "http://localhost:4000/images/default/default_profile.png"; // imgPaths가 없으면 빈 배열로 설정
      post.createdAt = new Date(post.createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }); // 날짜 형식 변환
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
  getEtcPost,
  CreatePost,
  UpdatePost,
  getMyPost,
  getUserWorkspaces,
  getPostById,
};
