const express = require('express');
const router = express.Router();

//引入连接数据库模块
const connection = require('./connect');

// 统一设置响应头 解决跨域问题
router.all('*', (req, res, next) => {
  // 设置响应头,解决跨域
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

//添加账号的路由
router.post('/accountadd' , (req, res) => {
  //接收前端发送的添加账号的数据
  let{ username,password,usergroup } = req.body;
  //console.log('接收到前端发送过来的数据：', username, password, usergroup);
  
  //把数据存入数据库
  //构造添加账号的sql语句
  const sqlStr = `insert into account(username,password,usergroup) values('${username}','${password}','${usergroup}')`;
  //执行sql语句
  connection.query(sqlStr, (err,data) => {
    if (err) throw err;
    //判断受影响的行数
    if(data.affectedRows > 0){
      //如果大于0 代表添加成功 那么就给前端返回成功的数据对象
      res.send({"error_code": 0, "reason":"添加数据成功"});
    } else{
      //失败：返回给前端失败的数据对象
      res.send({"error_code":1, "reason":"添加数据失败"});
    }
  })
})

//显示账号列表的路由
// router.get('/accountlist', (req, res) => {
//   //查询所有账号数据
//   //构造查询所有账号数据的sql语句
//   const sqlStr = 'select * from account order by ctime desc';
//   //执行sql语句
//   connection.query(sqlStr,(err,data) => {
//     if(err) throw err;
//     //把查询到的数据响应给前端
//     res.send(data);
//   })
// })

//按照分页显示账号列表的路由
router.get('/accountlistbypage',(req,res) => {
  //接收前端发过来的数据
  let { pageSize,currentPage } = req.query;
  //console.log(pageSize,currentPage);
  //默认值
  pageSize = pageSize?pageSize:5;
  currentPage = currentPage?currentPage:1;
  
  //构造sql语句(查询所有数据)
  let sqlStr = `select * from account order by ctime desc`;
  //执行sql语句
  connection.query(sqlStr,(err,data) => {
    if (err) throw err;
    //计算数据总条数
    let total = data.length;
    //console.log(total);
    //分页条件（跳过多少条）
    let n = (currentPage - 1) * pageSize;
    //拼接分页的sql语句
    sqlStr += ` limit ${n}, ${pageSize}`;
    //console.log(sqlStr);
    //执行sql语句
    connection.query(sqlStr,(err,data) => {
      if(err) throw err;
      //把数据返回给前端, 两个数据：数据总条数total和对应页码的数据data
      res.send({
        total,
        data
      })
    })
  })
})

//删除账号请求的路由
router.get('/accountdel',(req,res)=>{
  //接收id
  let id = req.query.id;
  //根据接收到的id，删除对应的数据
  //构造删除数据的sql语句
  const sqlStr = `delete from account where id=${id}`;
  //console.log(sqlStr);
  //执行sql语句
  connection.query(sqlStr,(err,data) => {
    if(err) throw err;
    //判断受影响的行数
    if(data.affectedRows > 0){
      res.send({"error_code": 0, "reason":"删除数据成功"});
    }else{
      res.send({"error_code": 1, "reason":"删除数据失败"});
    }
  })
})

//接收修改，数据回填请求
router.get('/accountedit',(req,res) => {
  //接收id
  let id = req.query.id;
  //构造查询数据库的sql语句
  const sqlStr = `select * from account where id=${id}`;
  //执行sql语句
  connection.query(sqlStr,(err,data) => {
    if(err) throw err;
    //把查询的数据返回给前端
    res.send(data);
  })
})

//接收修改,保存修改后数据的请求
router.post('/accounteditsave',(req,res) => {
  //接收修改后的新数据和原来的id
  let {username,usergroup,editid} = req.body;
  //构造sql语句
  const sqlStr = `update account set username='${username}',usergroup='${usergroup}' where id=${editid}`;
  //执行sql语句
  connection.query(sqlStr,(err,data) => {
    if(err) throw err;
    if (data.affectedRows > 0) {
      //返回成功的数据对象给前端
      res.send({"error_code": 0, "reason":"修改账号成功"});
    } else {
      //返回失败的数据对象给前端
      res.send({"error_code": 1, "reason":"修改账号失败"});
    }
  })
})

//接收批量删除的请求
router.get('/batchdelete',(req,res) => {
  //接收要删除账号的id
  let delId = req.query.id;
  //构造sql语句
  const sqlStr = `delete from account where id in (${delId})`;
  //console.log(sqlStr);
  
  //执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;  
    // 根据删除结果判断
    if (data.affectedRows > 0) {
      res.send({"error_code": 0, "reason":"批量删除成功"})
    } else {
      res.send({"error_code": 1, "reason":"批量删除失败"})
    }
  })
})

//接收验证原密码的请求
router.get('/checkoldpwd',(req,res) => {
  let { username,oldPwd } = req.query;
  //构造sql
  const sqlStr = `select * from account where username='${username}' and password='${oldPwd}'`;
  //执行sql
  connection.query(sqlStr,(err,data) => {
    if (err) throw err;
    if(data.length){
      res.send({"error_code": 0, "reason":"原密码正确"})
    }else{
      res.send({"error_code": 1, "reason":"原密码错误"})
    }
  })
})

//接收保存修改的新密码的请求
router.post('/saveeditnewpwd',(req,res) => {
  let{username,oldPwd,newPwd} = req.body;
  //创建sql
  const sqlStr = `update account set password='${newPwd}' where username='${username}' and password='${oldPwd}'`;
  //执行sql
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    if(data.affectedRows>0){
      res.send({"error_code": 0, "reason":"修改密码成功"})
    }else{
      res.send({"error_code": 1, "reason":"修改密码失败"})
    }
  })
})

module.exports = router;
