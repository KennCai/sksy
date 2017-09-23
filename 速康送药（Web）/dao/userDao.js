
var $conf = require("./../conf/db");
var $sql = require('./userSqlMapping');
var mysql = require('mysql');
var path = require('path');
var uuid = require('node-uuid');
var fs = require('fs');
var url = require('url');
var formidable = require('formidable');
var pwdHelper = require('./../myutil/pwdHelper');

//创建连接池
var pool = mysql.createPool($conf);
//post参数获取
//register
var add=function (req, res, next) {
    // 为了简单，要求同时传5个参数
    var param = req.body;
    console.log(param);
    if(param.UserId== null || param.UserPassword == null) {
        return;
    }
    pool.getConnection(function (err, connection) {
        var pwd = param.UserPassword;          //直接对"123456"字符串加密
        var encode = pwdHelper.encrypwd(pwd);
        connection.query($sql.insert2, [param.UserId,encode,'avatar.png'], function (err, result) {
            if (err) {
                console.log(err.message);
            }
            else {
                connection.query($sql.queryByIdAndPwd, [param.UserId,encode], function (err, result) {
                    if (err) {
                        res.render("404Error.ejs");
                        console.log("错误：" + err.message);
                        return;  //退出query方法，后面的代码不执行了；
                    }
                    else {
                        console.log(JSON.stringify(result));
                        if (result.length ==0) {
                            res.render("user/login.ejs", {Msg: "帐号或密码错误！"});
                        }
                        else {
                            req.session.userId = param.UserId;
                            console.log(JSON.stringify(result[0].UserId));
                            res.redirect("/");
                        }
                        connection.release();
                    }
                });
            }
        });
    });
}
//users login
var login = function (req, res, next) {
    var param = req.body;
    console.log(param.UserId);
    console.log(param.UserPassword);
    var pwd = param.UserPassword;          //直接对"123456"字符串加密
    var encode = pwdHelper.encrypwd(pwd);
    pool.getConnection(function (err, connection) {
        if (err) {
            res.render("404Error.ejs");
            // console.log(err.message);
            // return;
        }
        else {
            connection.query($sql.queryByIdAndPwd, [param.UserId,encode], function (err, result) {

                if (err) {
                    res.render("404Error.ejs");
                    console.log("错误：" + err.message);
                    return;  //退出query方法，后面的代码不执行了；
                }
                else {
                    console.log(JSON.stringify(result));
                    if (result.length ==0) {
                        res.render("user/login.ejs", {Msg: "帐号或密码错误！"});
                    }
                    else {
                        req.session.userId = param.UserId;
                        // 直接跳转到页面：
                        //res.render("/user/index.ejs", {users: result});
                        // 直接跳转到路由，有session判断
                        console.log(JSON.stringify(result[0].UserId));
                        
                        res.redirect("/");
                    }
                    connection.release();

                }
            });
        }
    });
}
//admin login
var glyLogin= function (req, res, next) {
    var param = req.body;
    console.log(param.AdminId);
    console.log(param.AdminPassword);
    var pwd = param.AdminPassword;          //直接对"123456"字符串加密
    var encode = pwdHelper.encrypwd(pwd);
    pool.getConnection(function (err, connection) {
        if (err) {
            res.render("404Error.ejs");
            // console.log(err.message);
            // return;
        }
        else {
            connection.query("select * from admin where AdminId=? and AdminPassword=?",
                [param.AdminId, encode], function (err, result) {

                if (err) {
                    res.render("404Error.ejs");
                    console.log("错误：" + err.message);
                    return;  //退出query方法，后面的代码不执行了；
                }
                else {
                    console.log(JSON.stringify(result));
                    if (result.length ==0) {
                        res.render("glyLogin.ejs", {Msg: "帐号或密码错误！"});
                    }
                    else {
                        req.session.adminid= param.AdminId;
                        console.log(req.session.adminid)
                        // 直接跳转到页面：
                        //res.render("user/showAllUsers.ejs", {users: result});
                        // 直接跳转到路由，有session判断
                        console.log(JSON.stringify(result[0].AdminId));
                        res.redirect("/users/Index");
                    }
                    connection.release();
                }
            });
        }
    });
}
//首页购物车按钮判断TLogin
var TLogin=function(req, res,next) {
    if (!req.session.userId) {
        req.session.error = "用户已过期，请重新登录:"
        res.render("user/login.ejs", {Msg: "请登录！"});
        //res.redirect('/users/Login');
    }
    else {

        res.redirect('/goods/Cart');
    }

}

