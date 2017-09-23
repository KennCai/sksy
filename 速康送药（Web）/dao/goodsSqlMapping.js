/**
 * Created by ybgong on 2016/9/1.
 */

var goods = {
    getTotalCount:'select count(*) TotalCount from goods',//查询总共有多少条数据
    showGoodsByPage: 'select * from goods limit ?,?',
    queryAll: 'select * from goods',
    queryBy:'select UserId,GoodsId,GoodsName,Price,COUNT(Count) from cart where UserId=? GROUP BY GoodsId',
    showCart:'SELECT cart.*,goods.Pic FROM cart,goods WHERE UserId=? AND cart.GoodsId=goods.GoodsId',
    addOrderdetai:'INSERT INTO orderdetai (OrderNumber,GoodsId,GoodsName,Price,COUNT,UserId)  SELECT ?,GoodsId,GoodsName,Price,COUNT,UserId FROM cart WHERE  UserId=? and state=1',
    showorderdetai:'SELECT orderdetai.*,goods.Pic FROM orderdetai,goods WHERE UserId=? and state=1 and orderdetai.GoodsId=goods.GoodsId',
    showAddress:'select * from useraddress where UserId=?',
    addAddress:'INSERT INTO useraddress (UserId,UserName,Tel,Address,state) VALUES(?,?,?,?,1)',
    userOrder0:'SELECT orders.*,orderdetai.*,goods.* FROM (orders LEFT JOIN orderdetai ON orders.OrderNumber=orderdetai.OrderNumber) LEFT JOIN goods ON orderdetai.GoodsId=goods.GoodsId WHERE orders.UserId=? AND orders.OrderNumber=orderdetai.OrderNumber and orders.state=0 and orderdetai.state=0',
    userOrdersql:'SELECT orders.*,orderdetai.*,goods.* FROM (orders LEFT JOIN orderdetai ON orders.OrderNumber=orderdetai.OrderNumber) LEFT JOIN goods ON orderdetai.GoodsId=goods.GoodsId WHERE orders.UserId=? AND orders.OrderNumber=orderdetai.OrderNumber and orders.state=1 and orderdetai.state=0',
    userOrder:'SELECT orders.*,orderdetai.*,goods.* FROM (orders LEFT JOIN orderdetai ON orders.OrderNumber=orderdetai.OrderNumber) LEFT JOIN goods ON orderdetai.GoodsId=goods.GoodsId WHERE orders.UserId=? AND orders.OrderNumber=orderdetai.OrderNumber and orders.state=1 ',
//sencha
    queryById: 'SELECT * FROM goods WHERE GoodsName LIKE CONCAT('%',?,'%') ',
    queryById1: 'select * from goods where GoodsId=?',
};
module.exports = goods;