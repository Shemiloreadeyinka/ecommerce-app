const express= require('express');
const router = express.Router();
const {addProductToCart,
removeProductFromCart,
GetUserCart,
clearCart,
checkoutCart}= require('../controller/cartController')
const authentication =require('../middleware/authMiddleware')
const Authorization =require('../middleware/adminMiddleware')


router.post('/',authentication,addProductToCart)
router.delete('/:productid',authentication,removeProductFromCart)
router.get('/',authentication,GetUserCart)
router.delete('/',authentication,clearCart)
router.post('/checkout',authentication,checkoutCart)


module.exports = router;