//后台显示所有用户
var queryAll=function (req, res, next) {
    if(!req.session.adminid){
        res.redirect('/users/glyLogin');
    }
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }
        else{
            connection.query($sql.queryAll,function(err, result) {
                if(err){
                    console.log("错误："+err.message);
                    //res.redirect('/users/glyLogin');
                    return;  //退出query方法，后面的代码不执行了；
                }
                // console.log(JSON.stringify(result));
                // 输出JSON到界面
                res.render("showallusers.ejs",{users:result});
                connection.release();
            });
        }
    });
}
//后台显示所有商品
var queryAllgoods=function (req, res, next) {
    if(!req.session.adminid){
        res.redirect('/users/glyLogin');
    }
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }
        else{
            connection.query($sql.queryAll2, function(err, result) {
                if(err){
                    console.log("错误："+err.message);
                    return;  //退出query方法，后面的代码不执行了；
                }
                // console.log(JSON.stringify(result));
                // 输出JSON到界面
                res.render("showgoods.ejs",{goods:result});
                connection.release();
            });
        }
    });
}

//后台添加商品
var add2 = function (req, res) {
    if(!req.session.adminid){
        res.redirect('/users/glyLogin');
    }
    var param = req.body;
    console.log(req.files.files.length);
    //================upload==========================
    console.log(req.files);
    console.log("req.files.files.originalFilename:" + req.files.files.originalFilename);
    console.log("req.files.files.path:" + req.files.files.path);
    var filename = req.files.files.originalFilename || path.basename(req.files.files.path);
    console.log("filename:" + filename);
    console.log("dirname:" + path.dirname(__filename));
    console.log("  path.resolve(__dirname, '../'):" + path.resolve(__dirname, '../'));
    //copy file to a public directory
    /*-------------filename------------------*/
    var v = uuid.v4();
    var suffix = filename.substr(filename.lastIndexOf("."));
    var _myFileName = v + suffix;

    console.log("_myFileName:" + _myFileName);
    /*-------------filename------------------*/
    var targetPath = path.resolve(__dirname, '../') + '/public/upload/' + _myFileName;
    console.log("targetPath:" + targetPath);
    console.log("req.files.files.path:" + req.files.files.length);
    //copy file
    fs.createReadStream(req.files.files.path).pipe(fs.createWriteStream(targetPath));
    //return file url
//================insert==========================
    console.log(" GoodsId :" + param.GoodsId);
    console.log(" GoodsName :" + param.GoodsName);
    console.log(" Price :" + param.Price);
    // console.log(" Gender :" + param.Gender);
    // console.log(" BirthDate :" + param.BirthDate);
    console.log(" Pic :" + filename);
    if (param.GoodsId == null || param.GoodsName == null || param.Price == null) {
        console.log("param.GoodsId == null");
        res.json({code: 500});
    }
    /*-------------string md5------------------*/
    // var pwd = param.UserPassword;          //直接对"123456"字符串加密
    // var encode = pwdHelper.encrypwd(pwd);
    // console.log("string:" + encode);
    pool.getConnection(function (err, connection) {
        connection.query($sql.insert1,
            [param.GoodsId, param.GoodsName, param.Price, _myFileName],
            function (err, result) {
                if (err) {
                    console.log(err.message);
                    res.json({code: 500});
                }
                else {
                    // 使用页面进行跳转提示
                    if (result.affectedRows > 0) {
                        res.json({code: 200});

                    } else {
                        res.json({code: 500});
                    }
                }
                connection.release();
            });
    });
};
//后台删除商品
var deleteb=function(req,res,next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }
        else {
            connection.query('delete from goods where GoodsId=?', [req.query.GoodsId], function (err, result, fields) {
                if (err) {
                    console.log("错误1：" + err.message);
                    return;
                }
                connection.query("select * from goods", function (err, result, fields) {
                    if (err) {
                        console.log("错误2：" + err.message);
                        return;
                    }
                    console.log(result);
                    res.render("showgoods.ejs",{goods:result});
                    connection.release();
                });
            });
        }
    });
};
//后台修改商品
var UpdateShowgoods=function (req, res, next) {
    var param = req.query.GoodsId;
    console.log(param);
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }
        else{
            connection.query('select * from goods where GoodsId=?',[param ],
                function(err, result) {
                    if(err){
                        console.log("错误："+err.message);
                        return;  //退出query方法，后面的代码不执行了；
                    }
                    // console.log(JSON.stringify(result));
                    // 输出JSON到界面
                    res.render("UpdateGoods.ejs",{goods:result});
                    connection.release();
                });
        }
    });
}
//=================后台商品显示修改=================
var AddshowUpdate = function (req, res) {
    if(!req.session.adminid){
        res.redirect('/users/glyLogin');
    }
    var param = req.body;
    console.log(req.files.files.length);
    //================upload==========================
    console.log(req.files);
    console.log("req.files.files.originalFilename:" + req.files.files.originalFilename);
    console.log("req.files.files.path:" + req.files.files.path);
    var filename = req.files.files.originalFilename || path.basename(req.files.files.path);
    console.log("filename:" + filename);
    console.log("dirname:" + path.dirname(__filename));
    console.log("  path.resolve(__dirname, '../'):" + path.resolve(__dirname, '../'));
    //copy file to a public directory

    /*-------------filename------------------*/
    var v = uuid.v4();
    var suffix = filename.substr(filename.lastIndexOf("."));
    var _myFileName = v + suffix;

    console.log("_myFileName:" + _myFileName);
    /*-------------filename------------------*/
    var targetPath = path.resolve(__dirname, '../') + '/public/upload/' + _myFileName;
    console.log("targetPath:" + targetPath);
    console.log("req.files.files.path:" + req.files.files.length);
    //copy file
    fs.createReadStream(req.files.files.path).pipe(fs.createWriteStream(targetPath));
    //return file url
//================insert==========================
//     console.log(" GoodsId :" + param.GoodsId);
    console.log(" GoodsName :" + param.GoodsName);
    console.log(" Price :" + param.Price);
    // console.log(" Gender :" + param.Gender);
    // console.log(" BirthDate :" + param.BirthDate);
    console.log(" Pic :" + filename);

    pool.getConnection(function (err, connection) {
        connection.query($sql.update1,
            [param.GoodsName, param.Price, _myFileName,param.GoodsId],
            function (err, result) {
                if (err) {
                    console.log('============='+err.message);
                    res.json({code: 500});
                    return;
                }
                else {
                    // 使用页面进行跳转提示
                    if (result.affectedRows > 0) {
                        res.json({code: 200});

                    } else {
                        res.json({code: 500});
                    }

                }
                connection.release();
            });
    });
};



