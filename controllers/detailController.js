// postController.js - 게시글 상세페이지 관련 API

const { User, Post, Heart, Comment, Category } = require("../models/config");
const sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

// 게시글 상세 조회
exports.getPostDetail = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { uid } = req.user || {}; // 로그인하지 않은 경우도 고려

    console.log(
      `📖 게시글 상세 조회 - Post ID: ${post_id}, User: ${uid || "Anonymous"}`
    );

    // 게시글 상세 정보 조회
    const post = await Post.findOne({
      where: { post_id },
      include: [
        {
          model: User,
          attributes: ["uid", "nick", "profImg"],
          required: true,
        },
        {
          model: Category,
          attributes: ["category_name", "category_id", "category_id_fk"],
          required: true,
          include: [
            {
              model: Category,
              as: "ParentCategory",
              attributes: ["category_name"],
              required: false,
            },
          ],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["uid", "nick", "profImg"],
              required: true,
            },
          ],
          order: [["createdAt", "ASC"]],
          required: false,
        },
      ],
      attributes: [
        "post_id",
        "title",
        "content",
        "imgPaths",
        "videoPaths",
        "createdAt",
        "updatedAt",
        "uid",
        // 좋아요 수 계산
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM heart
            WHERE heart.post_id = Post.post_id
          )`),
          "hearts",
        ],
        // 현재 사용자의 좋아요 여부 확인
        [
          sequelize.literal(`(
            SELECT COUNT(*) > 0
            FROM heart
            WHERE heart.post_id = Post.post_id AND heart.uid = '${uid || ""}'
          )`),
          "isLiked",
        ],
      ],
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    // 이미지 처리
    let images = [];
    console.log("이미지 경로:", post.imgPaths);
    console.log("이미지 경로 타입:", typeof post.imgPaths);

    // 올바른 조건 처리
    if (
      !post.imgPaths ||
      post.imgPaths.trim() === "" ||
      post.imgPaths === "[]"
    ) {
      images = [];
    } else {
      try {
        // JSON 문자열인 경우 파싱 시도
        const parsedImages = JSON.parse(post.imgPaths);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          images = parsedImages.map((img) => {
            if (!img.startsWith("http")) {
              return `http://localhost:4000/uploads/posts/${img}`;
            }
            return img;
          });
        } else {
          images = [];
        }
      } catch (error) {
        // JSON 파싱 실패 시 콤마로 구분된 문자열로 처리
        images = post.imgPaths
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img)
          .map((img) => {
            if (!img.startsWith("http")) {
              return `http://localhost:4000/uploads/posts/${img}`;
            }
            return img;
          });
      }
    }

    console.log("처리된 이미지 경로:", images);

    // 동영상 처리
    let videos = [];
    console.log("동영상 경로:", post.videoPaths);
    console.log("동영상 경로 타입:", typeof post.videoPaths);

    // 올바른 조건 처리
    if (
      !post.videoPaths ||
      post.videoPaths.trim() === "" ||
      post.videoPaths === "[]"
    ) {
      videos = [];
    } else {
      try {
        // JSON 문자열인 경우 파싱 시도
        const parsedVideos = JSON.parse(post.videoPaths);
        if (Array.isArray(parsedVideos) && parsedVideos.length > 0) {
          videos = parsedVideos.map((video) => {
            if (!video.startsWith("http")) {
              return `http://localhost:4000/uploads/posts/${video}`;
            }
            return video;
          });
        } else {
          videos = [];
        }
      } catch (error) {
        // JSON 파싱 실패 시 콤마로 구분된 문자열로 처리
        videos = post.videoPaths
          .split(",")
          .map((video) => video.trim())
          .filter((video) => video)
          .map((video) => {
            if (!video.startsWith("http")) {
              return `http://localhost:4000/uploads/posts/${video}`;
            }
            return video;
          });
      }
    }

    console.log("처리된 동영상 경로:", videos);

    // 작성자 프로필 이미지 처리
    console.log("작성자 프로필 이미지:", post.User.profImg);

    let authorProfileImg = post.User.profImg;
    if (authorProfileImg && !authorProfileImg.startsWith("http")) {
      authorProfileImg = `http://localhost:4000/uploads/profile/${authorProfileImg}`;
    }
    if (post.User.profImg === "/images/default_profile.png") {
      authorProfileImg =
        "http://localhost:4000/images/default/default_profile.png";
    }

    // 댓글 데이터 처리
    const processedComments = post.Comments.map((comment) => {
      let commentAuthorImg = comment.User.profImg;
      if (commentAuthorImg && !commentAuthorImg.startsWith("http")) {
        commentAuthorImg = `http://localhost:4000/uploads/profile/${commentAuthorImg}`;
      }

      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: {
          uid: comment.User.uid,
          nick: comment.User.nick,
          profImg: commentAuthorImg,
        },
        isMyComment: comment.uid === uid,
      };
    });

    // 카테고리 정보 구성
    const categoryInfo = {
      category_id: post.Category.category_id,
      category_name: post.Category.category_name,
      parent_category: post.Category.ParentCategory
        ? post.Category.ParentCategory.category_name
        : null,
    };

    const responseData = {
      post_id: post.post_id,
      title: post.title,
      content: post.content,
      images: images,
      videos: videos,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      hearts: parseInt(post.dataValues.hearts) || 0,
      isLiked: post.dataValues.isLiked === 1,
      isMyPost: post.uid === uid,
      author: {
        uid: post.User.uid,
        nick: post.User.nick,
        profImg: authorProfileImg,
      },
      category: categoryInfo,
      comments: processedComments,
    };

    console.log(`✅ 게시글 상세 조회 성공 - Post ID: ${post_id}`);

    return res.status(200).json({
      success: true,
      message: "게시글 상세 정보를 성공적으로 조회했습니다.",
      data: responseData,
    });
  } catch (error) {
    console.error("❌ 게시글 상세 조회 오류:", error);
    return res.status(500).json({
      success: false,
      message: "게시글 조회에 실패했습니다.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 좋아요 토글
exports.toggleLike = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { uid } = req.user;

    console.log(`❤️ 좋아요 토글 - Post ID: ${post_id}, User: ${uid}`);

    // 게시글 존재 여부 확인
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    // 기존 좋아요 확인
    const existingLike = await Heart.findOne({
      where: { post_id, uid },
    });

    let isLiked;
    if (existingLike) {
      // 좋아요 취소
      await Heart.destroy({
        where: { post_id, uid },
      });
      isLiked = false;
      console.log(`💔 좋아요 취소 - Post ID: ${post_id}`);
    } else {
      // 좋아요 추가
      await Heart.create({ post_id, uid });
      isLiked = true;
      console.log(`❤️ 좋아요 추가 - Post ID: ${post_id}`);
    }

    // 현재 좋아요 수 조회
    const heartCount = await Heart.count({
      where: { post_id },
    });

    return res.status(200).json({
      success: true,
      message: isLiked ? "좋아요를 추가했습니다." : "좋아요를 취소했습니다.",
      data: {
        isLiked,
        hearts: heartCount,
      },
    });
  } catch (error) {
    console.error("❌ 좋아요 토글 오류:", error);
    return res.status(500).json({
      success: false,
      message: "좋아요 처리에 실패했습니다.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 댓글 작성
exports.createComment = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { content } = req.body;
    const { uid } = req.user;

    console.log(`💬 댓글 작성 - Post ID: ${post_id}, User: ${uid}`);

    // 입력값 검증
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "댓글 내용을 입력해주세요.",
      });
    }

    if (content.length > 200) {
      return res.status(400).json({
        success: false,
        message: "댓글은 200자 이내로 작성해주세요.",
      });
    }

    // 게시글 존재 여부 확인
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    // 댓글 생성
    const newComment = await Comment.create({
      uid,
      post_id,
      category_id: post.category_id,
      content: content.trim(),
    });

    // 작성된 댓글 정보 조회 (작성자 정보 포함)
    const commentWithAuthor = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          attributes: ["uid", "nick", "profImg"],
          required: true,
        },
      ],
    });

    // 프로필 이미지 처리
    let authorProfileImg = commentWithAuthor.User.profImg;
    if (authorProfileImg && !authorProfileImg.startsWith("http")) {
      authorProfileImg = `http://localhost:4000/uploads/profile/${authorProfileImg}`;
    }

    const responseData = {
      id: commentWithAuthor.id,
      content: commentWithAuthor.content,
      createdAt: commentWithAuthor.createdAt,
      author: {
        uid: commentWithAuthor.User.uid,
        nick: commentWithAuthor.User.nick,
        profImg: authorProfileImg,
      },
      isMyComment: true,
    };

    console.log(`✅ 댓글 작성 성공 - Comment ID: ${newComment.id}`);

    return res.status(201).json({
      success: true,
      message: "댓글이 성공적으로 작성되었습니다.",
      data: responseData,
    });
  } catch (error) {
    console.error("❌ 댓글 작성 오류:", error);
    return res.status(500).json({
      success: false,
      message: "댓글 작성에 실패했습니다.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { content } = req.body;
    const { uid } = req.user;

    console.log(`✏️ 댓글 수정 - Comment ID: ${comment_id}, User: ${uid}`);

    // 입력값 검증
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "댓글 내용을 입력해주세요.",
      });
    }

    if (content.length > 200) {
      return res.status(400).json({
        success: false,
        message: "댓글은 200자 이내로 작성해주세요.",
      });
    }

    // 댓글 조회 및 권한 확인
    const comment = await Comment.findByPk(comment_id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "댓글을 찾을 수 없습니다.",
      });
    }

    if (comment.uid !== uid) {
      return res.status(403).json({
        success: false,
        message: "자신의 댓글만 수정할 수 있습니다.",
      });
    }

    // 댓글 수정
    await comment.update({
      content: content.trim(),
    });

    console.log(`✅ 댓글 수정 성공 - Comment ID: ${comment_id}`);

    return res.status(200).json({
      success: true,
      message: "댓글이 성공적으로 수정되었습니다.",
      data: {
        id: comment.id,
        content: comment.content,
        updatedAt: comment.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ 댓글 수정 오류:", error);
    return res.status(500).json({
      success: false,
      message: "댓글 수정에 실패했습니다.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { uid } = req.user;

    console.log(`🗑️ 댓글 삭제 - Comment ID: ${comment_id}, User: ${uid}`);

    // 댓글 조회 및 권한 확인
    const comment = await Comment.findByPk(comment_id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "댓글을 찾을 수 없습니다.",
      });
    }

    if (comment.uid !== uid) {
      return res.status(403).json({
        success: false,
        message: "자신의 댓글만 삭제할 수 있습니다.",
      });
    }

    // 댓글 삭제
    await comment.destroy();

    console.log(`✅ 댓글 삭제 성공 - Comment ID: ${comment_id}`);

    return res.status(200).json({
      success: true,
      message: "댓글이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("❌ 댓글 삭제 오류:", error);
    return res.status(500).json({
      success: false,
      message: "댓글 삭제에 실패했습니다.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 게시글 삭제
exports.deletePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { uid } = req.user;

    console.log(`🗑️ 게시글 삭제 - Post ID: ${post_id}, User: ${uid}`);

    // 게시글 조회 및 권한 확인
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    if (post.uid !== uid) {
      return res.status(403).json({
        success: false,
        message: "자신의 게시글만 삭제할 수 있습니다.",
      });
    }

    // 관련 파일들 삭제
    const deleteFiles = (filePaths, uploadFolder) => {
      if (filePaths && filePaths.trim() !== "") {
        const files = filePaths
          .split(",")
          .map((file) => file.trim())
          .filter((file) => file);
        files.forEach((file) => {
          if (!file.startsWith("http")) {
            const filePath = path.join(
              __dirname,
              "..",
              "uploads",
              uploadFolder,
              file
            );
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath);
                console.log(`📁 파일 삭제 완료: ${file}`);
              } catch (error) {
                console.error(`❌ 파일 삭제 실패: ${file}`, error);
              }
            }
          }
        });
      }
    };

    // 이미지 및 비디오 파일 삭제
    deleteFiles(post.imgPaths, "posts");
    deleteFiles(post.videoPaths, "posts");

    // 관련 데이터 삭제 (CASCADE로 인해 자동 삭제되지만 명시적으로 처리)
    await Comment.destroy({ where: { post_id } });
    await Heart.destroy({ where: { post_id } });

    // 게시글 삭제
    await post.destroy();

    console.log(`✅ 게시글 삭제 성공 - Post ID: ${post_id}`);

    return res.status(200).json({
      success: true,
      message: "게시글이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("❌ 게시글 삭제 오류:", error);
    return res.status(500).json({
      success: false,
      message: "게시글 삭제에 실패했습니다.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
