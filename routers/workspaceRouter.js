const router = require('express').Router()
const fs = require('fs');
const { TeamProject } = require('../models/config');

router.post('/saveData', (req, res) => {
    const { data } = req.body;
    console.log(data)
    res.json({ message: 'done' })
})

router.post('/newFolder', async (req, res) => {
    try {
        const { data: { folderName } } = req.body;
        console.log(folderName, '111111')
        const { Data } = await createFolder(folderName);
        res.json('newfolder')
    } catch (error) {
        res.json({state : 200, message : error})
    }   

})

module.exports = router;