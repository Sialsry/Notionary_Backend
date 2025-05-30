const {
  User,
  Post,
  Heart,
  Comment,
  Category,
  Workspacectgrs,
} = require("../models/config");
const sequelize = require("sequelize");

// 좋아요 누른 게시글 목록 조회
exports.getLikedPosts = async (req, res) => {
  try {
    const { uid } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    console.log(
      `📖 좋아요 누른 게시글 조회 - UID: ${uid}, Page: ${page}, Limit: ${limit}`
    );

    const { count, rows: likedPosts } = await Heart.findAndCountAll({
      where: { uid },
      include: [
        {
          model: Post,
          required: true,
          where: {
            uid: { [sequelize.Op.ne]: uid }, // ✅ 내가 작성한 글 제외
          },
          include: [
            {
              model: User,
              attributes: ["uid", "nick", "profImg"],
              required: true,
            },
            {
              model: Category,
              attributes: ["category_name"],
              required: true,
            },
          ],
          attributes: [
            "post_id",
            "title",
            "content",
            "imgPaths",
            "createdAt",
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM heart
                WHERE heart.post_id = Post.post_id
              )`),
              "hearts",
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM comment
                WHERE comment.post_id = Post.post_id
              )`),
              "comments",
            ],
          ],
        },
      ],
      order: [["Post", "createdAt", "DESC"]], // ✅ Heart.createdAt → Post.createdAt로 변경
      limit,
      offset,
      distinct: true,
    });

    // 데이터 가공
    const processedPosts = likedPosts.map((heartRecord) => {
      const post = heartRecord.Post;

      // 첫 번째 이미지 추출 (콤마로 구분된 경우)
      let firstImage = null;
      if (post.imgPaths && post.imgPaths.trim() !== "") {
        try {
          // JSON 문자열을 파싱
          const parsedImages = JSON.parse(post.imgPaths);

          // 배열이고 요소가 있으면 첫 번째 이미지 선택
          if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            firstImage = parsedImages[0];
          } else {
            firstImage =
              "http://localhost:4000/images/default/default_profile.png"; // 기본 썸네일 이미지
          }
        } catch (error) {
          // JSON 파싱 실패 시 콤마로 구분된 문자열로 처리
          console.log("JSON 파싱 실패, 콤마 구분 처리:", post.imgPaths);
          const images = post.imgPaths
            .split(",")
            .map((img) => img.trim())
            .filter((img) => img);
          firstImage = images.length > 0 ? images[0] : null;
        }
      }

      // 작성자 프로필 이미지 처리
      let authorProfileImg = post.User.profImg;
      //   if (authorProfileImg && !authorProfileImg.startsWith("http")) {
      //     authorProfileImg = `http://localhost:4000/uploads/profile/${authorProfileImg}`;
      //   }

      // 작성일 포맷팅
      const createdAt = new Date(post.createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      console.log("썸네일 이미지", firstImage);

      return {
        post_id: post.post_id,
        title: post.title,
        content: post.content,
        firstImage: firstImage,
        createdAt: createdAt,
        hearts: parseInt(post.dataValues.hearts) || 0,
        comments: parseInt(post.dataValues.comments) || 0,
        category_name: post.Category.category_name,
        author: {
          uid: post.User.uid,
          nick: post.User.nick,
          profImg: authorProfileImg,
        },
      };
    });

    const totalPages = Math.ceil(count / limit);

    console.log(
      `✅ 좋아요 게시글 조회 성공 - 총 ${count}개, 현재 페이지: ${page}/${totalPages}`
    );

    return res.status(200).json({
      success: true,
      message: "좋아요 누른 게시글을 성공적으로 조회했습니다.",
      data: processedPosts,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("❌ 좋아요 게시글 조회 오류:", error);
    return res.status(500).json({
      success: false,
      message: "좋아요 누른 게시글 조회에 실패했습니다.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 댓글 작성한 게시글 목록 조회
exports.getCommentedPosts = async (req, res) => {
  try {
    const { uid } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    console.log(
      `📖 댓글 작성한 게시글 조회 - UID: ${uid}, Page: ${page}, Limit: ${limit}`
    );

    // 댓글 작성한 게시글들을 조회 (중복 제거)
    const { count, rows: commentedPosts } = await Comment.findAndCountAll({
      where: { uid },
      include: [
        {
          model: Post,
          required: true,
          where: {
            uid: { [sequelize.Op.ne]: uid }, // ✅ 내가 작성한 글 제외
          },
          include: [
            {
              model: User,
              attributes: ["uid", "nick", "profImg"],
              required: true,
            },
            {
              model: Category,
              attributes: ["category_name"],
              required: true,
            },
          ],
          attributes: [
            "post_id",
            "title",
            "content",
            "imgPaths",
            "createdAt",
            // 좋아요 수 계산
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM heart
                WHERE heart.post_id = Post.post_id
              )`),
              "hearts",
            ],
            // 댓글 수 계산
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM comment
                WHERE comment.post_id = Post.post_id
              )`),
              "comments",
            ],
          ],
        },
      ],
      attributes: [
        [
          sequelize.fn("MAX", sequelize.col("Comment.createdAt")),
          "latestCommentDate",
        ], // ✅ 집계함수 사용
      ],
      group: [
        "Post.post_id",
        "Post.title",
        "Post.content",
        "Post.imgPaths",
        "Post.createdAt",
        "Post.uid",
        "Post.category_id",
        "Post->User.uid",
        "Post->User.nick",
        "Post->User.profImg",
        "Post->Category.category_id",
        "Post->Category.category_name",
      ], // ✅ 모든 선택된 컬럼을 GROUP BY에 포함
      order: [["latestCommentDate", "DESC"]], // ✅ 집계된 컬럼으로 정렬
      limit,
      offset,
      distinct: true,
    });

    // 데이터 가공
    const processedPosts = commentedPosts.map((commentRecord) => {
      const post = commentRecord.Post;

      // 첫 번째 이미지 추출
      let firstImage = null;
      if (post.imgPaths && post.imgPaths.trim() !== "") {
        try {
          // JSON 문자열을 파싱
          const parsedImages = JSON.parse(post.imgPaths);

          // 배열이고 요소가 있으면 첫 번째 이미지 선택
          if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            firstImage = parsedImages[0];
          } else {
            firstImage =
              "http://localhost:4000/images/default/default_profile.png"; // 기본 썸네일 이미지
          }
        } catch (error) {
          // JSON 파싱 실패 시 콤마로 구분된 문자열로 처리
          console.log("JSON 파싱 실패, 콤마 구분 처리:", post.imgPaths);
          const images = post.imgPaths
            .split(",")
            .map((img) => img.trim())
            .filter((img) => img);
          firstImage = images.length > 0 ? images[0] : null;
        }
      }

      // 작성자 프로필 이미지 처리
      let authorProfileImg = post.User.profImg;
      //   if (authorProfileImg && !authorProfileImg.startsWith("http")) {
      //     authorProfileImg = `http://localhost:4000/uploads/profile/${authorProfileImg}`;
      //   } else {
      //     authorProfileImg =
      //       "http://localhost:4000/images/default/default_profile.png"; // 기본 프로필 이미지
      //   }

      // 게시글 작성일 포맷팅
      const createdAt = new Date(post.createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      //   console.log("썸네일 이미지", firstImage);

      return {
        post_id: post.post_id,
        title: post.title,
        content: post.content,
        firstImage: firstImage,
        createdAt: createdAt,
        hearts: parseInt(post.dataValues.hearts) || 0,
        comments: parseInt(post.dataValues.comments) || 0,
        category_name: post.Category.category_name,
        author: {
          uid: post.User.uid,
          nick: post.User.nick,
          profImg: authorProfileImg,
        },
      };
    });

    const totalPages = Math.ceil(count / limit);

    console.log(
      `✅ 댓글 게시글 조회 성공 - 총 ${count}개, 현재 페이지: ${page}/${totalPages}`
    );

    return res.status(200).json({
      success: true,
      message: "댓글 작성한 게시글을 성공적으로 조회했습니다.",
      data: processedPosts,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("❌ 댓글 게시글 조회 오류:", error);
    return res.status(500).json({
      success: false,
      message: "댓글 작성한 게시글 조회에 실패했습니다.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getMyWorkspace = async (req, res) => {
  try {
    const { uid } = req.user;
    const data = await Workspacectgrs.findAll({
      where: { uid },
      attributes: [
        "workspace_name",
        "workspacectgrs_name",
        "workspacesubctgrs_name",
        "parent_id",
      ],
    });
    console.log("내 워크스페이스 조회 결과: ", data[0]);

    // return res.status(200).json(data);
  } catch (error) {
    return { state: 500, message: "워크스페이스 조회 실패", error };
  }
};
