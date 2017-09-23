/**
 * Created by ybgong on 2016/9/19.
 */

var dbconfig=require('./../conf/db');
var mysql = require('mysql');
var db    = {};
var pool  = mysql.createPool(dbconfig);
db.query = function(sql, callback){
    if (!sql) {
        callback();
        return;
    }
    pool.query(sql, function(err, result, fields) {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        };

        callback(null, result, fields);
    });
}
module.exports = db;