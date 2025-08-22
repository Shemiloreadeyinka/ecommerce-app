const express= require('express');
const router = express.Router();
const {addCategory,getCategory,getAllCategories,deleteCategory,updateCategory}=require('../controller/categoryController')
const authentication =require('../middleware/authMiddleware')
const Authorization =require('../middleware/adminMiddleware')


router.post('/', authentication,addCategory)
router.get('/:id', authentication,getCategory)
router.get('/', authentication,getAllCategories)
router.delete('/:id', authentication,Authorization,deleteCategory)
router.patch('/:name', authentication,Authorization,updateCategory)

module.exports = router;