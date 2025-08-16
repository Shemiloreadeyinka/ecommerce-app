const express= require('express');
const router = express.Router();
const authentication= require('../middleware/authMiddleware')
const Authorization = require('../middleware/adminMiddleware')
const {addProduct,removeProduct,updateProduct,getAllProducts,getProduct}= require('../controller/productController')


router.post('/',authentication,Authorization, addProduct)
router.delete('/:SKU',authentication,Authorization,  removeProduct)
router.patch('/:SKU',authentication,Authorization, updateProduct)
router.get('/',getAllProducts)
router.get('/:SKU',getProduct)

module.exports = router;