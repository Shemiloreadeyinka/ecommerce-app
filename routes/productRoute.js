const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authMiddleware')
const Authorization = require('../middleware/adminMiddleware')

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const dotenv = require('dotenv');
dotenv.config();

const { addProduct, removeProduct, updateProduct, getAllProducts, getProduct } = require('../controller/productController')


router.post('/', authentication, Authorization, upload.array("productImages", 3), addProduct)
router.delete('/:SKU', authentication, Authorization, removeProduct)
router.patch('/:SKU', authentication, Authorization, updateProduct)
router.get('/', getAllProducts)
router.get('/:SKU', getProduct)

module.exports = router;


