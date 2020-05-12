let mongoose=require("mongoose");
let Schema=mongoose.Schema;

let userSchema=new Schema({
    "name":{type:String},
    "password": String,
});
// 数据库默认小写， 因为表名区分大小写，这里需要指定表名
module.exports=mongoose.model("User",userSchema,"Users");