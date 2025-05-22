const router = require('express').Router()
const fs = require('fs');



router.post('/', (req, res) => {
    const {data} = req.body;
    console.log(data)
    res.json({message : 'done'})
})


module.exports = router;