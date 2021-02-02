const {mongoose} = require('../database/db_crud');

var Schema = mongoose.Schema

var customerSchema = new Schema({
    name:{type:String,require:true},
    email:{type:String,unique: true,required:true},
    phone:{type:String,required:true},
    adress:{type:String,required:true}
},{timestamps:true},{collection:"customer"});

var customerModel = mongoose.model("customer",customerSchema);

module.exports={
    insertCust:function(data){
        var customer = new customerModel(data);
        return customer;
    },

    getCust:function(where){
        return customerModel.find(where)
    },

    updateCust:function(where, data){
        return customerModel.findByIdAndUpdate(where, data)
    },
    deleteCust:function(id){
        return customerModel.findByIdAndDelete(id);
    }
}





