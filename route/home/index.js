const utils = require('../../libs/utils');
const express = require('express');
const mysql = require('mysql');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'god_eye'
});
module.exports = function () {
    const router = express.Router();
    router.get('/', (req, res) => {
        db.query(`SELECT a.id,a.time,a.title,a.to_top,b.username,a.n_comment,a.img_src FROM news_table a INNER JOIN user_table b ON a.author_id = b.id `, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('database error')
            } else {
                //----时间格式化----
                for (let value of data) {
                    value.time = utils.handleTime(value.time)
                }
                res.send(data).end();
            }
        })
    });

    router.get('/newsContent', (req, res) => {
        const newsId = req.query.id;
        db.query(`SELECT a.*,b.username,b.n_fans FROM news_table a LEFT JOIN user_table b ON a.author_id=b.id WHERE a.id= ${newsId}`, (err, data) => {
            if (err) {
                res.status(500).send('database error').end()
            }else {
                for (let value of data) {
                    value.time = utils.handleTime(value.time)
                }
                res.status(200).send(data).end();
            }
        });
    });

    router.get('/comment',(req,res)=>{
        const newsId = req.query.id;
        db.query(`SELECT a.*,b.username FROM comment_table a LEFT JOIN user_table b ON a.commentator_id=b.id WHERE news_id=${newsId} AND status=0`,(err,data)=>{
            if(err){
                console.error(err);
                res.status(500).send('database error').end();
            }else {
                for (let value of data) {
                    value.comment_time = utils.handleTime(value.comment_time)
                }
                res.send(data).end()
            }
        })
    });
    return router
};