/**
 * Created by ybgong on 2016/9/6.
 */
var $conf = require("./../conf/db");
var mysql = require('mysql');
var path = require('path');
var uuid = require('node-uuid');
var fs = require('fs');
var url = require('url');
var $sql = require('./goodsSqlMapping');
var moment = require('moment');
//创建连接池
var pool = mysql.createPool($conf);

//分页处理
var showGoodsByPage = function (req, res, next) {
    var page=url.parse(req.url, true).query.page;
    if(undefined==page){
        page=1;
    }
    console.log("当前页码page:"+page);  //得到页码
    //=======================================================
    var startRow=(page-1)*$conf.pageSize;    //得到每页开始行
    console.log("每页开始行startRow："+startRow);

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }
        else {
            //查询总共有多少条数据
            connection.query($sql.getTotalCount, function (err, result) {
                if (err) {
                    console.log("错误：" + err.message);
                    return;  //退出query方法，后面的代码不执行了；
                }
                console.log("查询数据数目条结果："+JSON.stringify(result));
                var totalCount=result;
                //=====================最好加个page页码的判断===============
                //建议在前台判断
                //parse（page)<=3 就行了；
                // if(startRow>totalCount){
                //     page=1;
                //     startRow=0;
                //     console.log("每页开始行startRow："+startRow);
                // }
                //========================================================
                // 根据页码得到相应数据；
                connection.query($sql.showGoodsByPage, [startRow,$conf.pageSize],function (err, result) {
                    if (err) {
                        console.log("错误：" + err.message);
                        return;  //退出query方法，后面的代码不执行了；
                    }
                    console.log("goods:"+JSON.stringify(result));   //结果集

                    // 输出JSON到界面
                    res.render("goods/classily.ejs", {AllGoods: result,page:page,totalCount:totalCount,pageSize:$conf.pageSize});
                    connection.release();
                });
            });

        }
    });
};

var showGoodsDetail  = function (req, res, next) {
    console.log("req.query.GoodsId:"+req.query.GoodsId);
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("错误：" + err.message);
            return;
        }
        else {
            connection.query("select * from goods where GoodsId=?",[req.query.GoodsId], function (err, result) {
                if (err) {
                    console.log("错误：" + err.message);
                    return;  //退出query方法，后面的代码不执行了；
                }
                console.log("====================");

                var arr = JSON.stringify(result);
                console.log(arr);
                console.log("result：" + result);
                // 输出JSON到界面
                res.render("goods/detail.ejs", {OneGoods: result});
                connection.release();
            });
        }
    });
}
//添加到购物车
var addCart = function (req, res, next) {
    if (!req.session.userId) {
        req.session.error = "用户已过期，请重新登录:"
        res.render("user/login.ejs", {Msg: "请登录！"});
        //res.redirect('/users/Login');
    }
    var param = req.body;
    pool.getConnection(function (err, connection) {
        connection.query("select count(*) AS COUNT from cart where UserId=? and GoodsId=?",
            [req.session.userId,param.GoodsId], function (err,rows,result1) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                else{
                    console.log("查询重复商品的结果：");
                    console.log(result1);
                    console.log(rows[0].COUNT);
                    var Count=Count;
                    if (rows[0].COUNT>0) {
                        console.log("查询到的重复商品做Number+1:");
                        connection.query("update cart set Count=Count+? where UserId=? AND GoodsId=?",
                            [param.Count,req.session.userId,param.GoodsId], function (err, result2) {
                                if (err) {
                                    console.log(err.message);
                                    return;
                                }
                                else {
                                    // 使用页面进行跳转提示
                                    if (result2.affectedRows > 0) {
                                        res.redirect("/goods/Cart");
                                        console.log("添加到购物车成功！");
                                    } else {
                                        console.log(err.message);
                                        return;
                                    }
                                }
                            });
                    }
                    else{
                        console.log("没有查询到的重复商品:");
                        if (err) {
                            console.log("错误：" + err.message);
                            return;
                        }
                        else {
                            connection.query("INSERT INTO Cart (UserId,GoodsId,Price,COUNT,GoodsName,state) VALUES(?,?,?,?,?,?)",
                                [req.session.userId,param.GoodsId,param.Price,param.Count,param.GoodsName,1], function (err, result) {
                                    if (err) {
                                        console.log("错误：" + err.message);
                                        return;  //退出query方法，后面的代码不执行了；
                                    }
                                    console.log("===========1=========");
                                    console.log(result);
                                    res.redirect("/goods/Cart");
                                    connection.release();
                                });
                        }
                    }
                }
            });
    });
};

