const {mongoose} = require("../database/db_crud");

var Schema = mongoose.Schema

var custSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String, required:true, unique:true},
    phone:{type:String,required:true}
},{timestamps: true},{collection:"myapp"})

var custModel = mongoose.model("myapp",custSchema);

module.exports={
    addata1:function(data){
        var ad = new custModel(data);
        return ad;
    },
    getCust1:function(where){
        return custModel.find(where);
    },
    updateCust1:function(where, data){
        return custModel.findByIdAndUpdate(where, data);
    },
    getDelete:function(id){
        return custModel.findByIdAndDelete(id);
    }

}