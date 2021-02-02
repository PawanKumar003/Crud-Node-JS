const {mongoose} = require("../database/db_crud");

var Schema = mongoose.Schema

var waveitesSchema = new Schema({
    name: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    phone: {type:String,required:true},
    password: {type:String,required:true}
},{timestamps:true},{collection:"waveite"});

var waveitesModel = mongoose.model("waveite",waveitesSchema);

module.exports ={
adData:function(data){
    var waveites = new waveitesModel(data);
    return waveites;
},

userPawUpdate: function(where,encpaw){
    waveitesModel.findOne(where,function(err, doc){
        doc.password = encpaw
        doc.save();
    });
},

whereData: function(data){

    return waveitesModel.findOne(data)
        
        // function(err, doc) {
        // if (err)
        //  throw err;
                
        // result = (doc != null && doc.email != '') ? doc.email : '';
        // return result;

    }
}