
const User = require('../models/userModel')
const Cart = require('../models/cartModel')
const Order = require('../models/ordersModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require("fs/promises")

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
dotenv.config();


exports.register = async (req, res) => {
    const { name, email, role, phoneNo, address, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "user already exists" });
        const hashedPassword = await bcrypt.hash(password, 10)

        let profilePicUrl = "https://res.cloudinary.com/dwnqinmja/image/upload/v1756825319/profilepic_s4skl9.jpg";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads',
            });
            profilePicUrl = result.secure_url;
            await fs.unlink(req.file.path);
        }

        user = new User({ name, email, role, phoneNo, address, password: hashedPassword, pfp: profilePicUrl })
        await user.save()
        const { password: _, ...userData } = user.toObject();

        return res.status(201).json({ message: "user successfully registered", user: userData  });
    } catch (error) {
        return res.status(500).json({ message: `Error saving user: ${error.message}` });
    }

}
exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "user doesn't exist" })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "password is incorrect" })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }

    )
    res.cookie('token', token, { httpOnly: true })
    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({ message: 'login successful', userData })
  } catch (error) {
    return res.status(500).json({ error: error.message })

  }
}
exports.getOneUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id).populate('cart').populate('orders')
        if (!user) return res.status(404).json({ message: 'user doesnt exist' })
        return res.status(200).json({ message: 'successful', user })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('orders').populate('cart')
       const newusers= users.map(user => {
              const { password: _, ...userData } = user.toObject()
              return userData
        })
        return res.status(200).json({ message: 'successful', users: newusers })
    } catch (error) {
        return res.status(500).json({ error: `error in getting all users${error.message}` })
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) return res.status(400).json({ message: "userId Required" })
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        await Cart.deleteOne({ user: id });
        await Order.deleteMany({ user: id });
         if (req.files && req.files.length > 0) {

          if (deletedUser.pfp && deletedUser.pfp.public_id && deletedUser.pfp.public_id !== "placeholder") {
            return await cloudinary.uploader.destroy(deletedUser.pfp.public_id);

        }}
        return res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
  const { id } = req.user;

  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      if (
        user.pfp &&
        user.pfp.public_id &&
        user.pfp.public_id !== "placeholder"
      ) {
        await cloudinary.uploader.destroy(user.pfp.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads",
      });
      await fs.unlink(req.file.path);

      user.pfp = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const { name, email, role, phoneNo, address } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (phoneNo) user.phoneNo = phoneNo;
    if (address) user.address = address;

    await user.save();

    const { password, ...updatedUser } = user.toObject();

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};
