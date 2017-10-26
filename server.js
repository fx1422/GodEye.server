const express = require('express');
const static = require('express-static');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerObj = multer({dest: './static/upload'});
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const expressRoute = require('express-router');

const server = express();
//------跨域设置-----

server.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

server.listen(3000,'0.0.0.0');
console.log('---------------------------listen:8888 success-------------------------')

//------获取请求------
server.use(bodyParser.urlencoded({extended: false}));
server.use(multerObj.any());

//-------------cookie--session-----

server.use(cookieParser());
(function () {
    let keys = [];
    for (let i = 0; i < 1000000; i++) {
        keys[i] = 'hscse' + Math.random();
    }
    server.use(cookieSession({
        name: 'session_id',
        keys,
        maxAge: 20 * 60 * 100
    }));
})();

//----------------------route------
server.use('/home', require('./route/home/')());
server.use('/login', require('./route/login/')());
server.use('/post_comment', require('./route/commont/')());

//-----------static--------
server.use(static('./static/'));