//===================显示个人资料=========
var ShowUser=function (req, res, next) {
    if(!req.session.userId){
        res.redirect('/users/Login');
    }
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }
        else{
            connection.query('select * from user where UserId=?',[req.session.userId ],//显示个人信息
                function(err, result) {
                    if(err){
                        console.log("错误："+err.message);
                        return;  //退出query方法，后面的代码不执行了；
                    }
                    // console.log(JSON.stringify(result));
                    // 输出JSON到界面
                    res.render("ShowOnePerson.ejs",{showUser:result});
                    connection.release();
                });
        }
    });
};

//===================显示修改个人资料界面=========
var UpdateShowuser=function (req, res, next) {
    if(!req.session.userId){
        res.redirect('/users/Login');
    }
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }
        else{
            connection.query('select * from user where UserId=?',[req.session.userId ],//显示个人信息
                function(err, result) {
                    if(err){
                        console.log("错误："+err.message);
                        return;  //退出query方法，后面的代码不执行了；
                    }
                    // console.log(JSON.stringify(result));
                    // 输出JSON到界面
                    res.render("UpdateUser.ejs",{user:result});
                    connection.release();
                });
        }
    });
};
       //修改个人资料
var AddUpdateuser= function (req, res) {

    var param = req.body;

    var filename = req.files.files.originalFilename || path.basename(req.files.files.path);


    /*-------------filename------------------*/
    var v = uuid.v4();
    var suffix = filename.substr(filename.lastIndexOf("."));
    var _myFileName = v + suffix;


    /*-------------filename------------------*/
    var targetPath = path.resolve(__dirname, '../') + '/public/upload/' + _myFileName;

    fs.createReadStream(req.files.files.path).pipe(fs.createWriteStream(targetPath));



//================insert==========================
    console.log(" userId :" + param.UserId);
    console.log(" UserName :" + param.UserName);
    console.log(" Gender :" + param.Gender);
    console.log(" BirthDate :" + param.Birthday);
    console.log(" Pic :" + filename);

    console.log(req.session.userId);
    var UserId = req.session.userId;
    // console.log("1")
    pool.getConnection(function (err, connection) {
        connection.query("update user set UserName=?,Gender=?,Pic=?,Birthday=?,Utel=? where UserId=?"
            ,
            [param.UserName, param.Gender, _myFileName, param.Birthday,param.Utel,req.session.userId],
            function (err, result) {
                if (err) {
                    console.log(err.message);
                    res.json({code: 500});

                }
                else {
                    // 使用页面进行跳转提示
                    if (result.affectedRows > 0) {
                        res.json({code: 200});
                        console.log(result.affectedRows)

                    } else {
                        res.redirect("/users/ShowUser");

                        console.log("1:"+result.affectedRows)
                    }
                }
                connection.release();
            });
    });
};


