const {mongoose}=require("../database/db_crud");

var Schema =mongoose.Schema;

var crudSchema = new Schema({
    name: {type:String,required:true},
    email:{type:String,required:true,unique: true},
    password:{type:String,required:true},
    cpassword:{type:String},
}, {timestamps:true},{collection:"pawan"});
 
var crudModal = mongoose.model("pawan",crudSchema);

module.exports = {
    addCrud:function(data){
        var crud = new crudModal(data);
        return crud;
    },
    getCrud:function(){
        return crudModal.find()
    },

    getCrudWhere:function(base){

       return crudModal.findOne(base)
    },
    userPwdUpdate:function(where,encpwd){
        crudModal.findOne(where,function(err,doc){
            doc.password=encpwd
            doc.save();
        });
    },
}