//删除购物车单个商品
var deleteCart=function(req,res,next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }
        else {
            connection.query('delete from cart where GoodsId=? and UserId=?', [req.query.GoodsId ,req.session.userId], function (err, result, fields) {
                if (err) {
                    console.log("错误1：" + err.message);
                    return;
                }
                connection.query($sql.showCart,[req.session.userId],function (err, result, fields) {
                    if (err) {
                        console.log("错误2：" + err.message);
                        return;
                    }
                    console.log(result);
                    res.render("goods/cart.ejs", {CartGoods: result});
                    connection.release();
                });
            });
        }
    });
};
//删除购物车所有
var deleteCartAll=function(req,res,next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }
        else {
            connection.query('delete from cart where UserId=?',[req.session.userId], function (err, result, fields) {
                if (err) {
                    console.log("错误1：" + err.message);
                    return;
                }
                connection.query($sql.showCart,[req.session.userId],function (err, result, fields) {
                    if (err) {
                        console.log("错误2：" + err.message);
                        return;
                    }
                    console.log(result);
                    res.render("goods/cart.ejs", {CartGoods: result});
                    connection.release();
                });
            });
        }
    });
};
//展示购物车
var showCart  = function (req, res, next) {
    var param = req.body;
    console.log("req.session.userId:"+req.session.userId);
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("错误：" + err.message);
            return;
        }
        else {
            connection.query($sql.showCart,[req.session.userId],function (err, result) {
                if (err) {
                    console.log("错误：" + err.message);
                    return;  //退出query方法，后面的代码不执行了；
                }
                console.log("====================");

                var arr = JSON.stringify(result);
                console.log(arr);
                console.log("result：" + result);
                // 输出JSON到界面
                res.render("goods/cart.ejs", {CartGoods: result});
                connection.release();
            });
        }
    });
};
//将购物车添加到订单详细 ------------------------ 购物车结算------------------------------------
var addOrder = function (req, res, next) {
    var param = req.body;
    //var OrderTime=moment().format('YYYY-MM-DD HH:mm:ss');
    var OrderTime=moment().format('YYYY-MM-DD');
    var OrderNumber=moment().format('YYYYMMDDHHmmssHH');
    pool.getConnection(function (err, connection) {
        connection.query($sql.addOrderdetai,          //将购物车数据添到orderdetail，同时生成订单编号
            [OrderNumber,req.session.userId,param.GoodsId,param.GoodsName, param.Price, param.Count], function (err, result) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                //插入order，同时生成订单编号
                connection.query('INSERT INTO orders (OrderNumber,UserId,UserName,Tel,Address,TotalPrice,TIME,state) VALUES(?,?,?,?,?,?,?,?)',
                    [OrderNumber,req.session.userId,null,null,null,null,OrderTime,1], function (err, result) {
                        if (err) {
                            console.log(err.message);
                            return;
                        }
                        //插入后清空购物车
                        connection.query('delete from cart where UserId=? and state=1', [req.session.userId], function (err, result, fields) {
                            if (err) {
                                console.log("错误1：" + err.message);
                                return;
                            }
                            else {
                                res.redirect("/goods/Order");
                                console.log("添加到订单！");
                            }
                            connection.release();
                        });
                    });
            });
    });
};
//显示订单详细和地址
var showOrder = function (req, res, next) {
    if (!req.session.userId) {
        req.session.error = "用户已过期，请重新登录:"
        res.render("user/login.ejs", {Msg: "请登录！"});
        //res.redirect('/users/Login');
    }
    var param = req.body;
    pool.getConnection(function (err, connection) {
        connection.query($sql.showAddress,[req.session.userId],function (err, result2) {
            console.log("result2222222222：" + result2);
            if (err) {
                console.log("错误：" + err.message);
                return;  //退出query方法，后面的代码不执行了；
            }
            connection.query($sql.showorderdetai, [req.session.userId], function (err, result1) {
                if (err) {
                    console.log("错误：" + err.message);
                    return;  //退出query方法，后面的代码不执行了；
                }
                console.log("====================");
                //console.log("UserName:"+ UserName);
                //var arr = JSON.stringify(result);
                //console.log(arr);
                console.log("result1111111：" + result1);
                console.log("result2222222222：" + result2);
                // 输出JSON到界面
                res.render("goods/order.ejs", {OrderAddress:result2 ,OrderGoods: result1});
                connection.release();
            });
        });
    });
};

