let express = require('express');
let router = express.Router();
let User=require('../models/users');


/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  User.find().then(user => {
    if (!user) {
        return res.status(404).json("没有任何内容")
    }
      res.json(user);
  }).catch(err => res.status(404).json(err));
});

router.post('/login', function(req, res, next) {
  let param={
    name:req.body.userName,
    password:req.body.userPwd,
  }
  User.findOne(param, function(err,doc){
    if(err){
      res.json({
        status:500,
        msg:err.message
      });
    }else{
      if(doc){
        res.json({
          status:200,
          msg:'',
          result:{
            username:doc.name
          }
        });
      }else{
        res.json({
          status:400,
          msg:'用户名密码错误',
        });
      }
    }
  });
});


module.exports = router;
