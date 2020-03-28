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
  Goods.find({}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        mes: err.message
      });
    }else {
        res.json({
          status: '1',
          mes: '',
          result: {
            count:doc.length,
            list:doc
          }
        });
      }
  })
});

module.exports = router;
