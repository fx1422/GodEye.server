const mysql = require('mysql');
const DB_CONFIG = {
    HOST: 'host',
    USER: 'root',
    PASSWORD: '123456',
    DATABASE: 'god_eye'

};
module.exports = function () {
    mysql.createPool({
        host: DB_CONFIG.HOST,
        user: DB_CONFIG.USER,
        password: DB_CONFIG.PASSWORD,
        database: DB_CONFIG.DATABASE
    })
};