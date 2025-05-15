const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors({origin : '*'}))
app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.use('/', (req,res) => [
    res.json('홈페이지')
])


app.listen(4000, (req, res) => {
    console.log('server on~')
})