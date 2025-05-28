const { User, Post, Heart, Comment, Category } = require("../models/config");
const { Op } = require("sequelize");
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

    // 좋아요 누른 게시글들을 조회 (JOIN을 통해 필요한 모든 정보 가져오기)
    const { count, rows: likedPosts } = await Heart.findAndCountAll({
      where: { uid },
      include: [
        {
          model: Post,
          required: true,
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
            {
              model: Heart,
              attributes: [],
              required: false,
            },
            {
              model: Comment,
              attributes: [],
              required: false,
            },
          ],
          // 좋아요 수와 댓글 수를 서브쿼리로 계산
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
      order: [["createdAt", "DESC"]], // 최근 좋아요 순으로 정렬
      limit,
      offset,
      distinct: true, // 중복 제거
    });

    // 데이터 가공
    const processedPosts = likedPosts.map((heartRecord) => {
      const post = heartRecord.Post;

      // 첫 번째 이미지 추출 (콤마로 구분된 경우)
      let firstImage = null;
      if (post.imgPaths && post.imgPaths.trim() !== "") {
        const images = post.imgPaths
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img);
        firstImage = images.length > 0 ? images[0] : null;

        // 상대 경로인 경우 절대 URL로 변환
        if (firstImage && !firstImage.startsWith("http")) {
          firstImage = `http://localhost:4000/uploads/posts/${firstImage}`;
        }
      }

      // 작성자 프로필 이미지 처리
      let authorProfileImg = post.User.profImg;
      if (authorProfileImg && !authorProfileImg.startsWith("http")) {
        authorProfileImg = `http://localhost:4000/uploads/profile/${authorProfileImg}`;
      }

      // 작성일 포맷팅
      const createdAt = new Date(post.createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

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
      attributes: ["createdAt"], // 댓글 작성일
      order: [["createdAt", "DESC"]],
      group: ["Post.post_id"], // 게시글별로 그룹핑하여 중복 제거
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
        const images = post.imgPaths
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img);
        firstImage = images.length > 0 ? images[0] : null;

        if (firstImage && !firstImage.startsWith("http")) {
          firstImage = `http://localhost:4000/uploads/posts/${firstImage}`;
        }
      }

      // 작성자 프로필 이미지 처리
      let authorProfileImg = post.User.profImg;
      if (authorProfileImg && !authorProfileImg.startsWith("http")) {
        authorProfileImg = `http://localhost:4000/uploads/profile/${authorProfileImg}`;
      }

      // 게시글 작성일 포맷팅
      const createdAt = new Date(post.createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

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
