/**
 * Created by ybgong on 2016/9/16.
 */
var crypto = require('crypto');

/*-------------string md5------------------*/
var encrypwd = function (pwd) {
    var hash = crypto.createHash("md5");
    hash.update(pwd);          //直接对"123456"字符串加密
    var encode = hash.digest('hex');
    console.log("string:" + encode);
    return encode;
};

exports.encrypwd=encrypwd;