//------------------------------添加收货地址-------------------------------
var addAddress=function (req, res, next) {
    // 为了简单，要求同时传5个参数
    var param = req.body;
    console.log(param);
    if(param.Tel== null || param.UserName == null || param.Address == null) {
        return;
    }
    pool.getConnection(function (err, connection) {

        connection.query($sql.addAddress,
            [req.session.userId,param.UserName,param.Tel,param.Address], function (err, result) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                else {
                    res.redirect("/goods/Order");
                }
                connection.release();
            });
    });
};
//------------------------------提交订单-------------------------------
var sendOrder = function (req, res, next) {
    var param = req.body;
    console.log("UserId：" + param.UserId);
    console.log("OrderNumber：" + param.OrderNumber);
    console.log("Price：" + param.Price);
    console.log("GoodsId：" + param.GoodsId);
    console.log("Count：" + param.Count);
    console.log("Tel：" + param.Tel);
    pool.getConnection(function (err, connection) {
        //添加地址到order表
        connection.query('UPDATE orders SET UserName=?,Tel=?,Address=?,TotalPrice=1111 WHERE UserId=? and OrderNumber=?',
            [param.UserName,param.Tel,param.Address,req.session.userId,param.OrderNumber], function (err, result) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                //将orderdetai表信息state=0，意味着该订单已提交
                connection.query("UPDATE orderdetai SET state=0",function (err, result) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                         //res.render("goods/money.html")
                        res.redirect("/goods/Money");
                        console.log("订单提交！");

                    connection.release();
                });
            });
    });
};


//未完成历史订单
var userOrder2 = function (req, res) {
    var param = req.query;
//================insert==========================
    if(!req.session.userId){
        res.redirect('/users/Login');
    }
    pool.getConnection(function(err, connection) {
        connection.query($sql.userOrdersql, [req.session.userId], function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            res.render("goods/BeforeUserOrder.ejs", {UserOrder:result});
            console.log("添加到订单！");
            connection.release();
        });
    });

};
//------------------------------确认收货-------------------------------
var successOrder = function (req, res, next) {


    pool.getConnection(function (err, connection) {
        //将orders表信息state=0，意味着用户已付款
        connection.query("UPDATE orders SET state=0 where UserId=? and OrderNumber=?",
            [req.session.userId,req.query.OrderNumber],function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            else {
                res.redirect("/goods/UserOrder");


            }
            connection.release();
        });

    });
};

//已完成历史订单
var userOrder = function (req, res) {
    var param = req.query;
//================insert==========================
    if(!req.session.userId){
        res.redirect('/users/Login');
    }
    pool.getConnection(function(err, connection) {
        connection.query($sql.userOrder0, [req.session.userId], function (err, result) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                res.render("goods/userOrder.ejs", {UserOrder:result});
                console.log("添加到订单！");
                connection.release();
            });
    });

};
//个人历史订单删除
var deleteOrder=function(req,res,next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err.message);
            return;
        }
        else {
            connection.query('delete from orders where OrderNumber=? and UserId=?', [req.query.OrderNumber ,req.session.userId], function (err, result, fields) {
                if (err) {
                    console.log("错误1：" + err.message);
                    return;
                }
                connection.query('delete from orderdetai where OrderNumber=? and UserId=?', [req.query.OrderNumber ,req.session.userId], function (err, result, fields) {
                    if (err) {
                        console.log("错误1：" + err.message);
                        return;
                    }
                    res.redirect("/goods/UserOrder");
                    connection.release();
                });

            });
        }
    });
};

//商品查找
var searchGoodsByName=function (req, res, next) {
    //var id = +req.query.UserId; // 为了拼凑正确的sql语句，这里要转下整数
    var _goodsName = req.query.goodsName;

    console.log("_goodsName:"+_goodsName);
    pool.getConnection(function(err, connection) {
        connection.query("SELECT * FROM goods WHERE GoodsName LIKE CONCAT('%',?,'%')",
            [_goodsName], function(err, result) {
            res.send(JSON.stringify(result));//往页面发送JSON字符串数据；
            connection.release();
        });
    });
};


//====================sencha touch==========================
var searchGoodsByGoodsIdJSON = function (req, res) {
    var _goodsName = req.query.GoodsName;
    console.log("123")
    console.log(_goodsName)
    pool.getConnection(function (err, connection) {
        connection.query("SELECT * FROM goods WHERE GoodsName LIKE CONCAT('%',?,'%')",[_goodsName], function (err, result) {

            console.log("result:" + result);
            res.send({success:true,data:result});//往页面发送JSON字符串数据；
            connection.release();

        });
    });
};



