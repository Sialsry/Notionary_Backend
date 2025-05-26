const router = require('express').Router()
const fs = require('fs');
const { TeamProject } = require('../models/config');
const { createFolder, createPage, findWorkspacedata } = require('../controllers/workspace/workspace.controller');

router.post('/saveData', (req, res) => {
    const { data } = req.body;
    res.json({ message: 'done' })
})

router.post('/newFolder', async (req, res) => {
    try {
        const { data } = req.body;
        const { Data } = await createFolder(data);
        res.json('newfolder')
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

router.get('/selectspace/:title', async (req, res) => {
    const {title} = req.params
    console.log('selectspace', title)
    res.json({state : 200, message : 'selectspace render'})
})

router.get('/workspacedata', async (req, res) => {
    const data = await findWorkspacedata();
    console.log(Array.isArray(data), data, 'true');
    res.json({data})
})

module.exports = router;