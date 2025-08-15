const User = require('../models/userModel')
const Cart = require('../models/cartModel')
const Order = require('../models/ordersModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {
    const { name, email, role, phoneNo, address, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "user already exists" });
        const hashedPassword = await bcrypt.hash(password, 10)
        user = new User({ name, email, role, phoneNo, address, password: hashedPassword })
        await user.save()
        return res.status(201).json({ message: "user successfully registered" })
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
            { id: user._id },
            process.env.JWT_TOKEN,
            { expiresIn: '1h' }

        )
        res.cookie('token', token, { httpOnly: true })
        return res.status(200).json({ message: 'login successful' })
    } catch (error) {
        return res.status(500).json({ error: error.message })

    }
}
exports.getOneUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id).populate('cart').populate('orders')
        if (!user) return res.status(400).json({ message: 'user doesnt exist' })
        return res.status(200).json({ message: 'successful', user })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


exports.getallUsers = async (req, res) => {
    try {
        const users = await User.find().populate('orders').populate('cart')

        return res.status(200).json({ message: 'successful', users })
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
        return res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