var queryAll = function (req, res, next) {
    pool.getConnection(function (err, connection) {
        connection.query($sql.queryAll, function (err, result) {
            res.send({success: true, books: result});      //往页面发送JSON字符串数据；
            connection.release();

        });
    });
};
var queryOne = function (req, res, next) {
    var GoodsId=req.query.GoodsId;
    console.log('GoodsId:'+GoodsId);
    pool.getConnection(function (err, connection) {
        connection.query($sql.queryById1,GoodsId, function (err, result1) {
            res.json({success:true,goods:result1});      //往页面发送JSON字符串数据；
            console.log(result1);
            connection.release();

        });
    });
};
var addCart1 = function (req, res, next) {

    var param = req.body;
    console.log(" UserId :" + param.UserId);
    console.log(" GoodsId :" + param.GoodsId);
    console.log(" Price :" + param.Price);
    console.log(" Count :" + param.Count);
    console.log(" GoodsName :" + param.GoodsName);
    pool.getConnection(function (err, connection) {
        connection.query("select count(*) AS COUNT from cart where UserId=? and GoodsId=? and state=1",
            [param.UserId,param.GoodsId], function (err,rows,result1) {
                if (err) {
                    console.log(err.message);
                    res.json({"success":false});
                }
                else{
                    console.log("查询重复商品的结果：");
                    console.log(result1);
                    console.log(rows[0].COUNT);
                    var Count=Count;
                    if (rows[0].COUNT>0) {
                        console.log("查询到的重复商品做Number+1:");
                        connection.query("update cart set Count=Count+1 where UserId=? AND GoodsId=?",
                            [param.UserId,param.GoodsId,1], function (err, result2) {
                                if (err) {
                                    console.log(err.message);
                                    res.json({"success":false});
                                }
                                else {
                                    // 使用页面进行跳转提示
                                    if (result2.affectedRows > 0) {
                                        res.json({"success":true});
                                        console.log("添加到购物车成功！");
                                    } else {
                                        console.log(err.message);
                                        res.json({"success":false});
                                    }
                                }
                            });
                    }
                    else{
                        console.log("没有查询到的重复商品:");
                        if (err) {
                            console.log("错误：" + err.message);
                            res.json({"success":false});
                        }
                        else {
                            connection.query("INSERT INTO Cart (UserId,GoodsId,Price,COUNT,GoodsName,state) VALUES(?,?,?,?,?,?)",
                                [param.UserId,param.GoodsId,param.Price,param.Count,param.GoodsName,1], function (err, result) {
                                    if (err) {
                                        console.log("错误：" + err.message);
                                        res.json({"success":false});
                                    }
                                    console.log("===========1=========");
                                    console.log(result);
                                    res.json({"success":true});
                                    connection.release();
                                });
                        }
                    }
                }
            });
    });
};

var showCart1  = function (req, res, next) {
    var _userId=req.query.userId;
    console.log("222:"+_userId)

    pool.getConnection(function (err, connection) {
        connection.query($sql.showCart,[_userId],function (err, result1) {
            res.json({success:true,goods:result1});      //往页面发送JSON字符串数据；

            console.log(result1);
            connection.release();
        });
    })
}

//将购物车添加到订单详细 ------------------------ 购物车结算------------------------------------
var addOrder1 = function (req, res, next) {
    var param = req.body;
    console.log(" UserId :" + param.UserId);
    console.log(" GoodsId :" + param.GoodsId);
    console.log(" Price :" + param.Price);
    console.log(" Count :" + param.Count);
    console.log(" GoodsName :" + param.GoodsName);
    //var OrderTime=moment().format('YYYY-MM-DD HH:mm:ss');
    var OrderTime=moment().format('YYYY-MM-DD');
    var OrderNumber=moment().format('YYYYMMDDHHmmssHH');
    pool.getConnection(function (err, connection) {
        connection.query($sql.addOrderdetai,          //将购物车数据添到orderdetail，同时生成订单编号
            [OrderNumber,param.UserId,param.GoodsId,param.GoodsName, param.Price, param.Count], function (err, result) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                //插入order，同时生成订单编号
                connection.query('INSERT INTO orders (OrderNumber,UserId,UserName,Tel,Address,TotalPrice,TIME,state) VALUES(?,?,?,?,?,?,?,?)',
                    [OrderNumber,param.UserId,null,null,null,null,OrderTime,1], function (err, result) {
                        if (err) {
                            console.log(err.message);
                            return;
                        }
                        //插入后清空购物车
                        connection.query('delete from cart where UserId=? and state=1', [param.UserId], function (err, result, fields) {
                            if (err) {
                                console.log("错误1：" + err.message);
                                return;
                            }
                            else {
                                // res.redirect("/goods/Order");
                                res.json({"success":true});
                                console.log("添加到订单！");
                            }
                            connection.release();
                        });
                    });
            });
    });
};

