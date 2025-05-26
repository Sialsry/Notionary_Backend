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

        return {state : 200, message : 'success'}
    } catch (error) {
        return {state : 401, message : error}
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
        // console.log(error)
        return ({ state: 401, message: error })
    }
}

const findWorkspacedata = async () => {
    try {
        const data = await Workspacectgrs.findAll({
            where: {
                uid: '4272178176',
                
            },
            include: [{
                model: Workspacectgrs,
                as: 'subCategories',
                attributes: ['workspacesubctgrs_name']
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

            if (!grouped[workspaceName]) {
                grouped[workspaceName] = {}
            }
            if (isParent) {
                grouped[workspaceName][item.workspacectgrs_name] = []
            }
            if (isChild) {
                const parent = rawData.find(
                    (p) => String(p.workspacectgrs_name) === String(item.parent_id) && p.depth === 1
                )
                if (parent && parent.workspacectgrs_name) {
                    if (!grouped[workspaceName]) {
                        grouped[workspaceName] = {};
                    }

                    if (!grouped[workspaceName][parent.workspacectgrs_name]) {
                        grouped[workspaceName][parent.workspacectgrs_name] = [];
                    }
                    if (item.workspacesubctgrs_name) {
                        grouped[workspaceName][parent.workspacectgrs_name].push(item.workspacesubctgrs_name);
                    }
                }
            }
        }
        console.log(grouped,'grouped')
        for (const [workspace, ctgrs] of Object.entries(grouped)) {
            console.log(ctgrs, 'ctgrs')
            const formatted = Object.entries(ctgrs).map(([ctgrName, subCtgrs]) => {
                return { [ctgrName]: subCtgrs }
            })
            result.push({ [workspace]: formatted });
        }
        console.log(result, 'restt')
        if(result.length >= 0) {
            const newResult = result.map(el => [el])
            console.log(newResult)
            return newResult 
        }
        // console.log(result)
        return({result})
    } catch (error) {
        console.log(error)
    }
}
findWorkspacedata()



module.exports = { createPage, createFolder, findWorkspacedata }