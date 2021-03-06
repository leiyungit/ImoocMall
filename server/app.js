var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));

//app.engine('.html',require(ejs).renderFile);
// 上一行是视频教程代码，可能是nodejs版本问题，抛异常 https://www.expressjs.com.cn/4x/api.html
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 全局拦截
app.use(function(req,res,next){
    if(req.cookies.userId){
      next();
    }else{
      if(req.originalUrl == "/users/login" || req.originalUrl == "/users/logout" || req.path == '/goods'){
        next();
      }else{
        res.json({
          status:100,
          msg:'未登录',
          result:''
        });
      }
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods',goodsRouter);

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
  res.status(err.status || 5000);
  res.render('error');
});

module.exports = app;
