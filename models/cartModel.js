const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  products:[{
    productid: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    quantity: {type: Number, required: true, default: 1},
    unitPrice: {type: Number, required: true},
    totalPrice: {type: Number, required: true}
  }]



})

module.exports = mongoose.model('Cart', cartSchema);