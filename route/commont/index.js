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
    router.post('/', (req, res) => {
        console.log(req.body);
        db.query(`SELECT id FROM user_table WHERE username = ${req.body.commentator}`, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('database error').end();
            } else {
                const id = data[0].id;
                console.log(id);
                db.query(`INSERT INTO comment_table (news_id,status,content,reply_id,n_like_comment,commentator_id,comment_time) VALUES(
                ${req.body.news_id},0,'${req.body.content}',0,0,${id},CURRENT_TIMESTAMP()
                )`, (err, data) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('database error').end();
                    } else {
                        res.status(200).send({code: 0, msg: '发布成功'}).end();
                    }
                })
            }
        })

    });
    return router
};