const { findOneAndDelete } = require('../models/cartModel')
const Product = require('../models/productModel')

exports.addProduct= async (req,res)=>{
        const {name,price,image,SKU,description} = req.body
        try {
            if (!name) return res.status(400).json({message:'please include Product details'})
                const product=await Product.findOne({SKU})
            if (product) return res.status(400).json({message: 'this product already exists'})
            product= new Product({
                name:name,
                price:price,
                image:image,
                SKU:SKU,
                description:description
            })
            await product.save()
            return res.status(200).json({message:"product successfully saved" })
        } catch (error) {
            return res.status(500).json({error:error.message})
        }

}

exports.removeProduct=async(req,res)=>{
    const {SKU}=req.body
    try {
        if(!SKU) return res.status(400).json({message:'please enter store keeping unit'})
            let product= await Product.findOneAndDelete({SKU})
        if (!product)return res.status(400).json({message:"product doesn't exist"})
        
        return res.status(200).json({message: "product deleted successfully"})
        
    } catch (error) {
                    return res.status(500).json({error:error.message})

    }
}

exports.getAllProducts= async(req,res)=>{
    try {
       const products=await Product.find()
        return res.status(200).json({message:"successfully retrieved all products", products})
    } catch (error) {
     return res.status(500).json({error:error.message})
    }
}

exports.getProduct= async (req,res) => {
    try {
        
    const {SKU}= req.params
    if (!SKU) return res.status(400).json({message:" please input store keeping unit"})
        const product = await Product.findOne({SKU})
    if(!product)return res.status(404).json({message:"product doesnt exist"})
        return res.status(200).json({success:true, product})
 
    } catch (error) { 
     return res.status(500).json({error:error.message})
    }   
}