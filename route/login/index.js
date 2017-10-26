const express = require('express');
const querystring = require('querystring');
const http = require('http');
const https = require('https');
const utils = require('../../libs/utils');
const mysql = require('mysql');
const SMSClient = require('@alicloud/sms-sdk');
const API = require('../../API');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'god_eye'
});

module.exports = function () {
    const router = express.Router();
    router.post('/', (req, res) => {
        const note = req.body.note_code;
        const mobile = req.body.username;
        db.query(`SELECT note FROM note_table WHERE mobile=${mobile}`, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('database error').end();
            } else {
                if (note === data[0].note) {
                    req.session.token_login = mobile;
                    db.query(`select username  from user_table where username=${mobile}`, (err, data) => {
                        if (err) {
                            console.error(err)
                        } else {
                            if (data.length <= 0) {
                                db.query(`insert into user_table (username,password,log,n_fans) values (${mobile},000,000,000)`, (err, data) => {
                                    if (err) {
                                        console.error(err)
                                    }
                                })
                            }
                            res.status(200).send({'code': 0, 'message': '验证码正确'}).end();
                        }
                    });
                } else {
                    res.status(200).send({'code': 1, 'message': '验证码错误'}).end();
                }
            }
        });

    });

    //--------短信验证码---------------
    router.post('/get_note_code', (req, res) => {
        const randCode = utils.randomNoteCode();
        const mobile = req.body.username;
        const accessKeyId = API.accessKeyId;
        const secretAccessKey = API.secretAccessKey;
        let smsClient = new SMSClient({accessKeyId, secretAccessKey});
        smsClient.sendSMS({
            PhoneNumbers: mobile,
            SignName: '张加强',
            TemplateCode: 'SMS_105785102',
            TemplateParam: `{"code":${randCode}}`
        }).then(function (res) {
            let {Code} = res;
            if (Code === 'OK') {
                console.log(res)
            }
        }, function (err) {
            console.log(err)
        });
        db.query(`SELECT * FROM note_table WHERE mobile=${mobile}`, (err, data) => {
            if (err) {
                console.error(err);
                res.status(200).send('database error').end();
            } else {
                if (data.length > 0) {
                    db.query(`UPDATE note_table SET note=${randCode} WHERE mobile=${mobile} `, (err, data) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send('database error').end();
                        } else {
                            res.status(200).send('update ok').end();
                        }
                    })
                } else {
                    db.query(`INSERT INTO note_table (mobile,note) VALUES(${mobile},${randCode})`, (err, data) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send('database error').end();
                        } else {
                            res.status(200).send('insert into ok').end();
                        }
                    })
                }

            }
        });
    });

    return router;
};

function smsPost(uri, content, host, resp) {
    const options = {
        hostname: host,
        port: 443,
        path: uri,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    let req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (result) {
            console.log(typeof result);
            console.log(result);
            if (JSON.parse(result).code === 0) {
                resp.send("success").end();
            } else {
                resp.send("fail").end();
            }
        });
    });
    req.write(content);
    req.end();
}