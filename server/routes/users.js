let express = require('express');
let router = express.Router();
let User = require('../models/users');


/* GET users listing. */
router.get('/', function (req, res, next) {
  //res.send('respond with a resource');
  User.find().then(user => {
    if (!user) {
      return res.status(404).json("没有任何内容")
    }
    res.json(user);
  }).catch(err => res.status(404).json(err));
});

// 登录
router.post('/login', function (req, res, next) {
  let param = {
    name: req.body.userName,
    password: req.body.userPwd,
  }
  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: 500,
        msg: err.message
      });
    } else {
      if (doc) {
        res.cookie('userId', doc._id, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie('userName', doc.name, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.json({
          status: 200,
          msg: '',
          result: {
            username: doc.name
          }
        });
      } else {
        res.json({
          status: 400,
          msg: '用户名密码错误',
        });
      }
    }
  });
});
// 登出
router.post('/logout', function (req, res, next) {
  res.clearCookie('userId');
  // res.cookie('userId','',{
  //   path:'/',
  //   maxAge:-1
  // });
  res.json({
    status: 200,
    msg: '',
    result: ''
  });
});

router.get('/checkLogin',function(req,res,next){
  if(req.cookies.userName){
    res.json({
      status:200,
      msg:'',
      result:req.cookies.userName || ''
    });
  }else{
    res.json({
      status:200,
      msg:'未登录',
      result:''
    });
  }
});

module.exports = router;
