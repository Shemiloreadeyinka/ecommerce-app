const Cart = require('../models/cartModel')
const Product = require('../models/productModel')

exports.addProductToCart = async (req, res) => {
    const { id } = req.user
    const { productid, quantity } = req.body
    try {
        if (!productid) return res.send('product id required')
        const product = await Product.findById(productid)
        if (!product) return res.status(400).json({ message: "product doesn't exist" })
        const price = product.price
        let cart = await Cart.findOne({user: id })
        if (!cart) {
             cart = new Cart({
                user:id,
                products: [{
                    product:productid,
                    quantity: quantity || 1,
                    unitPrice: price,
                    totalPrice: price * (quantity || 1)
                }]
            });
        }
        else {
            const productIndex = cart.products.findIndex(p => p.product.toString() === productid);

            if (productIndex > -1) {

cart.products[productIndex].quantity += quantity||1;
                cart.products[productIndex].totalPrice = price * cart.products[productIndex].quantity;
            } else {
                cart.products.push({ product:productid, quantity: quantity || 1,unitPrice: price,totalPrice: price * (quantity || 1)});
            }
        }
        await cart.save()
        return res.status(200).json({ message: "product successfully added to cart" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }

}

exports.removeProductFromCart = async (req, res) => {
    const { id } = req.user
    const { productid } = req.body
    try {
        if (!productid) return res.status(400).json({ message: "input product id please" })

        let cart = await Cart.findOne({ user: id })
        if (!cart) return res.status(404).json({ message: "User has no cart" })

        const productIndex = cart.products.findIndex(
            (p) => {
                const prodId = p.product._id ? p.product._id : p.product;
                return prodId.toString() === productid
            }
        );

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        cart.products.splice(productIndex, 1);

        await cart.save();

        res.json({ message: "Product removed from cart", cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


exports.GetUserCart = async (req, res) => {
    const { id } = req.user
    try {
        const cart = await Cart.findOne({ user: id }).populate('user', 'name').populate('products.product', 'name productid')
        if (!cart) return res.status(404).json({ message: "user has no cart" })
        return res.status(200).json({ cart })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }

}