//显示订单详细和地址
var showOrder1 = function (req, res, next) {
    var userId=req.query.userId;
    console.log(userId)
    // connection.query($sql.showAddress,[userId],function (err, result2) {
    //     console.log("result2222222222：" + result2);
    //     if (err) {
    //         console.log("错误：" + err.message);
    //         return;  //退出query方法，后面的代码不执行了；
    //     }
    pool.getConnection(function (err, connection) {
        connection.query($sql.showorderdetai, [userId], function (err, result1) {
            if (err) {
                console.log("错误：" + err.message);
                return;  //退出query方法，后面的代码不执行了；
            }
            console.log("====================");
            //console.log("UserName:"+ UserName);
            //var arr = JSON.stringify(result);
            //console.log(arr);
            res.json({success: true, goods: result1});
            console.log("result1111111：" + result1);
            // console.log("result2222222222：" + result2);
            // // 输出JSON到界面
            // res.json({success: true,OrderAddress:result2 });
            // // res.render("goods/order.ejs", {OrderAddress:result2 ,OrderGoods: result1});
            connection.release();
        });
    })
    // });
};



//------------------------------添加收货地址-------------------------------
var addAddress1=function (req, res, next) {
    // 为了简单，要求同时传5个参数
    var param = req.body;
    console.log(param);
    if(param.Tel== null || param.UserName == null || param.Address == null) {
        return;
    }
    pool.getConnection(function (err, connection) {

        connection.query($sql.addAddress,
            [param.UserId,param.UserName,param.Tel,param.Address], function (err, result) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                else {
                    res.json({"success":true});
                    // res.redirect("/goods/Order");
                }
                connection.release();
            });
    });
};

//------------------------------提交订单-------------------------------
var sendOrder1 = function (req, res, next) {
    var param = req.body;
    console.log("UserId：" + param.UserId);
    console.log("OrderNumber：" + param.OrderNumber);
    console.log("Price：" + param.Price);
    console.log("GoodsId：" + param.GoodsId);
    console.log("Count：" + param.Count);
    console.log("Tel：" + param.Tel);
    pool.getConnection(function (err, connection) {
        //添加地址到order表
        connection.query('UPDATE orders SET UserName=?,Tel=?,Address=?,TotalPrice=1111 WHERE UserId=? and OrderNumber=?',
            ['哈哈',18016671309,'按时大大',param.UserId,param.OrderNumber], function (err, result) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                //将orderdetai表信息state=0，意味着该订单已提交
                connection.query("UPDATE orderdetai SET state=0",function (err, result) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    //res.render("goods/money.html")
                    // res.redirect("/goods/Money");
                    console.log("订单提交！");
                    res.json({"success":true});
                    connection.release();
                });
            });
    });
};


//个人历史订单
var userOrder1 = function (req, res) {
    var param = req.query;
//================insert==========================
    console.log(param.userId)
    pool.getConnection(function(err, connection) {
        connection.query($sql.userOrder, [param.userId], function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            res.json({success: true,UserOrder:result});
            console.log("添加到订单！");
            connection.release();
        });
    });
};

exports.deleteOrder = deleteOrder;
exports.userOrder2 = userOrder2;
exports.userOrder = userOrder;
exports.successOrder = successOrder;
exports.sendOrder = sendOrder;
exports.addAddress = addAddress;
exports.showOrder = showOrder;
exports.addOrder = addOrder;
exports.addCart = addCart;
exports.showCart = showCart;
exports.deleteCartAll = deleteCartAll;
exports.deleteCart = deleteCart;
exports.showGoodsByPage = showGoodsByPage;
exports.showGoodsDetail= showGoodsDetail;
//exports.queryAll = queryAll;
exports.searchGoodsByName = searchGoodsByName;


//====================sencha touch==========================
exports.searchGoodsByGoodsIdJSON = searchGoodsByGoodsIdJSON;

exports.queryOne = queryOne;
exports.queryAll = queryAll;

exports.showCart1 = showCart1;
exports.addCart1 = addCart1;

exports.addOrder1 = addOrder1;

exports.showOrder1 = showOrder1;

exports.sendOrder1 = sendOrder1;
exports.addAddress1 = addAddress1;
exports.userOrder1 = userOrder1;