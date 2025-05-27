const router = require('express').Router()
const fs = require('fs');
const { TeamProject } = require('../models/config');
const { createFolder, createPage, findWorkspacedata, savetextData, findworkspacedata, findworkspaceid, getpageData } = require('../controllers/workspace/workspace.controller');
const { json } = require('sequelize');

router.post('/saveData', (req, res) => {
    const { data } = req.body;
    res.json({ message: 'done' })
})

router.post('/newFolder', async (req, res) => {
    try {
        const { data } = req.body;
        console.log(data,'newFolder')
        const { Data } = await createFolder(data);
        console.log('successful' , Data)
        res.json({data : Data})
    } catch (error) {
        res.json({state : 200, message : error})
    }   
})


router.post('/newPage', async (req, res) => {
    const {data} = req.body;
    try {
        console.log(data, 'Pageeeeeeeeeeeeeeee')
        const {Data} = await createPage(data)
        res.json({state : 200, data})
    } catch (error) {
        res.json({state : 200, message : error})
    }
})

router.post('/selectspace/:workspacename/:foldername/:filename', async (req, res) => {
    const {workspacename,foldername,filename} = req.params
    // console.log(workspacename,foldername,filename,'oooooo')
    const {data} = req.body;
    const Data = JSON.stringify(data)
    console.log(Data, 'pagedata')
    const {workspacedataid} = await findworkspaceid(workspacename,foldername,filename)
    console.log(workspacedataid.workspace_id,'workspacedataid' )
    const savepageData = await savetextData(workspacedataid.workspace_id,filename, Data)
    console.log(savepageData, 'pagedata')
    const PageData = await getpageData(workspacedataid.workspace_id,filename)
    console.log(PageData, 'Pagedata')
    res.json({data : PageData})
})

router.get('/workspacedataOne', async (req, res) => {
    const data = await findWorkspacedata( '개인 워크스페이스');
    // console.log(Array.isArray(data), data, 'true');
    console.log(data,'dataone')
    res.json({data})
})
router.get('/workspacedataTwo', async (req, res) => {
    const data = await findWorkspacedata( '팀 워크스페이스');
    console.log(data,'datatwo')
    console.log(data)
    // console.log(Array.isArray(data), data, 'true');
    res.json({data })
})




module.exports = router;