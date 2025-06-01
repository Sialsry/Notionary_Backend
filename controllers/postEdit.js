// postController.js - 게시글 수정 관련 API 추가

const {
  Post,
  Page,
  Workspacectgrs,
  Category,
  User,
} = require("../models/config");
const sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

// 게시글 수정을 위한 데이터 조회
exports.getPostForEdit = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { uid } = req.user;

    console.log(
      `📝 게시글 수정 데이터 조회 - Post ID: ${post_id}, User: ${uid}`
    );

    // 게시글 조회 (작성자 권한 확인 포함)
    const post = await Post.findOne({
      where: {
        post_id,
        uid, // 작성자만 수정 가능
      },
      include: [
        {
          model: Category,
          attributes: ["category_id", "category_name", "category_id_fk"],
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
          model: PostPage,
          as: "PostPages",
          include: [
            {
              model: Page,
              as: "Page",
              attributes: ["workspace_id", "Page_name"],
            },
            {
              model: Workspacectgrs,
              as: "Workspace",
              attributes: [
                "workspace_id",
                "workspacectgrs_name",
                "workspacesubctgrs_name",
              ],
            },
          ],
          required: false,
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시글을 찾을 수 없거나 수정 권한이 없습니다.",
      });
    }

    // 이미지 및 비디오 경로 파싱
    const images = post.imgPaths ? JSON.parse(post.imgPaths) : [];
    const videos = post.videoPaths ? JSON.parse(post.videoPaths) : [];

    // 연결된 페이지 정보
    const connectedPages =
      post.PostPages?.map((postPage) => ({
        workspace_id: postPage.Page.workspace_id,
        page_name: postPage.Page.Page_name,
        workspace_name:
          postPage.Workspace.workspacectgrs_name ||
          postPage.Workspace.workspacesubctgrs_name,
      })) || [];

    // 카테고리 정보 구성
    const categoryInfo = {
      category_id: post.Category.category_id,
      category_name: post.Category.category_name,
      parent_category: post.Category.ParentCategory
        ? post.Category.ParentCategory.category_name
        : null,
      parent_category_id: post.Category.category_id_fk,
    };

    const responseData = {
      post_id: post.post_id,
      title: post.title,
      content: post.content,
      images: images,
      videos: videos,
      category: categoryInfo,
      fk_workspace_id: post.fk_workspace_id,
      connectedPages: connectedPages,
      hasWorkspaceSharing: post.fk_workspace_id !== null,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    console.log(`✅ 게시글 수정 데이터 조회 성공 - Post ID: ${post_id}`);

    return res.status(200).json({
      success: true,
      message: "게시글 수정 데이터를 성공적으로 조회했습니다.",
      data: responseData,
    });
  } catch (error) {
    console.error("❌ 게시글 수정 데이터 조회 오류:", error);
    return res.status(500).json({
      success: false,
      message: "게시글 수정 데이터 조회에 실패했습니다.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 게시글 수정
exports.updatePost = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { post_id } = req.params;
    const { uid } = req.user;
    const {
      title,
      content,
      category_id,
      isWorkspaceShared,
      fk_workspace_id,
      selectedPageIds,
      keepExistingImages,
      keepExistingVideos,
    } = req.body;

    console.log("📝 게시글 수정 요청:", {
      post_id,
      uid,
      title,
      category_id,
      isWorkspaceShared,
      fk_workspace_id,
      selectedPageIds,
      keepExistingImages,
      keepExistingVideos,
    });

    // 기존 게시글 조회 및 권한 확인
    const existingPost = await Post.findOne({
      where: {
        post_id,
        uid, // 작성자만 수정 가능
      },
    });

    if (!existingPost) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "게시글을 찾을 수 없거나 수정 권한이 없습니다.",
      });
    }

    // 기존 미디어 파일 처리
    const existingImages = existingPost.imgPaths
      ? JSON.parse(existingPost.imgPaths)
      : [];
    const existingVideos = existingPost.videoPaths
      ? JSON.parse(existingPost.videoPaths)
      : [];

    // 유지할 기존 파일들
    const keepImages = keepExistingImages
      ? keepExistingImages.split(",").filter((img) => img.trim())
      : [];
    const keepVideos = keepExistingVideos
      ? keepExistingVideos.split(",").filter((vid) => vid.trim())
      : [];

    // 삭제할 파일들 식별
    const imagesToDelete = existingImages.filter(
      (img) => !keepImages.includes(img)
    );
    const videosToDelete = existingVideos.filter(
      (vid) => !keepVideos.includes(vid)
    );

    // 새로운 미디어 파일 처리
    const newImages = [];
    const newVideos = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const fileUrl = `http://localhost:4000/uploads/posts/${file.filename}`;
        if (file.mimetype.startsWith("image/")) {
          newImages.push(fileUrl);
        } else if (file.mimetype.startsWith("video/")) {
          newVideos.push(fileUrl);
        }
      });
    }

    // 최종 미디어 배열 (기존 유지 + 새로 추가)
    const finalImages = [...keepImages, ...newImages];
    const finalVideos = [...keepVideos, ...newVideos];

    // 게시글 업데이트
    await existingPost.update(
      {
        title,
        content,
        category_id,
        imgPaths: JSON.stringify(finalImages),
        videoPaths: JSON.stringify(finalVideos),
        fk_workspace_id: isWorkspaceShared === "true" ? fk_workspace_id : null,
      },
      { transaction }
    );

    console.log("✅ 게시글 기본 정보 업데이트 완료");

    // 기존 페이지 연결 삭제
    await PostPage.destroy({
      where: { post_id },
      transaction,
    });

    // 새로운 페이지 연결 생성
    if (isWorkspaceShared === "true" && fk_workspace_id && selectedPageIds) {
      const pageIds = Array.isArray(selectedPageIds)
        ? selectedPageIds
        : selectedPageIds.split(",").filter((id) => id.trim());

      console.log("🔗 연결할 페이지 ID들:", pageIds);

      for (const pageId of pageIds) {
        const pageIdNum = parseInt(pageId.trim());

        const page = await Page.findOne({
          where: { workspace_id: pageIdNum },
          include: [
            {
              model: Workspacectgrs,
              where: { workspace_id: pageIdNum },
            },
          ],
        });

        if (page) {
          await PostPage.create(
            {
              post_id: existingPost.post_id,
              workspace_id: fk_workspace_id,
              page_workspace_id: page.workspace_id,
              page_name: page.Page_name,
            },
            { transaction }
          );

          console.log(
            `✅ 페이지 연결 완료: ${page.Page_name} (ID: ${pageIdNum})`
          );
        }
      }
    }

    // 삭제할 미디어 파일들 물리적 삭제
    const deleteFiles = (filePaths, uploadFolder) => {
      filePaths.forEach((filePath) => {
        if (filePath.startsWith("http://localhost:4000/")) {
          const fileName = path.basename(filePath);
          const fullPath = path.join(
            __dirname,
            "..",
            "uploads",
            uploadFolder,
            fileName
          );
          if (fs.existsSync(fullPath)) {
            try {
              fs.unlinkSync(fullPath);
              console.log(`📁 파일 삭제 완료: ${fileName}`);
            } catch (error) {
              console.error(`❌ 파일 삭제 실패: ${fileName}`, error);
            }
          }
        }
      });
    };

    deleteFiles(imagesToDelete, "posts");
    deleteFiles(videosToDelete, "posts");

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "게시글이 성공적으로 수정되었습니다.",
      data: {
        post_id: existingPost.post_id,
        title: existingPost.title,
        hasWorkspaceSharing: isWorkspaceShared === "true",
        connectedPagesCount:
          isWorkspaceShared === "true" ? pageIds?.length || 0 : 0,
        newImagesCount: newImages.length,
        newVideosCount: newVideos.length,
        deletedImagesCount: imagesToDelete.length,
        deletedVideosCount: videosToDelete.length,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ 게시글 수정 실패:", error);

    // 업로드된 새 파일들 정리 (에러 시)
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error("임시 파일 삭제 실패:", unlinkError);
        }
      });
    }

    return res.status(500).json({
      success: false,
      message: "게시글 수정에 실패했습니다.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
