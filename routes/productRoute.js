const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authMiddleware')
const Authorization = require('../middleware/adminMiddleware')

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const dotenv = require('dotenv');
dotenv.config();

const { addProduct, removeProduct, updateProduct, getProducts, getProduct } = require('../controller/productController')


router.post('/', authentication, Authorization, upload.array("image", 5), addProduct)
router.delete('/:sku', authentication, Authorization, removeProduct)
router.patch('/:sku', authentication, Authorization, updateProduct)
router.get('/', getProducts)
router.get('/:sku', getProduct)

module.exports = router;


