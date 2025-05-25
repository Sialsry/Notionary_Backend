const { Workspace, Workspacectgrs } = require("../../models/config")




const createFolder = async ({ data }) => {
    console.log(data, 'createfolder')
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
    } catch (error) {
        console.log(error)
    }
}




const createPage = async ({ data }) => {
    console.log(data, 'dfdfdfd')
    try {
        const { workSpace, folderName, fileName } = data;
        await Workspacectgrs.create({
            uid: '4272178176',
            workspace_name: workSpace,
            workspacesubctgrs_name: fileName,
            depth: 2,
            parent_id: folderName
        })
        return ({ state: 200, message: 'successful' })
    } catch (error) {
        console.log(error)
        return ({ state: 401, message: error })
    }
}

const findWorkspace = async () => {
    try {
        const data = await Workspacectgrs.findAll({
            where: {
                uid: '4272178176',
                workspace_name: '개인 워크스페이스',
            }
        })
        const result = data.map((el, index) => {
            return el.dataValues
        })
        console.log(result, 'findworkspace')
    } catch (error) {

    }
}
findWorkspace()

module.exports = { createPage, createFolder, findWorkspace }