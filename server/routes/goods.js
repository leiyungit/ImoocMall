var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');


mongoose.connect("mongodb://localhost:27017/imoocmall");
// 连接成功
mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success");
});
// 连接失败
mongoose.connection.on("erro", function () {
  console.log("MongoDB connected fail");
});
// 释放连接
mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected");
});

router.get("/", function (req, res, next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let sort = req.param("sort");
  let priceLevel = req.param("priceLevel");
  //let sort2 = req.param("sort2");
  let skip = (page - 1) * pageSize;
  let params = {};
  let priceGt=0, priceLte=0;
  if(priceLevel!="all"){
    switch(priceLevel){
      case "0" : priceGt=0;priceLte=100;break;
      case "1" : priceGt=100;priceLte=500;break;
      case "2" : priceGt=500;priceLte=1000;break;
      case "3" : priceGt=1000;priceLte=5000;break;
    };
    params = {salePrice:{
      $gt:priceGt,
      $lte:priceLte
    }};
  }
  
  let goodModel = Goods.find(params).skip(skip).limit(pageSize);
  goodModel = goodModel.sort({ "salePrice": sort }); // 不会先后顺序，可以先设置分页再排序
  goodModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        mes: err.message
      });
    } else {
      res.json({
        status: '0',
        mes: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  })
});

module.exports = router;
