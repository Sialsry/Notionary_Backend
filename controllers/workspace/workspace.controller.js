const { where } = require("sequelize");
const { Workspace, Workspacectgrs, Page } = require("../../models/config")




const createFolder = async ({ data }) => {
    // console.log(data, 'createfolder')
    try {
        // for (const workspace of data) {
        //     console.log(data, 'createfolder', workspace)
        //     for (const [mainTitle, categories] of Object.entries(workspace)) {
        //         for (const folder of categories) {
        //             for (const [foldername, filename] of Object.entries(folder)) {
        //                 console.log('done', typeof (mainTitle, foldername))
        //                 const Data = await Workspacectgrs.create({
        //                     uid: '4272178176',
        //                     workspace_name: mainTitle,
        //                     workspacectgrs_name: foldername,
        //                     depth: 1
        //                 })
        //             }
        //         }
        //         return ({ state: 200, message: 'createfolder successful' })
        //     }
        // }
        const { workSpace, folderName } = data;
        await Workspacectgrs.create({
            uid: '4272178176',
            workspace_name: workSpace,
            workspacectgrs_name: folderName,
            depth: 1
        })

        return { state: 200, message: 'success' }
    } catch (error) {
        return { state: 401, message: error }
        console.log(error)
    }
}




const createPage = async ({ data }) => {
    try {
        const { workSpace, folderName, fileName } = data;
        // console.log(data, 'dfdfdfd', workSpace, folderName, fileName)
        await Workspacectgrs.create({
            uid: '4272178176',
            workspace_name: workSpace,
            workspacesubctgrs_name: fileName,
            depth: 2,
            parent_id: folderName
        })
        return ({ state: 200, message: 'successful' })
    } catch (error) {
        // console.log(error)
        return ({ state: 401, message: error })
    }
}

const findWorkspacedata = async (wname) => {
    try {
        const data = await Workspacectgrs.findAll({
            where: {
                uid: '4272178176',
                workspace_name: wname
            },
            include: [{
                model: Workspacectgrs,
                as: 'subCategories',
                attribute: ['workspacesubctgrs_name']
            }],
            attribute: ['workspace_name', 'workspacectgrs_name']
        }
        )
        const rawData = data.map((el, index) => {
            return el.dataValues
        })

        const result = [];
        const grouped = {};
        for (const item of rawData) {
            const workspaceName = item.workspace_name;
            const isParent = item.depth === 1;
            const isChild = item.depth === 2;
            // console.log(item, 'item', workspaceName, isParent, isChild)

            if (!grouped[workspaceName]) {
                grouped[workspaceName] = {}
            }
            if (isParent) {
                if (!grouped[workspaceName][item.workspacectgrs_name])
                    grouped[workspaceName][item.workspacectgrs_name] = []
            }
            if (isChild) {
                const parent = rawData.find(
                    (p) => p.workspacectgrs_name === item.parent_id && p.depth === 1
                )
                if (parent && parent.workspacectgrs_name) {
                    // if (!grouped[workspaceName]) {
                    //     grouped[workspaceName] = {};
                    // }
                    // if (!grouped[workspaceName][parent.workspacectgrs_name]) {
                    //     grouped[workspaceName][parent.workspacectgrs_name] = [];
                    // }
                    // console.log(item.workspacesubctgrs_name,'23222')
                    console.log(parent, 'parent111111111', workspaceName, grouped)
                    console.log(typeof grouped[workspaceName][parent.workspacectgrs_name])
                    if (typeof grouped[workspaceName][parent.workspacectgrs_name] == "undefined"){
                        console.log(typeof grouped[workspaceName][parent.workspacectgrs_name] == undefined)
                        grouped[workspaceName][parent.workspacectgrs_name] = [item.workspacesubctgrs_name];
                    }else {
                        grouped[workspaceName][parent.workspacectgrs_name].push(item.workspacesubctgrs_name);
                    }
                }
                // console.log(grouped, 'grouped123123')
            }
        }
        console.log(grouped, 'grouped3333')
        for (const [workspace, ctgrs] of Object.entries(grouped)) {
            // console.log(ctgrs, 'ctgrs', workspace)
            const formatted = Object.entries(ctgrs).map(([ctgrName, subCtgrs]) => {
                return { [ctgrName]: subCtgrs }
            })
            result.push({ [workspace]: formatted });
            // console.log(formatted, 'formatted', workspace, result)
        }
        // console.log(grouped, 'grouped1111')
        // console.log(result, 'restt')
        // if(result.length >= 0) {
        //     const newResult = result.map(el => [el])
        //     console.log(newResult)
        //     return newResult 
        // }
        // console.log(result)
        return (result)
    } catch (error) {
        console.log(error)
    }
}
// findWorkspacedata()

const findworkspaceid = async (workspacename, foldername, filename) => {
    console.log(workspacename, foldername, filename, 'files')
    const data = await Workspacectgrs.findOne({
        where: {
            uid: '4272178176',
            workspace_name: workspacename,
            parent_id: foldername,
            workspacesubctgrs_name: filename
        }
    })
    
    const workspaceId = data.dataValues.workspace_id
    // console.log(workspaceId, 'newdata')
    return { workspaceId }
}

const findWspaceContent = async (wname) => {
    const data = await Workspacectgrs.findAll({
        where: {
            uid: '4272178176',
            workspace_name: wname,
            depth: 1
        }
    })
    const newdata = data.map((el) =>
        el.dataValues
    )
    // console.log(newdata, 'content')
    return newdata
}

const savetextData = async (workspaceId, filename, Data) => {
    try {
        try {
            console.log(workspaceId, filename, Data, 'zz')

            const data = await Page.create({
                workspace_id: workspaceId,
                Page_name: filename,
                page_content: Data
            })
            return { state: 200, message: 'data created' }
        } catch (error) {
            const data = await Page.update({
                page_content: Data
            },
                {
                    where: {
                        workspace_id: workspaceId,
                        Page_name: filename,
                    }
                })
            return { state: 200, message: 'data updated' }
        }


    } catch (error) {
        return ({ state: 401, message: error })
    }
}


const getpageData = async (workspaceId, filename) => {
    const data = await Page.findOne({
        where: {
            workspace_id: workspaceId,
            Page_name: filename
        }
    })
    return { PageData: data?.dataValues }
}

module.exports = { savetextData, getpageData, createPage, createFolder, findWorkspacedata, findWspaceContent, findworkspaceid }