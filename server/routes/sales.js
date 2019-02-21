// 出货
const express = require('express');
const router = express.Router();
const connection = require('./connect')

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


//出库的路由
router.post('/come', (req, res) => {
  // 接收前端发送的入库的数据
  let { goodsname, ordernum, barcode, number, price, totalPrice,saleTotalPrice } = req.body;

  // 把数据存入数据库
  // 构造sql语句
  const sqlStr = `insert into come(goodsname,ordernum, barcode, number, price, totalPrice,saleTotalPrice) 
  values('${goodsname}','${ordernum}', '${barcode}', '${number}' ,'${price}','${totalPrice}','${saleTotalPrice}')`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 判断受影响的行数
    if (data.affectedRows > 0) {
      // 如果大于0 代表插入成功 那么就给前端返回成功的数据对象
      res.send({ "error_code": 0, "reason": "商品出库成功" });
    } else {
      // 失败：返回给前端失败的数据对象
      res.send({ "error_code": 1, "reason": "商品出库失败" });
    }
  })
})

// 显示出库商品的路由
router.get('/comeList', (req, res) => {
  // 查询所有账号数据(按照时间排序)
  // 构造sql语句（查询所有数据且按照时间排序）
  const sqlStr = 'select * from come order by ctime desc';
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 把查询到的数据响应给前端（是一个数组）
    res.send(data);
  })
})

/* 
按分页显示商品列表的路由 /stocklistbypage
*/
router.get('/saleslistbypage', (req, res) => {
  //接收前端发过来的数据
  let { pageSize, currentPage, keyword } = req.query;
  //console.log(pageSize,currentPage);
  //默认值
  pageSize = pageSize ? pageSize : 5;
  currentPage = currentPage ? currentPage : 1;

  //构造sql语句(查询所有数据)
  let sqlStr = `select * from come where 1 = 1`;
  //执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    //计算数据总条数
    let total = data.length;
    //console.log(total);

    // 如果关键字不为空 就要拼接关键字查询条件
    if (keyword !== "") {
      sqlStr += ` and (goodsname like "%${keyword}%" or ordernum like "%${keyword}%")`
    }

    // 再次按照 查询的条件查询数据 重新计算数据的总条数
    connection.query(sqlStr, (err, data) => {
      if (err) throw err;
      total = data.length;
    })

    // 拼接排序
    sqlStr += ` order by ctime desc`;
    //console.log(total);
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


/* 
  按分页显示商品列表的路由
*/
router.get('/saleslistbypage', (req, res) => {
  // 接收前端参数
  let { pageSize, currentPage } = req.query;
  // 默认值
  pageSize = pageSize ? pageSize : 3;
  currentPage = currentPage ? currentPage : 1

  // 构造sql语句 （查询所有数据 按照时间排序）
  let sqlStr = `select * from come order by ctime desc`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 计算数据总条数
    let total = data.length;

    // 分页条件 (跳过多少条)
    let n = (currentPage - 1) * pageSize;
    // 拼接分页的sql语句
    sqlStr += ` limit ${n}, ${pageSize}`;

    // 执行sql语句 （查询对应页码的数据）
    connection.query(sqlStr, (err, data) => {
      if (err) throw err;
      // 把数据返回给前端 两个数据 数据总条数 total 和 对应页码的数据 data
      res.send({
        total,
        data
      })
    })
  })
})

/* 
  删除商品请求的路由
*/
router.get('/salesdel', (req, res) => {
  // 接收id
  let { id } = req.query;
  // 根据id 执行删除
  // 构造删除数据的sql语句
  const sqlStr = `delete from come where id = ${id}`;
  // 执行sql语句
  console.log(sqlStr);

  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 根据删除结果判断
    if (data.affectedRows > 0) {
      // 如果受影响行数大于0 删除成功 返回成功的数据对象给前端
      res.send({ "error_code": 0, "reason": "删除账号成功" });
    } else {
      // 否则删除失败 返回失败的数据对象给前端
      res.send({ "error_code": 1, "reason": "删除账号失败" });
    }
  })
})

/* 
  接收修改-数据回填请求
*/
router.get('/salesedit', (req, res) => {
  // 接收id 
  let { id } = req.query;
  // 构造sql
  const sqlStr = `select * from come where id = ${id}`;
  // 执行sql 
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 把查询的数据返回给前端
    res.send(data);
  })
})

/* 
  接收修改-保存修改后数据的请
*/
router.post('/saleseditsave', (req, res) => {
  // 接收修改后的新数据 和 原来的id
  let { ordernum, goodsname, number, price, saleTotalPrice, refund, editId } = req.body;
  // 构造sql
  const sqlStr = `update come set ordernum='${ordernum}', goodsname='${goodsname}', number='${number}', price='${price}', saleTotalPrice='${saleTotalPrice}', refund='${refund}' where id=${editId}`;
  // 执行sql
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 受影响行数大于0 就是修改成功
    if (data.affectedRows > 0) {
      // 返回成功的数据对象给前端
      res.send({ "error_code": 0, "reason": "修改账号成功" });
    } else {
      // 返回失败的数据对象给前端
      res.send({ "error_code": 1, "reason": "修改账号失败" });
    }
  })
})

/* 
  接收批量删除的路由
*/
router.get('/batchdelete', (req, res) => {
  // 接收前端发送过来的 需要删除的id 数一个数组
  let { selectedId } = req.query;
  // 构造sql语句
  const sqlStr = `delete from come where id in (${selectedId})`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 根据删除结果判断 成功就返回成功的数据对象 否则 就返回失败的数据对象
    if (data.affectedRows > 0) {
      res.send({ "error_code": 0, "reason": "批量删除成功" })
    } else {
      res.send({ "error_code": 1, "reason": "批量删除失败" })
    }
  })
})



// 退货的路由
router.get('/sales001', (req, res) => {
  // 接收id 
  let { ordernum } = req.query;
  // 构造sql
  const sqlStr = `select * from come where ordernum = ${ordernum}`;
  // 执行sql 
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 把查询的数据返回给前端
    res.send(data);
  })

})

/* 
  接收修改-保存修改后数据的请求
*/
router.post('/sales002', (req, res) => {
  // 接收修改后的新数据 和 原来的id
  let { ordernum, goodsname, number, price, saleTotalPrice, refund } = req.body;
  // 构造sql
  const sqlStr = `update come set goodsname='${goodsname}', number='${number}', price='${price}', saleTotalPrice='${saleTotalPrice}', refund='${refund}' where ordernum='${ordernum}'`;
  
  // 执行sql
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 受影响行数大于0 就是修改成功
    if (data.affectedRows > 0) {
      // 返回成功的数据对象给前端
      res.send({ "error_code": 0, "reason": "商品退货成功" });
    } else {
      // 返回失败的数据对象给前端
      res.send({ "error_code": 1, "reason": "商品退货失败" });
    }
  })
})
module.exports = router;
