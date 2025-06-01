const { where } = require("sequelize");
const { Workspace, Workspacectgrs, Page } = require("../../models/config");

const createFolder = async ({ Data }, uid) => {
  try {
    const { workSpace, folderName } = Data.data;
    const data = await Workspacectgrs.create({
      uid: uid,
      workspace_name: workSpace,
      workspacectgrs_name: folderName,
      depth: 1,
    });
    return { state: 200, message: "success" };
  } catch (error) {
    return { state: 401, message: error };
  }
};

const createPage = async ({ data }, uid, workspaceId) => {
  try {
    const { workSpace, folderName, fileName } = data;
    await Workspacectgrs.create({
      uid: uid,
      workspace_name: workSpace,
      workspacesubctgrs_name: fileName,
      depth: 2,
      parent_id: folderName,
      fk_workspace_id: workspaceId
    });
    return { state: 200, message: "successful" };
  } catch (error) {
    return { state: 401, message: error };
  }
};

const findWorkspacedata = async (wname, uid) => {
  try {
    const data = await Workspacectgrs.findAll({
      where: {
        uid: uid,
        workspace_name: wname,
      },
      include: [
        {
          model: Workspacectgrs,
          as: "subCategories",
          attribute: ["workspacesubctgrs_name"],
        },
      ],
      attribute: ["workspace_name", "workspacectgrs_name"],
    });
    const rawData = data.map((el, index) => {
      return el.dataValues;
    });

    const result = [];
    const grouped = {};
    for (const item of rawData) {
      const workspaceName = item.workspace_name;
      const isParent = item.depth === 1;
      const isChild = item.depth === 2;

      if (!grouped[workspaceName]) {
        grouped[workspaceName] = {};
      }
      if (isParent) {
        if (!grouped[workspaceName][item.workspacectgrs_name])
          grouped[workspaceName][item.workspacectgrs_name] = [];
      }
      if (isChild) {
        const parent = rawData.find(
          (p) => p.workspacectgrs_name === item.parent_id && p.depth === 1
        );
        if (parent && parent.workspacectgrs_name) {
          if (
            typeof grouped[workspaceName][parent.workspacectgrs_name] ==
            "undefined"
          ) {
            grouped[workspaceName][parent.workspacectgrs_name] = [
              item.workspacesubctgrs_name,
            ];
          } else {
            grouped[workspaceName][parent.workspacectgrs_name].push(
              item.workspacesubctgrs_name
            );
          }
        }
      }
    }
    for (const [workspace, ctgrs] of Object.entries(grouped)) {
      const formatted = Object.entries(ctgrs).map(([ctgrName, subCtgrs]) => {
        return { [ctgrName]: subCtgrs };
      });
      result.push({ [workspace]: formatted });
    }

    return result;
  } catch (error) { }
};

const findworkspacefolderid = async (workspacename, foldername, uid) => {
  try {

    const data = await Workspacectgrs.findOne({
      where: {
        uid: uid,
        workspace_name: workspacename,
        workspacectgrs_name: foldername,

      },
    });
    if (data) {
      const workspaceId = data.dataValues.workspace_id;
      return { workspaceId };
    } else {
      return null;
    }
  } catch (error) {
    return { data: error }
  }
};

const findworkspaceid = async (workspacename, foldername, filename, uid) => {
  try {

    const data = await Workspacectgrs.findOne({
      where: {
        uid: uid,
        workspace_name: workspacename,
        parent_id: foldername,
        workspacesubctgrs_name: filename,
      },
    });
    if (data) {
      const workspaceId = data.dataValues.workspace_id;
      return { workspaceId };
    } else {
      return null;
    }
  } catch (error) {
    return { data: error }
  }
};

const findWspaceContent = async (wname, uid) => {
  const data = await Workspacectgrs.findAll({
    where: {
      uid: uid,
      workspace_name: wname,
      depth: 1,
    },
  });
  const newdata = data.map((el) => el.dataValues);
  return newdata;
};

const savetextData = async (workspaceId, filename, Data) => {
  try {
    try {
      const data = await Page.create({
        workspace_id: workspaceId,
        Page_name: filename,
        page_content: Data,
      });
      return { state: 200, message: "data created" };
    } catch (error) {
      const data = await Page.update(
        {
          page_content: Data,
        },
        {
          where: {
            workspace_id: workspaceId,
            Page_name: filename,
          },
        }
      );
      return { state: 200, message: "data updated" };
    }
  } catch (error) {
    return { state: 401, message: error };
  }
};

const getpageData = async (workspaceId, filename) => {
  const data = await Page.findOne({
    where: {
      workspace_id: workspaceId,
      Page_name: filename,
    },
  });
  return { PageData: data?.dataValues };
};


const DestroyWorkspace = (uid, workspacename, foldername) => {
  try {
    const data = Workspacectgrs.destroy({
      where: {
        uid: uid,
        workspace_name: workspacename,
        workspacectgrs_name: foldername
      }
    })
    return { state: 200, message: 'successfull' }
  } catch (error) {
    return { state: 200, message: error }
  }
}
const DestroyWorkspacepage = (uid, workspacename, foldername, filename) => {
  try {
    const data = Workspacectgrs.destroy({
      where: {
        uid: uid,
        workspace_name: workspacename,
        parent_id: foldername,
        workspacesubctgrs_name: filename
      }
    })
    return { state: 200, message: 'successfull' }
  } catch (error) {
    return { state: 200, message: error }
  }
}


const getIdpagedata = async (result_id) => {
  console.log(result_id, 'resultid') // [ 5, 6 ] resultid
  try {

    const data = await Page.findAll({
      where: {
        workspace_id: result_id
      }

    })
    const newData = data.map((page => page.dataValues))
      console.log(newData, 'result data11')
    return ({data : newData})
  } catch (error) {
    console.log(error)
    return (error, 'error111')
  }

}

// DestroyWorkspace('4272178176', '개인 워크스페이스', '123')

module.exports = {
  savetextData,
  getIdpagedata,
  DestroyWorkspacepage,
  findworkspacefolderid,
  getpageData,
  createPage,
  createFolder,
  findWorkspacedata,
  findWspaceContent,
  findworkspaceid,
  DestroyWorkspace
};