//上传图片
var uploadImg = function (req, res, next) {
    //================================================
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = __dirname + '/../public/news';
    console.log(form.uploadDir);
    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err;
        }
        var image = files.imgFile;
        var path = image.path;
        path = path.replace(/\\/g, '/');
        console.log(image.path);
        //\ExpressKindEditorUpload示例\public\upload\upload_35f0310b6f1b7f4669878441ba29635d.jpg
        var url = '/news' + path.substr(path.lastIndexOf('/'), path.length);
        var info = {
            "error": 0,
            "url": url
        };
        res.send(info);
    });
};


//后台资讯添加
var addNews = function (req, res, next) {
    var param = req.body;
    //================insert==========================
    console.log(" Title :" + param.Title);
    console.log(" Write :" + param.Writer);
    console.log(" Icontent :" + param.Icontent);
    console.log(" InfoTime :" + param.InfoTime);

    if (param.Title == undefined ||  param.Icontent == undefined ) {
        console.log("param.Title == undefined");
        res.json({code: 500, msg: {url: 'http://' + req.headers.host + '/' + filename}});

    }
    pool.getConnection(function (err, connection) {
        connection.query($sql.insert3,
            [param.Title,param.Writer,param.Icontent,param.InfoTime],
            function (err, result) {
                if (err) {
                    console.log(err.message);
                    res.json({code: 500, msg: {url: 'http://' + req.headers.host + '/'}});
                }
                else {
                    // 使用页面进行跳转提示
                    if (result.affectedRows > 0) {
                        res.redirect("/users/ShowAllInfo");

                    } else {
                        res.render("newsAdd2.ejs", {Msg: "帐号或密码错误！"});

                    }
                }
                connection.release();
            });
    });
};
//==========后台页面显示资讯========================
var showAllInfo=function (req, res, next) {
    if(!req.session.adminid){
        res.redirect('/users/glyLogin');
    }
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }
        else{
            connection.query($sql.queryAllInfo, function(err, result) {
                if(err){
                    console.log("错误："+err.message);
                    return;  //退出query方法，后面的代码不执行了；
                }
                res.render("showallInfo.ejs",{informations:result});
                connection.release();
            });
        }
    });
}
//==========前台页面显示资讯========================
var queryAllInfo=function (req, res, next) {
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }
        else{
            connection.query($sql.queryAllInfo, function(err, result) {
                if(err){
                    console.log("错误："+err.message);
                    return;  //退出query方法，后面的代码不执行了；
                }
                res.render("user/Health.ejs",{informations:result});
                connection.release();
            });
        }
    });
};
//==================修改密码===================
var UpdatePassword = function (req,res) {
    if(!req.session.userId){
        res.redirect('/users/Login');
    }
    var param = req.body;
    console.log(param);
    var UserId = req.session.userId;
    console.log(UserId);
    console.log('原始密码'+param.UserPassword);
    console.log('新密码'+param.SetNewPassword);
    var pwd = param.SetNewPassword;          //直接对"123456"字符串加密
    var encode = pwdHelper.encrypwd(pwd);
    //upload===================


    if(param.UserPassword== null || param.SetNewPassword == null) {
        return;
    }
    pool.getConnection(function (err, connection) {
        connection.query('update user set UserPassword=? where UserId=? ',
            [encode,req.session.userId], function (err, result) {
                if (err) {
                    console.log(err.message);
                    // res.render('fail', {
                    //     result: result
                    // });
                }
                else {

                    // 使用页面进行跳转提示
                    console.log(result);
                    if (result.affectedRows > 0) {
                        // res.render('suc', {
                        //     result: result
                        // }); // 第二个参数可以直接在jade中使用
                        console.log("影响的行"+result.affectedRows)
                        //res.render('user/index.ejs')
                        res.redirect("/users/ShowUser");
                    } else {
                        res.redirect("/users/ShowUpdatePassword");
                        //res.render('UpdatePassword.ejs')
                    }
                    console.log(result);
                }
                connection.release();
            });
    });

};



