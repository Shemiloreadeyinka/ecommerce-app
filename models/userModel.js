const mongoose= require("mongoose")

const userSchema=new mongoose.Schema({
    name :{type: String , required: true },
    email:{type:String , required:true,lowercase:true , unique: true},
    cart:{type: mongoose.Schema.Types.ObjectId,ref:'Cart'},
    orders:[{type: mongoose.Schema.Types.ObjectId,ref:'Order'}],
    role:      { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phoneNo: { type: String , unique: true },
    address: {type: String},
    password:{type :String}

    
}, {timestamps:true})

module.exports= mongoose.model('User',userSchema)