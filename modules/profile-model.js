const {mongoose} = require("../database/db_crud");

var Schema = mongoose.Schema

var profilead = new Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    myfile:{type:String, required:true}
},{timestamps:true}, {collection:"detail"});

var profileadd = mongoose.model("detail", profilead);

module.exports={
    add:function(data){
        crud = new profileadd(data)
        return crud;
    },

    findimg:function(){
        return profileadd.findOne()
    }
}