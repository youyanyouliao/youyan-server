
const express = require('express')
const app = express()
const session = require("express-session")
const path = require("path")
const CONSTANT = require('../constant/constant')
const fs = require("fs")
const multer = require("multer")
const multerObj = multer({dest:"./image"})
app.listen(5000, () => {
    console.log('http://127.0.0.1:5000')
})


const mysql = require('mysql')
const conn = mysql.createConnection({
    host: CONSTANT.HOST,
    user: CONSTANT.USER,
    password: CONSTANT.PASSWORD,
    database: CONSTANT.DATABASE
})
const bodyParser = require('body-parser')
//  解析表单的body-parser
// app.use(bodyParser.urlencoded({ extended: false }))
// 解析json
app.use(bodyParser.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.use('/static/image',express.static(path.join(__dirname,'image')));
app.use(multerObj.any());
module.exports = {
    app:app,
    conn:conn,
    fs:fs
};
