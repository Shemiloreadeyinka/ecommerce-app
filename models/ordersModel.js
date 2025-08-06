const mongoose= require('mongoose');
const OrderSchema= new mongoose.schema({
    user:mongoose.Schema.Types.ObjectId,ref:'User',required:true,
    products:[{
        product:mongoose.Schema.Types.ObjectId,ref:'Product',required:true,
        quantity:{type:Number,required:true,default:1},
        price:{type:Number,required:true}
    }],
    totalAmount:{type:Number,required:true},
    status:{type:String,enum:['Pending','Shipped','Delivered','Cancelled'],default:'Pending'},
},{timestamps:true});

module.exports= mongoose.model('Order', OrderSchema);