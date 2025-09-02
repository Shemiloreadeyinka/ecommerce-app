const Category = require('../models/categoryModel')
const cloudinary = require('cloudinary').v2;
const fs = require("fs/promises")

exports.addCategory = async (req, res) => {
    console.log(req.body)
    let { name, description } = req.body
        name = name?.trim().toLowerCase()|| null
    try {
        if (!name) return res.status(400).json({ message: "Name of category required" })
        let category = await Category.findOne({ name})
        if (category) return res.status(400).json({ message: "Category already exists" })
            if (req.file) {
                        const result = await cloudinary.uploader.upload(req.file.path, {
                            folder: 'uploads',
                        });
                        await fs.unlink(req.file.path);
                        profilePicUrl = result.secure_url;
                    }
        category = new Category({ name, description: description || "", image: profilePicUrl })
        await category.save()
        return res.status(201).json({ message: "category created successfully" })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }


}
exports.getCategory = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) return res.status(400).json({ message: "Category ID required" });
        let category = await Category.findById(id);
        if (!category) return res.status(404).json({ message: "Category doesn't exist" });
        return res.status(200).json({ message: "Category retrieved", category });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



exports.getAllCategories = async (req, res) => {
    try {
        let categories = await Category.find()
        return res.status(200).json({ message: "categories retrieved", categories })

    } catch (error) {
        return res.status(500).json({ error: error.message })

    }

}

exports.deleteCategory= async (req,res) => {
    let {id} = req.params

    try {
        const deletedCategory = await Category.findByIdAndDelete(id)
        if (!deletedCategory) return res.status(404).json({ message: "category doesn't exist" })
        return res.status(200).json({ message: "category successfully deleted", deletedCategory })
    } catch (error) {
                return res.status(500).json({ error: error.message })

    }
    
}

exports.updateCategory = async (req, res) => {
    let { name } = req.params
    name = name?.trim().toLowerCase()

    let { newName, description, image } = req.body
    newName = newName?.trim().toLowerCase()

    try {
        if (!name) return res.status(400).json({ message: "Category name required" })

        const category = await Category.findOne({ name })
        if (!category) return res.status(404).json({ message: "Category doesn't exist" })

        if (newName) {
            const nameExists = await Category.findOne({ name: newName })
            if (nameExists && nameExists._id.toString() !== category._id.toString()) {
                return res.status(400).json({ message: "Category with this new name already exists" })
            }
            category.name = newName
        }

        if (description !== undefined) category.description = description
        if (image !== undefined) category.image = image

        await category.save()
        return res.status(200).json({ message: "Category updated successfully", category })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
