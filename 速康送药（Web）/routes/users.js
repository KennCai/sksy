var express = require('express');
var userDao = require('./../dao/userDao');
var multipart = require('connect-multiparty');
var goodsDao = require('./../dao/goodsDao');

var router = express.Router();
//购物车判断登入
router.get('/Tlogin', function (req, res, next) {
    console.log('Tlogin');
    userDao.TLogin(req, res, next);
});
router.post('/TJudge', function (req, res, next) {
    console.log('TJudge');
    //userDao.TLogin(req, res, next);
});
//user login
router.get('/Login', function (req, res, next) {
    console.log('Login');
    res.render("user/login.ejs", {Msg: "帐号或密码错误！"});
});

router.post('/loginjudge', function (req, res, next) {
    console.log('loginjudge');
    userDao.login(req, res, next);
});
//admin login
router.get('/glyLogin', function (req, res, next) {
    console.log('glyLogin');
    res.render("glyLogin.ejs");
});
router.post('/glyLoginjudge', function (req, res, next) {
    console.log('glyLoginjudge');
    userDao.glyLogin(req, res, next);
});

router.get('/S', multipart(), function (req, res) {
    console.log(req.session.adminid);
    var inf = "";
    console.log('req.session.AdminId:' + req.session.adminid);
    if (req.session.adminid == undefined) {
        inf = "<a href='/users/glyLogin' style='color: #5d61e0'>请登录</a>";
    }
    else {
        inf = "<a href='#' style='color: black'>欢迎 " + req.session.adminid + " 登录!</a>  <a href='/users/glyLogin'style='color:  #5d61e0'>退出</a>";

    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    //设置显示字符编码
    res.write(inf);
    res.end();
});
//user register
router.get('/Register', function (req, res, next) {
    console.log('Register');
    res.render("user/register.ejs");
});

//表单发送
router.post('/UserRegiste', function (req, res, next) {
    console.log('UserRegiste');
    userDao.add(req, res, next);
});


//===================================Login判断===================================

router.get('/Session', multipart(), function (req, res) {
    console.log(req.session.userId);
    var info = "";
    console.log('req.session.userId:' + req.session.userId);
    if (req.session.userId == undefined) {
        info = "<a href='/users/Login' style='color: red'>登录 </a><li><a href='/users/Register'>| 注册</a></li>";
    }
    else {
        info = "<a href='/users/ShowUser' style='color: red'>欢迎 [" + req.session.userId + "] 登录</a> | <a href='/users/LoginOut'  >退出</a>";

    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    //设置显示字符编码
    res.write(info);
    res.end();

});
//===================================LoginOut===================================
router.get('/LoginOut', function (req, res, next) {
    console.log('LoginOut');
    req.session.userId = null;
    req.session.src = null
    res.redirect("/");
});


router.get('/queryAll', function (req, res, next) {
    console.log('显示所有user');
    userDao.queryAll(req, res, next);
});


//==========显示前台所有的健康资讯信息============================
router.get('/Health', function (req, res, next) {
    console.log('显示所有user');
    userDao.queryAllInfo(req, res, next);
});


//==========显示后台所有的健康资讯信息============================
router.get('/ShowAllInfo', function (req, res, next) {
    console.log('显示所有user');
    userDao.showAllInfo(req, res, next);
});

//============修改密码==============
router.get('/ShowUpdatePassword', function (req, res, next) {
    res.render("UpdatePassword.ejs");
});


router.post('/UPassword', function (req, res) {
    console.log('修改密码');
    userDao.UpdatePassword(req, res);
});


//=======================================
router.get('/queryAllgoods', function (req, res, next) {
    userDao.queryAllgoods(req, res, next);
});

//==================================gybTest====================================

router.get('/Addgoods', function (req, res, next) {
    res.render("Addgoods.ejs");
});


router.post('/UploadPic', multipart(), function (req, res) {
    console.log('UploadPic');
    userDao.add2(req, res);
});

//==================================修改商品====================================

router.get('/UpdateGoods', function (req, res, next) {
    console.log('显示一个goods');
    userDao.UpdateShowgoods(req, res, next);
});


                          //修改个人资料

router.get('/UpdateUser', function (req, res, next) {

    userDao.UpdateShowuser(req, res, next);
});
router.post('/UploadPic2', multipart(), function (req, res) {
    console.log('UploadPic2');
    userDao.AddUpdateuser(req, res);
});
//==================================gybTest====================================
router.post('/UploadPic1', multipart(), function (req, res) {
    console.log('UploadPic1');
    userDao.AddshowUpdate(req, res);
});

                  //显示个人资料

router.get('/ShowUser', function (req, res, next) {

    userDao.ShowUser(req, res, next);
});


//================================Flow======================================
router.get('/Flow', function (req, res, next) {
    res.render("user/flow.html");
});

//================================Health======================================
//router.get('/Health', function (req, res, next) {
//    res.render("user/Health.ejs");
//});

//================================List======================================
router.get('/List', function (req, res, next) {
    res.render("user/list.html");
});

//================================关于我们.======================================
router.get('/Gywm', function (req, res, next) {
    res.render("user/关于我们.html");
});

//================================活动专区======================================
router.get('/Hdzq', function (req, res, next) {
    res.render("user/活动专区.html");
});
//====================帮助中心===========================


router.get('/dt', function (req, res, next) {
    res.render("user/dt.html");
});



router.get('/DeleteGoodsId', function (req, res, next) {
    console.log('Delete');
    userDao.deleteb(req, res, next);
});
//===================================单文件上传===================================
router.get('/Index', function (req, res, next) {
    res.render('Index1.ejs');
});

/* GET home page. */
router.get('/news', function (req, res, next) {
    res.render("newsAdd2.ejs");
});

router.post('/uploadImg', function (req, res, next) {
    userDao.uploadImg(req, res, next);
});
router.post('/addNews', function (req, res, next) {
    console.log("addNews")
    userDao.addNews(req, res, next);
});



//======================SenchaTouch调用=========================

router.post('/RegisterJSON', function (req, res, next) {
    console.log('RegisterJSON');
    userDao.registerJSON(req, res);
});

router.post('/LoginJSON', function (req, res, next) {
    console.log('LoginJSON');
    userDao.loginJSON(req, res);
});


//修改个人资料
router.get('/UpdateUser1', function(req, res, next) {
    console.log('显示一个oneperson');
    userDao.UpdateShowuser1(req, res, next);
});
router.get('/UpdateUser5', function(req, res, next) {
    console.log('显示一个oneperson');
    userDao.UpdateShowuser5(req, res, next);
});
// router.post('/UploadPic1',multipart(),function (req, res) {
//   console.log('UploadPic1');
//   userDao.AddUpdateuser1(req, res);
// });

router.post('/userangeST',multipart(),function (req, res) {
    console.log('/userangeST');
    userDao.AddUpdateuser2(req, res);
});
module.exports = router;
