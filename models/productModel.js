const mongoose= require('mongoose');
const productSchema= new mongoose.Schema({
    name :   { type :String, required:true  },
    SKU :{type:String, required:true,unique:true},
    price: {type : Number, required:true, min: 0},
    description: {type : String, required:true},
image: [{ type: String, required: true }],
    category:{type : mongoose.Schema.Types.ObjectId,ref:'Category',required: true}



})

module.exports= mongoose.model("Product", productSchema)