var express = require('express');
var goodsDao = require('./../dao/goodsDao');
var router = express.Router();
var sessionFilter = require('./../myutil/sessionFilter');
var multipart = require('connect-multiparty');


//===================================Classily===================================
//===================================所有物品===================================
router.get('/AllGoods', function(req, res, next) {
    goodsDao.showGoodsByPage(req, res);
});
router.get('/GoodsDetail', function(req, res, next) {
    goodsDao.showGoodsDetail(req, res);
});

//========================================Cart购物车=====================================
router.post('/Cart', function (req, res, next) {
    console.log('postCart');
    goodsDao.addCart(req, res, next);

});
router.get('/Cart', function (req, res, next) {
    console.log('getCart');
    goodsDao.showCart(req, res, next);
});


router.get('/DeleteCart', function (req, res,next) {
    console.log('DeleteCart');
    goodsDao.deleteCart(req, res,next);
});

router.get('/DeleteCartAll', function (req, res,next) {
    console.log('DeleteCartAll');
    goodsDao.deleteCartAll(req, res,next);
});


//========================================结算=====================================
router.post('/Order', function (req, res, next) {
    console.log('postOrder');
    goodsDao.addOrder(req, res, next);
});

router.get('/Order', function (req, res, next) {
    console.log('getOrder');
    goodsDao.showOrder(req, res, next);

});
//========================================提交订单=====================================
router.post('/sendOrder', function (req, res, next) {
    console.log('sendOrder');
    goodsDao.sendOrder(req, res, next);
});
router.get('/Money', function(req, res, next) {
    res.render("goods/money.html");
});
//========================================添加地址=====================================
router.get('/AddAddress', function(req, res, next) {
    res.render("goods/addAddress.ejs");
});
router.post('/address', function (req, res, next) {
    console.log('address');
    goodsDao.addAddress(req, res, next);
});
//========================================付款=====================================

router.get('/Success', function (req, res, next) {
    console.log('Success');
   res.render("goods/success.ejs")
});

//========================================未完成历史订单=====================================

router.get('/UserOrder2', function (req, res, next) {

    goodsDao.userOrder2(req, res, next);
});

//========================================确认收货===================================
router.get('/SuccessOrder', function (req, res, next) {
    console.log('SuccessOrder');
    goodsDao.successOrder(req, res, next);
});


//========================================已完成历史订单=====================================

router.get('/UserOrder', function (req, res, next) {
    console.log('postUserOrder');
    goodsDao.userOrder(req, res, next);
});
router.get('/DeleteOrder', function (req, res,next) {
    console.log('DeleteOrder');
    goodsDao.deleteOrder(req, res,next);
});


//商品查询
router.get('/searchGood', function(req, res, next) {
    console.log('查询user:gooodsByname');
    //res.send('查询user:queryByGender');
    res.render("goods/searchGood.html");
});

router.get('/SearchGoodsByName', function(req, res, next) {
    console.log('SearchGoodsByName');
    goodsDao.searchGoodsByName(req, res, next);
});

//router.get('/order', function(req, res, next) {
//    console.log('查询user:gooodsByname');
//    //res.send('查询user:queryByGender');
//    res.render("goods/order.ejs");
//});


//sencha

router.get('/searchGoodsByGoodsIdJSON', function (req, res, next) {
    console.log('searchGoodsByGoodsIdJSON');
    goodsDao.searchGoodsByGoodsIdJSON(req, res, next);
});

router.get('/QueryAll', function (req, res, next) {
    console.log('QueryAll');
    goodsDao.queryAll(req, res, next);

});


router.get('/QueryOne' , function (req, res, next) {
    console.log('QueryOne');
    goodsDao.queryOne(req, res, next);
});

router.get('/QueryCart', function (req, res, next) {
    console.log('QueryCart');
    goodsDao.showCart1(req, res, next);

});
router.post('/addCart', function (req, res, next) {
    console.log('addCart');
    goodsDao.addCart1(req, res, next);

});

router.post('/addOrder', function (req, res, next) {
    console.log('addOrder');
    goodsDao. addOrder1(req, res, next);

});

router.get('/Order1', function (req, res, next) {
    console.log('Order1');
    goodsDao.showOrder1(req, res, next);

});
router.post('/address1', function (req, res, next) {
    console.log('address');
    goodsDao.addAddress1(req, res, next);
});
//========================================提交订单=====================================
router.post('/SubOrder', function (req, res, next) {
    console.log('SubOrder');
    goodsDao.sendOrder1(req, res, next);
});

router.get('/UserOrder1', function (req, res, next) {
    console.log('postUserOrder');
    goodsDao.userOrder1(req, res, next);
});
module.exports = router;