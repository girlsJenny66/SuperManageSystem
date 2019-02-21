const express = require('express');
const router = express.Router();

//引入连接数据库模块
const connection = require('./connect');

// 引入jwt
const jwt = require('jsonwebtoken');
// 引入express-jwt 用于验证token
const expressJwt = require('express-jwt');
//定义秘钥
const secretKey = 'pwdkey';

// 统一设置响应头 解决跨域问题
router.all('*', (req, res, next) => {
    // 设置响应头,解决跨域
    res.header('Access-Control-Allow-Origin', '*');
    //允许的请求头
    res.header("Access-Control-Allow-Headers", "authorization");
    next();
})

// 使用模块 express-jwt 验证token
router.use(expressJwt({
    secret: secretKey
}));

//拦截器
router.use((err, req, res, next) => {
    //当token验证失败时会抛出如下错误
    if (err.name === 'UnauthorizedError') {
        //这个需要根据自己的业务逻辑来处理
        res.status(401).send('token无效...');
    }
});

//接收添加商品的路由
router.post('/goodsadd', (req, res) => {
    //接收前端发过来的数据
    let { categories, barcode, goodsname, purchaseprice, price, salesprice, marketprice, stocknum, salenum, goodsUnit, memberDiscount, sales, goodsDesc } = req.body;
    let totalinven = purchaseprice * stocknum;
    let totalsales = price * salenum;
    //把数据存入数据库
    //构造sql语句
    const sqlStr = `insert into goods(categories,barcode,goodsname,purchaseprice,price,salesprice,marketprice,stocknum,salenum,goodsUnit,memberDiscount,sales,goodsDesc,totalinven,totalsales) 
    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    //参数
    const sqlParams = [categories, barcode, goodsname, purchaseprice, price, salesprice, marketprice, stocknum, salenum, goodsUnit, memberDiscount, sales, goodsDesc, totalinven, totalsales];
    //执行sql语句
    connection.query(sqlStr, sqlParams, (err, data) => {
        if (err) throw err;
        //判断受影响的行数
        if (data.affectedRows > 0) {
            //如果大于0 代表添加成功 那么就给前端返回成功的数据对象
            res.send({ "error_code": 0, "reason": "添加数据成功" });
        } else {
            //失败：返回给前端失败的数据对象
            res.send({ "error_code": 1, "reason": "添加数据失败" });
        }
    })
})

//按照分页显示账号列表的路由
router.get('/goodslistbypage', (req, res) => {
    //接收前端发过来的数据
    let { pageSize, currentPage,categories,keyword } = req.query;
    //console.log(pageSize,currentPage);
    //默认值
    pageSize = pageSize ? pageSize : 5;
    currentPage = currentPage ? currentPage : 1;

    //构造sql语句(查询所有数据)
    let sqlStr = `select * from goods where 1 = 1`;
    //执行sql语句
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        //计算数据总条数
        let total = data.length;
        //console.log(total);

        // 分类名不为空 且 全部 那么 就拼接分类条件
        if (categories !== "" && categories !== "全部") {
            sqlStr += ` and categories='${categories}'`;
        }
    
        // 如果关键字不为空 就要拼接关键字查询条件
        if (keyword !== "") {
            sqlStr += ` and (goodsname like "%${keyword}%" or barcode like "%${keyword}%")`
        }

        // 再次按照 查询的条件查询数据 重新计算数据的总条数
        connection.query(sqlStr, (err, data) => {
            if (err) throw err;
            total = data.length;
        })
    
        // 拼接排序
        sqlStr += ` order by ctime desc`;

        //分页条件（跳过多少条）
        let n = (currentPage - 1) * pageSize;
        //拼接分页的sql语句
        sqlStr += ` limit ${n}, ${pageSize}`;
        //console.log(sqlStr);
        //执行sql语句
        connection.query(sqlStr, (err, data) => {
            if (err) throw err;
            //把数据返回给前端, 两个数据：数据总条数total和对应页码的数据data
            res.send({
                total,
                data
            })
        })
    })
})

//删除会员数据的路由
router.get('/goodsdel', (req, res) => {
    let id = req.query.id;
    //构造sql
    const sqlStr = `delete from goods where id=${id}`;
    //执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ "error_code": 0, "reason": "删除数据成功" })
        } else {
            res.send({ "error_code": 1, "reason": "删除数据失败" })
        }
    })
})

//修改会员数据的路由
router.get('/goodsedit', (req, res) => {
    //接收id
    let id = req.query.id;
    //构造查询数据库的sql语句
    const sqlStr = `select * from goods where id=${id}`;
    //执行sql语句
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        //把查询的数据返回给前端
        res.send(data);
    })
})

//保存修改会员数据的路由
router.post('/goodseditsave', (req, res) => {
    //接收修改后的新数据和原来的id
    let { barcode, goodsname, categories, price, salesprice, marketprice, stocknum, totalinven, totalsales, editid } = req.body;
    //构造sql语句
    const sqlStr = `update goods set barcode='${barcode}',goodsname='${goodsname}',categories='${categories}'
    ,price='${price}',salesprice='${salesprice}',marketprice='${marketprice}',stocknum='${stocknum}',
    totalinven='${totalinven}',totalsales='${totalsales}' where id=${editid}`;
    //执行sql语句
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            //返回成功的数据对象给前端
            res.send({ "error_code": 0, "reason": "修改账号成功" });
        } else {
            //返回失败的数据对象给前端
            res.send({ "error_code": 1, "reason": "修改账号失败" });
        }
    })
})

//接收批量删除的请求
router.get('/batchdelete', (req, res) => {
    //接收要删除账号的id
    let delId = req.query.id;
    //构造sql语句
    const sqlStr = `delete from goods where id in (${delId})`;
    //执行sql语句
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        // 根据删除结果判断
        if (data.affectedRows > 0) {
            res.send({ "error_code": 0, "reason": "批量删除成功" })
        } else {
            res.send({ "error_code": 1, "reason": "批量删除失败" })
        }
    })
})

// 商品查询
router.post('/search', (req, res) => {
    // 接收参数
    let { categories, keyword } = req.body;
    console.log(categories, keyword);
    

    // 构造sql
    let sqlStr = `select * from goods where 1 = 1`;

    // 分类名不为空 且 全部 那么 就拼接分类条件
    if (categories !== "" && categories !== "全部") {
        sqlStr += ` and categories='${categories}'`;
    }

    // 如果关键字不为空 就要拼接关键字查询条件
    if (keyword !== "") {
        sqlStr += ` and (goodsname like "%${keyword}%" or barcode like "%${keyword}%")`
    }

    // 执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        res.send(data);
    })

})




module.exports = router;