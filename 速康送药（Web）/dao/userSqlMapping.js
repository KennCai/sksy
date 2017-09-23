//定义 了一个实体user对象，对象里有6个变量；6个sql语句用来操作数据库
var user = {
   
    insert2:'INSERT INTO user(UserId,UserPassword,Pic) VALUES(?,?,?)',
    queryByIdAndPwd: 'select * from user where UserId=? and UserPassword=?',
    queryGoods: 'select * from goods',
    insert:'INSERT INTO user(UserId,UserPassword , UserName, Gender,Birthday) VALUES(?,?,?,?,?)',
    update:'select * from goods where GoodsId=?',
    update1:'update goods set GoodsName=?,Price=?,Pic=? where GoodsId=?',

    delete: 'delete from user where UserId=?',
    queryById: 'select * from user where UserId=?',
    queryAll: 'select * from user',
    insert1:'INSERT INTO goods(GoodsId,GoodsName,Price,Pic) VALUES(?,?,?,?)',
    queryAll2: 'select * from goods',
    delete1: 'delete from goods where GoodsId=?',
    queryAllInfo:'select * from information',
    insert3:'INSERT INTO information(Title,Writer,Icontent,InfoTime) VALUES(?,?,?,?)'

};
module.exports = user;