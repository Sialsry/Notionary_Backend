const router = require("express").Router();
const fs = require("fs");
const { TeamProject } = require("../models/config");
const {
  createFolder,
  createPage,
  findWorkspacedata,
  savetextData,
  findworkspacedata,
  findworkspaceid,
  getpageData,
  findWspaceContent,
  DestroyWorkspace,
} = require("../controllers/workspace/workspace.controller");
const { json } = require("sequelize");
const { upload } = require("../middlewares/multer");
router.post("/saveData", (req, res) => {
  const { data } = req.body;
  res.json({ message: "done" });
});
const { auth } = require("../middlewares/authMiddleware");
const { error } = require("console");

router.post("/newFolder", auth, async (req, res) => {
  try {
    const { uid } = req.user;
    const { data } = req.body;
    const { Data } = await createFolder({ Data: data }, uid);
    res.json({ data: Data });
  } catch (error) {
    res.json({ state: 200, message: error });
  }
});

router.post("/newPage", auth, async (req, res) => {
  const { data } = req.body;
  try {
    const { uid } = req.user;
    const { Data } = await createPage(data, uid);
    res.json({ state: 200, data });
  } catch (error) {
    res.json({ state: 200, message: error });
  }
});

router.get(
  "/selectspace/:workspacename/:foldername/:filename",
  auth,
  async (req, res) => {
    const { workspacename, foldername, filename } = req.params;
    const { workspaceId } = await findworkspaceid(
      workspacename,
      foldername,
      filename,
      req.user.uid
    );
    const PageData = await getpageData(workspaceId, filename);
    res.json({ data: PageData });
  }
);

router.post(
  "/selectspace/:workspacename/:foldername/:filename",
  auth,
  async (req, res) => {
    const { workspacename, foldername, filename } = req.params;
    const { data } = req.body;
    const Data = JSON.stringify(data);
    const { workspaceId } = await findworkspaceid(
      workspacename,
      foldername,
      filename,
      req.user.uid
    );
    const savepageData = await savetextData(workspaceId, filename, Data);
    const PageData = await getpageData(workspaceId, filename);
    res.json({ data: PageData });
  }
);

router.post(
  "/selectspace/:workspacename/:foldername/:_filename/image/:id",
  upload.single("imgpath"),
  auth,
  async (req, res) => {
    const { workspacename, foldername, _filename, id } = req.params;
    const { data } = req.body;
    const { filename } = req.file;
    const Data = JSON.parse(data);
    const datas = Data.map((el) => {
      if (el.id == id) el.content = `http://localhost:4000/images/${filename}`;
      return el;
    });
    const { workspaceId } = await findworkspaceid(
      workspacename,
      foldername,
      _filename,
      req.user.uid
    );
    const savepageData = await savetextData(
      workspaceId,
      _filename,
      JSON.stringify(datas)
    );
    const PageData = await getpageData(workspaceId, _filename);
    res.json({ data: PageData });
  }
);

router.get("/workspacedataOne", auth, async (req, res) => {
  console.log(req.user.uid, "uid111");
  const data = await findWorkspacedata("개인 워크스페이스", req.user.uid);
  console.log(data, "worspacedataOne");
  res.json({ data });
});
router.get("/workspacedataTwo", auth, async (req, res) => {
  const data = await findWorkspacedata("팀 워크스페이스", req.user.uid);

  res.json({ data });
});

router.get("/workspaceContent", auth, async (req, res) => {
  const { wname } = req.body;
  const data = await findWspaceContent(wname, req.user.uid);
  res.json({ data });
});

router.post("/delworkspace", auth, async (req, res) => {
  const {workspacename, foldername} = req.body;
  console.log(workspacename, foldername, req.user.uid, 'sssss')
  const data = DestroyWorkspace(req.user.uid, workspacename, foldername)
  res.json({state : 200, message : data})
})


module.exports = router;