//=====================================SenchaTouch JSON===================================

//Ajax 增加
var registerJSON = function (req, res) {
    var param = req.body;

//================insert==========================
    console.log(" UserId :" + param.UserId);

    console.log(" UserPassword :" + param.UserPassword);


    /*-------------string md5------------------*/
    var pwd = param.UserPassword;          //直接对"123456"字符串加密
    var encode = pwdHelper.encrypwd(pwd);
    console.log("pwd:" + encode);

    pool.getConnection(function (err, connection) {
        connection.query($sql.insert2, [param.UserId, encode,'avatar.png'], function (err, result) {
            if (err) {
                console.log(err.message);
                res.json({"success":false});

            }
            else {
                console.log("result.affectedRow"+result.affectedRow)
                // 使用页面进行跳转提示
                if (result.affectedRows > 0) {
                    res.json({"success":true});

                } else {
                    res.json({"success":false});
                }
            }
            connection.release();
        });
    });
};

var loginJSON = function (req, res, next) {
    var param = req.body;
    console.log(param.UserId);
    console.log(param.UserPassword);
    /*-------------string md5------------------*/

    var pwd = pwdHelper.encrypwd(param.UserPassword);
    console.log(pwd);
    pool.getConnection(function (err, connection) {
        if (err) {
            res.json({"success": false});
        }
        else {
            connection.query($sql.queryByIdAndPwd, [param.UserId, pwd], function (err, result) {
                if (err) {
                    res.json({"success": false});
                }
                else {
                    console.log(JSON.stringify(result));
                    if (result.length == 0) {
                        res.json({"success": false});
                    }
                    else {
                        res.json({"success": true});

                    }
                }
            });
        }
    });
};

//===================UpdateShowuser显示个人=========
var UpdateShowuser1=function (req, res, next) {
    var UserId=req.query.UserId;
    pool.getConnection(function(err, connection) {
        connection.query('select * from user where UserId=?',UserId,//显示个人信息
            function(err, result1) {
                res.json({success:true,users:result1});      //往页面发送JSON字符串数据；
                console.log(result1);
                connection.release();
            });

    });
};

//===================UpdateShowuser显示个人=========
var UpdateShowuser5=function (req, res, next) {
    var UserId=req.query.UserId;
    pool.getConnection(function(err, connection) {
        connection.query('select * from user where UserId=?',UserId,//显示个人信息
            function(err, result1) {
                res.json({success:true,users:result1});      //往页面发送JSON字符串数据；
                console.log(result1);
                connection.release();
            });

    });
};

