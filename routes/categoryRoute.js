const express= require('express');
const router = express.Router();
const {addCategory,getCategory,getAllCategories,deleteCategory,updateCategory}=require('../controller/categoryController')
const authentication =require('../middleware/authMiddleware')
const Authorization =require('../middleware/adminMiddleware')


router.post('/', authentication,addCategory)
router.get('/:name', authentication,getCategory)
router.get('/', authentication,Authorization,getAllCategories)
router.delete('/:name', authentication,Authorization,deleteCategory)
router.patch('/:name', authentication,Authorization,updateCategory)

module.exports = router;