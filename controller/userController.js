const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt= require('bcrypt')

exports.register=async(req,res)=> {
    const {name, email,role,phoneNo,address,password}=req.body
    try {
        let user= User.findOne({email})
        if (user) return res.status(400).json({message:"user already exists"});
        const hashedPasword=await bcrypt.hash(password,10)
        user= new User({name, email,role,phoneNo,address,password:hashedPasword})
        await user.save()
         return res.status(200).json({message:"user successfully registered"})
    } catch (error) {
        return res.json({message: `error saving user: ${error}`})
    }
    
}

exports.login=async(req,res)=>{
    const{email,password}=req.body
    try {
        const user=await User.findOne({email})
        if(!user) return res.status(400).json({message:"user doesn't exist"})
        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) res.status(400).json({message:"password is incorrect"})

       const token = jwt.sign(
        {id:user._id},
        process.env.JWT_TOKEN,
        {expiresIn:'1h'}

       )
       res.cookie('token',token, {httpOnly:true})
        return res.status(200).json({message:'login successful'})
    } catch (error) {
        
    }
}
exports.getOneUser= async(req,res)=>{
    const {email}=req.body
    try {
        const user= await User.findOne({email}).populate('cart').populate('orders')
        if (!user) return res.status(400).json({message:'user doesnt exist'})  
        return res.status(200).json({message:user})       
        
    } catch (error) {
        return res.json(500).json({error:error.message})
    }
}


exports.getallUsers= async (req,res) => {
    const users = User.find().populate('orders').populate('cart').populate('orders')
    try {
        return res.status(200).json({message:users})
    } catch (error) {
        return res.status(400).json({error :`error in getting all users${error.message}`})
    }
}