var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var Users=new Schema(
    {
        "handle":{type:String,required: true,unique: true},
        "displayName":{type:String,required: true},
        "password": {type:String,required: true}
    },{versionKey: false }

);

module.exports=mongoose.model('Users', Users, 'Users'); 
