const router = require('express').Router()
const fs = require('fs');
const { TeamProject } = require('../models/config');
const { createFolder, createPage, findWorkspacedata, savetextData, findworkspacedata, findworkspaceid, getpageData, findWspaceContent } = require('../controllers/workspace/workspace.controller');
const { json } = require('sequelize');

router.post('/saveData', (req, res) => {
    const { data } = req.body;
    res.json({ message: 'done' })
})

router.post('/newFolder', async (req, res) => {
    try {
        const { data } = req.body;
        console.log(data,'newFolder')
        const { Data } = await createFolder({Data : data});
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

router.get('/selectspace/:workspacename/:foldername/:filename', async (req, res) => {
    const {workspacename,foldername,filename} = req.params
    console.log(workspacename,foldername,filename, 'ppp')
    const {workspaceId} = await findworkspaceid(workspacename,foldername,filename)
    console.log(workspaceId, 'ddddd')
    const PageData = await getpageData(workspaceId,filename)
    console.log(PageData)
    res.json({data : PageData})
})

router.post('/selectspace/:workspacename/:foldername/:filename', async (req, res) => {
    const {workspacename,foldername,filename} = req.params
    const {data} = req.body;
    const Data = JSON.stringify(data)
    const {workspaceId} = await findworkspaceid(workspacename,foldername,filename)
    console.log(workspaceId, 'ddddd')
    const savepageData = await savetextData(workspaceId,filename, Data)
    const PageData = await getpageData(workspaceId,filename)
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
    // console.log(data)
    // console.log(Array.isArray(data), data, 'true');
    res.json({data })
})

router.get('/workspaceContent', async (req, res) => {
    const {wname} = req.body;
    const data = await findWspaceContent(wname)
    res.json({data})
})


module.exports = router;