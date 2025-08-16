const Order = require('../models/ordersModel')
const Cart = require('../models/cartModel');
const { v4: uuidv4 } = require('uuid'); // for unique order numbers

// CUSTOMER CONTROLLERS
exports.createOrder = async (req, res) => {
        const { address, shippingFee } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('products.productid');

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        const totalAmount = cart.products.reduce((total, item) => {
            return total + (item.productid.price * item.quantity);
        }, 0) + (shippingFee || cart.shippingFee || 0);


        const order = new Order({
            user: req.user.id,
            orderNumber: uuidv4().split('-')[0], // short unique id
            address,
            products : cart.products,
            shippingFee,
            totalAmount
        });

        await order.save();
      return  res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    const {id}= req.user
    try {
        const orders = await Order.find({user: id}).populate('products.productid');
      return  res.status(201).json({message:'successful',orders});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
        const {id}= req.user
        const {_id}= req.params

    try {
        const order = await Order.findOne({ id, _id})
            .populate('products.productid');
        if (!order) return res.status(404).json({ message: 'Order not found' });
      return  res.status(201).json({message:'successful', order});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelOrder = async (req, res) => {

    try {
        const order = await Order.findOne({ _id: req.params._id, user: req.user.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.status !== 'Pending') {
            return res.status(400).json({ message: 'Order cannot be cancelled' });
        }
        order.status = 'Cancelled';
        await order.save();
       return res.status(200).json({message:'successful',cancelledOrder: order});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.trackOrder = async (req, res) => {

    try {
        const order = await Order.findOne({ _id: req.params._id, user: req.user.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });
       return res.status(200).json({ status: order.status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  ADMIN CONTROLLERS
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('products.productid');
       return res.status(200).json({message:'successful', orders});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrdersByUser = async (req, res) => {
    const {id}= req.params
    try {
        const orders = await Order.find({user:id })
            .populate('products.productid');
      return  res.status(200).json({message:'successful',orders});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const {orderid}= req.params
    try {
        const { status } = req.body;
        const order = await Order.findById(orderid);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.status = status;
        await order.save();
       return res.status(200).json({message:'successful',order});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateShipping = async (req, res) => {
    const {orderid}=req.params
    try {
        const { address, shippingFee } = req.body;
        const order = await Order.findById(orderid);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (address) order.address = address;
        if (shippingFee) order.shippingFee = shippingFee;

        await order.save();
        return res.status(200).json({message:'successful',order});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
            const {orderid}=req.params

    try {
        const order = await Order.findByIdAndDelete(orderid);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        return res.status(200).json({ message: 'Order deleted',order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
