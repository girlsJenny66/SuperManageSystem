// 进货模块
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

/* 
  入库的路由 /stockadd
*/
router.post('/stockadd', (req, res) => {
  // 接收前端发送的入库的数据
  let { barcode, goodsname, categories, productAdd, warehousing, inventory, sold } = req.body;

  // 把数据存入数据库
  // 构造sql语句
  const sqlStr = `insert into stock(barcode, goodsname, categories, productAdd, warehousing, inventory, sold) values('${barcode}', '${goodsname}', '${categories}','${productAdd}' ,'${warehousing}', '${inventory}', '${sold}')`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 判断受影响的行数
    if (data.affectedRows > 0) {
      // 如果大于0 代表插入成功 那么就给前端返回成功的数据对象
      res.send({ "error_code": 0, "reason": "商品入库成功" });
    } else {
      // 失败：返回给前端失败的数据对象
      res.send({ "error_code": 1, "reason": "商品入库失败" });
    }
  })
})

/* 

* 
  按分页显示商品列表的路由 /stocklistbypage
*/
router.get('/stocklistbypage', (req, res) => {
  //接收前端发过来的数据
  let { pageSize, currentPage, categories, keyword } = req.query;
  
  //console.log(pageSize,currentPage);
  //默认值
  pageSize = pageSize ? pageSize : 5;
  currentPage = currentPage ? currentPage : 1;

  //构造sql语句(查询所有数据)
  let sqlStr = `select * from stock where 1 = 1`;
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


/* 
  按分页显示商品列表的路由
*/
router.get('/stocklistbypage', (req, res) => {
  // 接收前端参数
  let { pageSize, currentPage } = req.query;
  // 默认值
  pageSize = pageSize ? pageSize : 3;
  currentPage = currentPage ? currentPage : 1

  // 构造sql语句 （查询所有数据 按照时间排序）
  let sqlStr = `select * from stock order by ctime desc`;
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
router.get('/stockdel', (req, res) => {
  // 接收id
  let { id } = req.query;
  // 根据id 执行删除
  // 构造删除数据的sql语句
  const sqlStr = `delete from stock where id = ${id}`;
  // 执行sql语句
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
router.get('/stockedit', (req, res) => {
  // 接收id 
  let { id } = req.query;
  // 构造sql
  const sqlStr = `select * from stock where id = ${id}`;
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
router.post('/stockeditsave', (req, res) => {
  // 接收修改后的新数据 和 原来的id
  let { barcode, goodsname, categories, productAdd, warehousing, inventory, sold, editId } = req.body;
  // 构造sql
  const sqlStr = `update stock set barcode='${barcode}', goodsname='${goodsname}', categories='${categories}',productAdd='${productAdd}', warehousing='${warehousing}', inventory='${inventory}', sold='${sold}' where id=${editId}`;
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
  const sqlStr = `delete from stock where id in (${selectedId})`;
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

module.exports = router;


