var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//引入子路由
var accountRouter = require('./routes/account');
var memberRouter = require('./routes/member');
var goodsRouter = require('./routes/goods');
var loginRouter = require('./routes/login');
var stockRouter = require('./routes/stock');
var salesRouter = require('./routes/sales');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//分配路由
app.use('/account', accountRouter);
app.use('/member', memberRouter);
app.use('/goods', goodsRouter);
app.use('/login', loginRouter);
app.use('/stock', stockRouter);
app.use('/sales', salesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//监听端口
app.listen(999,() => {
  console.log('后端服务器启动成功，地址是: http://172.16.9.46:999')
})
module.exports = app;
