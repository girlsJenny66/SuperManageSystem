const express = require('express');
const router = express.Router();

//引入连接数据库模块
const connection = require('./connect');

// 引入express-jwt 用于验证token
const expressJwt = require('express-jwt');
//引入jwt
const jwt = require('jsonwebtoken');
//定义秘钥
const secretKey = 'pwdkey';

// 统一设置响应头 解决跨域问题
router.all('*', (req, res, next) => {
    // 设置响应头 解决跨域(目前最主流的方式)
    res.header('Access-Control-Allow-Origin', '*');
    // 允许的请求头
    res.header("Access-Control-Allow-Headers", "authorization");
    next();
})

// 使用模块 express-jwt 验证token
router.use(expressJwt({
    secret: secretKey
}).unless({
    path: ['/login/checklogin', '/login/upload']  // 不需要验证token的地址
}));

//拦截器
router.use((err, req, res, next) => {
    //当token验证失败时会抛出如下错误
    if (err.name === 'UnauthorizedError') {
        //这个需要根据自己的业务逻辑来处理
        res.status(401).send('token无效,未授权...');
    }
});

//接收验证账号和密码是否存在的路由
router.post('/checklogin', (req, res) => {
    //接收前端发过来的数据
    let { username, password } = req.body;
    //构造sql语句
    const sqlStr = `select * from account where username='${username}' and password='${password}'`;
    //执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        //判断
        if (data.length) {
            //当前登录的账号数据
            let obj = data[0];
            //转为字符串
            let objStr = JSON.stringify(obj);
            //生成一个新对象
            let newObj = JSON.parse(objStr);
            //生成token
            const token = jwt.sign(newObj, secretKey, { expiresIn: 60 * 60 });
            res.send({ "error_code": 0, "reason": "恭喜你！登录成功", token, "username": newObj.username });
        } else {
            res.send({ "error_code": 1, "reason": "请检查你的账号或密码" });
        }
    })
})




module.exports = router;