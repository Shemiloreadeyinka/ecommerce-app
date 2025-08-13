const mongoose= require('mongoose');
const OrderSchema= new mongoose.schema({
    user:mongoose.Schema.Types.ObjectId,ref:'User',required:true,
    orderNumber:{type:String,unique:true,required:true},
    address:{type:String,required:true},
    products:[{
        productid:mongoose.Schema.Types.ObjectId,ref:'Product',required:true,
        quantity:{type:Number,required:true,default:1},
    }],
    shippingFee:{type:Number , required: true, default: 3000}, 
    totalAmount:{type:Number,required:true},
    status:{type:String,enum:['Pending','Shipped','Delivered','Cancelled'],default:'Pending'},
},{timestamps:true});

module.exports= mongoose.model('Order', OrderSchema);