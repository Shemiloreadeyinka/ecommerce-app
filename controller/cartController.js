const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const Order = require('../models/ordersModel');
const User = require('../models/userModel');


exports.addProductToCart = async (req, res) => {
    const { id } = req.user
    const { productid, quantity } = req.body
    console.log(req.body)
    try {
        if (!productid) return res.send('product id required')
        const product = await Product.findById(productid)
        if (!product) return res.status(400).json({ message: "product doesn't exist" })
        const price = product.price
        let cart = await Cart.findOne({ user: id })
        if (!cart) {
            cart = new Cart({
                user: id,
                products: [{
                    productid: productid,
                    quantity: quantity || 1,
                    unitPrice: price,
                    totalPrice: price * (quantity || 1)
                }]
            });
        }
        else {
            const productIndex = cart.products.findIndex(p => p.productid.toString() === productid);

            if (productIndex > -1) {

                cart.products[productIndex].quantity += quantity || 1;
                cart.products[productIndex].totalPrice = price * cart.products[productIndex].quantity;
            } else {
                cart.products.push({ productid: productid, quantity: quantity || 1, unitPrice: price, totalPrice: price * (quantity || 1) });
            }
        }
        await cart.save()
        return res.status(200).json({ message: "product successfully added to cart" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }

}

exports.removeProductFromCart = async (req, res) => {
    const { id } = req.user;
    const { productid } = req.params;

    try {
        if (!productid) {
            return res.status(400).json({ message: "Input product id please" });
        }

        let cart = await Cart.findOne({ user: id });
        if (!cart) {
            return res.status(404).json({ message: "User has no cart" });
        }

        // Remove the product completely
        const productIndex = cart.products.findIndex((p) => {
            const prodId = p._id || p.productid;
            return prodId.toString() === productid;
        });

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        cart.products.splice(productIndex, 1);

        await cart.save();
        await cart.populate({ path: "products.productid", select: 'name SKU category', populate: { path: "category", select: '-_id name' } });

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



exports.GetUserCart = async (req, res) => {
    const { id } = req.user
    try {
        const cart = await Cart.findOne({ user: id }).populate('user', 'name').populate({
            path: 'products.productid', select: '-_id name category', populate: { path: 'category', select: '-_id name' }
        });
        if (!cart) return res.status(404).json({ message: "user has no cart" })
        return res.status(200).json({ cart })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }

}

exports.clearCart = async (req, res) => {
    const { id } = req.user;

    try {
        const cart = await Cart.findOne({ user: id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.products = [];
        await cart.save();

        return res.status(200).json({ message: 'Cart cleared', cart });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


exports.checkoutCart = async (req, res) => {
    const { id } = req.user;
    const { shippingAddress } = req.body;

    try {
        const cart = await Cart.findOne({ user: id })
        const user = await User.findById(id);
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        const totalAmount = cart.products.reduce((total, item) => total + item.totalPrice, 0);

        const orderNumber = "ORD-" + Date.now();
        const order = new Order({
            user: id,
            products: cart.products.map(p => ({
                productid: p.productid,
                quantity: p.quantity,
                unitPrice: p.unitPrice,
                totalPrice: p.totalPrice
            })),
            totalAmount,
            orderNumber: orderNumber,
            status: 'Pending',
            address: shippingAddress || 'Not provided'
        });
        await order.save();

        await user.orders.push(order._id);
        await user.save();

        cart.products = [];
        await cart.save();

        return res.status(201).json({ message: 'Checkout successful', order });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
