const Product = require("../models/productModel");
const cloudinary = require('cloudinary').v2;
const fs = require("fs/promises")




const dotenv = require('dotenv');
const { Console } = require("console");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.addProduct = async (req, res) => {
  try {
    const { name, SKU, price, description, category } = req.body;

    if (!name || !SKU || !price || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingProduct = await Product.findOne({ SKU });
    if (existingProduct) {
      return res.status(400).json({ message: "SKU already exists" });
    }
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const results = await Promise.all(
        req.files.map(file =>
          cloudinary.uploader.upload(file.path, { folder: 'products' })
        )
      );
      await Promise.all(req.files.map(file => fs.unlink(file.path)));

      imageUrls = results.map(result => ({ url: result.secure_url, public_id: result.public_id }));
    } else {
      imageUrls = [{ url: "https://res.cloudinary.com/dwnqinmja/image/upload/v1756826094/cart_placeholder_jowfsp.png", public_id: "placeholder" }];
    }




    const newProduct = new Product({
      name,
      SKU,
      price,
      description,
      image: imageUrls,
      category,
    });

    await newProduct.save();

return res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { SKU } = req.params;
    const updates = { ...req.body };

    const product = await Product.findOne({ SKU });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.files && req.files.length > 0) {
      await Promise.all(
        product.image.map(img => {
          if (img.public_id !== "placeholder") { 
            return cloudinary.uploader.destroy(img.public_id);
          }
        })
      );

      const results = await Promise.all(
        req.files.map(file =>
          cloudinary.uploader.upload(file.path, { folder: "uploads" })
        )
      );

      await Promise.all(req.files.map(file => fs.unlink(file.path)));

      updates.image = results.map(result => ({
        url: result.secure_url,
        public_id: result.public_id
      }));
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { SKU },
      updates,
      { new: true }
    );

    return res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    return res.status(500).json({ message: "Error updating product", error: error.message });
  }
};


exports.removeProduct = async (req, res) => {
  try {
    const { sku } = req.params;
    const product = await Product.findOneAndDelete({ SKU: sku });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Promise.all(
      product.image.map(img => cloudinary.uploader.destroy(img.public_id))
    );

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

exports.getProducts= async(req,res)=>{
  try {
    const products = await Product.find().populate('category', 'name');
       if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    
    return res.status(200).json({success:true, products });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching product", error: error.message });
  }
}
exports.getProduct= async(req,res)=>{
  const {sku}= req.params
  try {
    const product= await Product.findOne({SKU:sku})
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching product", error: error.message });
  }
}