// var AddUpdateuser1= function (req, res) {
//     var param = req.body;
//     var UserId=req.body.UserId
//     console.log(" GoodsId :" + param.UserName);
//     console.log(" GoodsName :" + param.Utel);
//     console.log(" Price :" + param.UserId);
//
//     pool.getConnection(function (err, connection) {
//         connection.query("update user set UserName=?,Utel=? where UserId=?",
//             [param.UserName,param.Utel,UserId],
//             function (err, result1) {
//                 res.json({success:true,users:result1});      //往页面发送JSON字符串数据；
//                 console.log(result1);
//                 connection.release();
//             });
//     });
// };
//修改个人资料
var AddUpdateuser1= function (req, res) {


    var UserId=req.query.UserId;
    var UserName=req.query.UserName;
    var Gender=req.query.Gender;
    var Utel=req.query.Utel;
    var  Birthday=req.query.Birthday;
    // var filename = req.files.files.originalFilename || path.basename(req.files.files.path);
    //
    // /*-------------filename------------------*/
    // var v = uuid.v4();
    // var suffix = filename.substr(filename.lastIndexOf("."));
    // var _myFileName = v + suffix;
    //
    //
    // /*-------------filename------------------*/
    // var targetPath = path.resolve(__dirname, '../') + '/public/upload/' + _myFileName;
    //
    // fs.createReadStream(req.files.files.path).pipe(fs.createWriteStream(targetPath));
    //
    console.log("1")
//================insert==========================
    console.log(" userId :" + UserId);
    console.log(" UserName :" + UserName);
    console.log(" Gender :" + Gender);
    console.log(" Birthday :" + Birthday);

    pool.getConnection(function (err, connection) {
        connection.query("update user set UserName=?,Gender=?,Birthday=?,Utel=? where UserId=?"
            ,
            [UserName, Gender,Birthday,Utel,UserId],
            function (err, result) {
                if (err) {
                    console.log(err.message);
                    res.json({"success": false});
                }
                else {
                    // 使用页面进行跳转提示
                    if (result.affectedRows > 0) {
                        res.json({"success":true});
                        console.log(result.affectedRows)

                    } else {
                        res.json({"success": false});
                        console.log("1:"+result.affectedRows)
                    }
                }
                connection.release();
            });
    });
};

//修改个人资料
var AddUpdateuser2= function (req, res) {

    var param = req.body;
    var UserId=param.UserId
    var UserName=param.UserName

    console.log(UserId)
    console.log(UserName)
    console.log(param.Gender)
    console.log(param.Birthday)
    console.log(param.Utel)

    var filename = req.files.files.originalFilename || path.basename(req.files.files.path);
    /*-------------filename------------------*/
    var v = uuid.v4();
    var suffix = filename.substr(filename.lastIndexOf("."));
    var _myFileName = v + suffix;
    var targetPath = path.resolve(__dirname, '../') + '/public/upload/' + _myFileName;
    fs.createReadStream(req.files.files.path).pipe(fs.createWriteStream(targetPath));

    pool.getConnection(function (err, connection) {
        connection.query("update user set UserName=?,Gender=?,Birthday=?,Utel=?,Pic=? where UserId=?",
            [UserName,param.Gender,param.Birthday,param.Utel,_myFileName,UserId],
            function (err, result) {
                if (err) {
                    console.log(err.message);
                    res.json({code: 500});
                }
                else {
                    // 使用页面进行跳转提示
                    if (result.affectedRows > 0) {
                        res.json({code: 200});
                        console.log(result.affectedRows)

                    } else {
                        res.json({code: 500});
                        console.log("1:"+result.affectedRows)
                    }
                }
                connection.release();
            });
    });
};


//=============================
exports.uploadImg = uploadImg;
exports.addNews = addNews;
exports.UpdatePassword = UpdatePassword;
exports.queryAll=queryAll;
exports.showAllInfo=showAllInfo;
exports.queryAllInfo=queryAllInfo;
exports.add2=add2;
exports.queryAllgoods=queryAllgoods;
exports.deleteb=deleteb;
exports.UpdateShowgoods=UpdateShowgoods;
exports.UpdateShowuser=UpdateShowuser;
exports.AddUpdateuser=AddUpdateuser;
exports.AddshowUpdate=AddshowUpdate;
exports.TLogin=TLogin
exports.glyLogin=glyLogin;
exports.login=login;
exports.add=add;
exports.ShowUser=ShowUser;


//semcha
exports.registerJSON = registerJSON;
exports.loginJSON = loginJSON;
exports.UpdateShowuser1 = UpdateShowuser1;
exports.AddUpdateuser1 = AddUpdateuser1;
exports.UpdateShowuser5 = UpdateShowuser5;
exports.AddUpdateuser2 = AddUpdateuser2;